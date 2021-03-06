import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouteModel } from 'src/app/interfaces/route-model';
import { RouteService } from 'src/app/services/route.service';
import { MatTableDataSource } from '@angular/material/table';
import { ShipmentResponse } from 'src/app/interfaces/shipment-model';
import { NotifierService } from 'src/app/services/notifier.service';
import { ClipboardService } from 'ngx-clipboard';
import * as XLSX from 'xlsx'

export interface DataTable {
  entity_id: string,
  url: string
}

export interface ResponseData {
  description: string;
  category: string;
  unit_code: string;
  quantity: string;
  dimensions: {
    height: string,
    width: string,
    length: string,
    weight: string
  }
}

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})

export class RouteComponent implements OnInit {

  /* first table */
  routeData!: RouteModel;
  routeTable!: DataTable[];
  displayedColumns: string[] = ['entity_id'];
  dataSource = new MatTableDataSource<DataTable>(this.routeTable);
  /* first table */

  /* second table */
  cargo!: ShipmentResponse | null;
  itemTable!: ResponseData[];
  cargoColumns: string[] = ['category', 'description', 'unit_code', 'quantity', 'dimensions']
  cargoDataSource = new MatTableDataSource<ResponseData>(this.itemTable);
  /* second table */

  /* hiddenTable */
  hiddenItemTable!: ResponseData[];
  hiddenDataSource = new MatTableDataSource<ResponseData>(this.hiddenItemTable)
  hiddenColumns: string[] = ['category', 'description', 'unit_code', 'quantity', 'dimensions']
  /* hiddenTable */

  isLoading = false;
  isHidden = true;
  cargoIsHidden = true;
  selectedRoute!: string | undefined;
  private authTokenKey!: string | null;
  shipCost!: string | null;
  totalItems!: number | null;
  copiedArray!: string;
  allDataArray: Array<any> = []
  fileName!: string;

  constructor(private routeService: RouteService, private notifications: NotifierService, private clipboard: ClipboardService) {
    let token = localStorage.getItem('auth');
    this.authTokenKey = token!;
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.cargoDataSource.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  ngOnInit(): void {
  }


  onSubmit(form: NgForm){
    this.cargo = null
    this.isLoading = true;
    this.isHidden = true
    this.fileName = form.value.routeID;
    this.routeService._requestRouteData({
      id: form.value.routeID,
      authToken: this.authTokenKey
    }).subscribe({ next: (response) => {
      this.routeData = response;
      this.shipCost = this.routeData.cost
      this.totalItems = this.routeData.shipments.length
      this.dataSource.data = this.routeData.shipments as DataTable[];
      this.isLoading = false
      this.isHidden = false
      let filteredArray = response.shipments.map(({url, ...rest})=> {
        return rest
      })
      let array = filteredArray.map((obj) => obj.entity_id)
      this.copiedArray = array.join(", ")
      this._prepareAllData(this.routeData);
    },
    error: (error) => {
      this.isLoading = false;
      if(error.status == 500){
        this.notifications.showNotification('Error interno en API de Mercado Libre', 'Cerrar', 'error');
      } else if (error.status == 401) {
        this.notifications.showNotification('Por favor, renueva el token de acceso', 'Cerrar', 'error');
      } else if (error.status == 403) {
        this.notifications.showNotification('Acceso a API denegado', 'Cerrar', 'error');
      } else if (error.status == 404 || error.status == 400 ) {
        this.notifications.showNotification('Datos no encontrados, por favor revisa de nuevo los datos', 'Cerrar', 'error');
      }
    }
  })
  }

  _prepareAllData(array: RouteModel){
    array.shipments.forEach(item => {
      this.routeService._requestByRoute({
        url: item.url,
        authToken: this.authTokenKey
      }).subscribe({next: (resp) => {
          resp.package.items.forEach((item => {
            //;
            let mapped = { Categoria: item.category, Descripcion: item.description, Cantidad: item.quantity, Clave: item.unit_code, Medida: 'KG', Peso: (parseInt(item.dimensions.weight)/1000) }
            this.allDataArray.push(mapped)
          }))
        },
        error: (err => console.log(err))})
      })
      //console.log(this.allDataArray)
  }

  _exportData(){
    const sheet = XLSX.utils.json_to_sheet(this.allDataArray)
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    XLSX.writeFile(workbook, `Datos - ${this.fileName}.xlsx`);
  }

  onRowClick(routeMeta: DataTable){
    this.cargoIsHidden=false
    this.selectedRoute = routeMeta.entity_id
    this.routeService._requestByRoute({
      url: routeMeta.url,
      authToken: this.authTokenKey
    }).subscribe(resp => {
      this.cargo = resp;
      this.cargoDataSource.data = this.cargo.package.items as ResponseData[]
    })
  }

  _lenght(value: any){
    const inputValue = String(value);
    return inputValue.length;
  }

  copy(copiedValue: any){
    this.clipboard.copyFromContent(copiedValue);
    this.notifications.showNotification(`Copiado al portapapeles`, 'Cerrar', 'success');
  }



}
