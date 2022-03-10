import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';import { Title } from '@angular/platform-browser';
import { ClipboardService } from 'ngx-clipboard';
import { Observable, map, shareReplay } from 'rxjs';
import { FileModel } from 'src/app/interfaces/file-model';
import { NotifierService } from 'src/app/services/notifier.service';
import * as XLSX from 'xlsx'

export interface TableModel {
  goods: string,
  desc: string,
  qty: number,
  unit_code: string,
  weight: number,
  net_worth: number
}

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})

export class OrganizerComponent implements OnInit {

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.tableDataSource.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.tableDataSource.paginator = paginator;
  }

  newDataArray: any = []
  compactedData: any = []
  itemTable!: TableModel[]
  tableDataSource = new MatTableDataSource<TableModel>(this.itemTable);
  files: File[] = [];
  isSelected = true;
  isVisible = false;
  entryFile!: FileModel[];
  displayedColumns:string[] = ['goods', 'desc', 'qty', 'unit_code', 'weight', 'net_worth']
  order!: string;
  delivery!: string;
  recipientName!: string;
  totalCodes!: number;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, private clipboard: ClipboardService, private notifications: NotifierService, private titleService: Title) {  }

  ngOnInit(): void {
  }

	onSelect(event: any) {
		this.files.push(...event.addedFiles);
    this.isSelected = false;
    this.isVisible = true;
    const selectedFile = event.addedFiles[0];
    const fileManager = new FileReader();
    fileManager.readAsBinaryString(selectedFile);
    fileManager.onload = (readEvent) => {
      let binaryData = readEvent.target?.result;
      let workbook = XLSX.read(binaryData, {type: 'binary'})
      workbook.SheetNames.forEach(sheet => {
        this.entryFile = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      })
      let tableArray:TableModel[] = this.entryFile.map((a) => {
        return { goods: a.BienesTransp, desc:a.Descripción, qty: a.Cantidad, unit_code: a.ClaveUnidad, weight: a['Peso en KG'], net_worth: a['Valor neto']}
      })
      this._sortData(tableArray)//this.tableDataSource.data = tableArray;
      this.recipientName = this.entryFile[0]['Razón soc. Destino']
      this.delivery = this.entryFile[0].Entrega
      this.order = this.entryFile[0].Pedido
      this.totalCodes = tableArray.length
      console.log(tableArray.length)
    }
	}

  _sortData(unsortedData: TableModel[]){
    const groupByKey = (array: any[], key:string) => {
      return array.reduce((hash, obj) => {
        if(obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
      }, {})
    }
    this.newDataArray = Object.entries(groupByKey(unsortedData, 'goods'))
    this.newDataArray.forEach((array: any[]) => {
      let weightAcc = 0, qtyAcc = 0, nwAcc = 0;
      this.compactedData.push(
        array[1].reduce((obj: any, item: any) => {
          weightAcc += item.weight;
          qtyAcc += item.qty;
          nwAcc += item.net_worth;
          return obj = { goods: item.goods, desc: item.desc, qty: qtyAcc, unit_code: item.unit_code, weight: weightAcc, net_worth: nwAcc, length: array[1].length }
        }, 0)
      )
    })
    this.notifications.showNotification('¡Datos cargados con éxito!', 'Cerrar', 'success')
    this.tableDataSource.data = this.compactedData;
    //console.log(this.compactedData)
/*  const mergeData = (data:any[]) => {
    const result:any = {}; //(1)

      data.forEach(basket => { //(2)
        for (let [key, value] of Object.entries(basket)) { //(3)
          if (result[key]) { //(4)
            result[key] += value; //(5)
          } else { //(6)
            result[key] = value;
          }
        }
      });
      return result; //(7)
    };

    console.log(mergeData(unsortedData))
    const newObject: any = {} */

    /* const uniqueGoods = Array.from(new Set( unsortedData.map(a => a.goods) ))
    let groupedData = {} = from(unsortedData).pipe(
      groupBy(item => item.goods),
      mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    )
    groupedData.subscribe(console.log) */
    /* const groupedData = (list: any[], key:string) => {
      list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})
    }
    let groupedData = {} = from(unsortedData).pipe(
      groupBy(item => item.goods),
      mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    )
    groupedData.subscribe(console.log)
    */

    /* let iterableData = Object.keys(result)
    iterableData.forEach((key) => {
      newArray.push()
    }) */
  }

	onRemove(event: any) {
    this.isSelected = true;
    this.isVisible = false;
    this.tableDataSource.data = []
    this.compactedData = []
		console.log(this.tableDataSource.data);
		this.files.splice(this.files.indexOf(event), 1);
	}

  copy(copiedValue: any){
    this.clipboard.copyFromContent(copiedValue);
    this.notifications.showNotification(`Copiado al portapapeles`, 'Cerrar', 'success');
  }

}
