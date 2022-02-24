import { Component, OnInit, ViewChild } from '@angular/core';
import { DispatchModel } from 'src/app/interfaces/dispatch-model';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ShipmentResponse } from 'src/app/interfaces/shipment-model';
import { DispatchService } from 'src/app/services/dispatch.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { ClipboardService } from 'ngx-clipboard';

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
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {

  /* first table */
  dispatchData!: DispatchModel;
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

  selectedShipment!: string | null;
  isLoading = false;
  isHidden = true;
  cargoIsHidden = true;
  shipCost!: string | null;
  totalItems!: number | null;
  private authTokenKey!: string;

  constructor(private dispatchService: DispatchService, private notifications: NotifierService, private clipboard: ClipboardService) { }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
    this.cargoDataSource.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  ngOnInit(): void {
    let token = localStorage.getItem('auth');
    this.authTokenKey = token!;
  }

  onSubmit(form: NgForm){
    this.cargo = null
    this.isLoading = true;
    this.isHidden = true
    this.dispatchService._requestDispatchData({
      id: form.value.dispatchID,
      authToken: this.authTokenKey
    }).subscribe({ next: (response) => {
        this.dispatchData = response;
        this.shipCost = this.dispatchData.cost
        this.totalItems = this.dispatchData.shipments.length
        this.dataSource.data = this.dispatchData.shipments as DataTable[];
        this.isLoading = false
        this.isHidden = false
      },
      error: (error) => {
        this.isLoading = false;
        if(error.status == 500){
          this.notifications.showNotification('Error interno en API de Mercado Libre', 'Cerrar', 'error');
        } else if (error.status == 401) {
          this.notifications.showNotification('Por favor, renueva el token de acceso', 'Cerrar', 'error');
        } else if (error.status == 403) {
          this.notifications.showNotification('Acceso a API denegado', 'Cerrar', 'error');
        } else if (error.status == 404) {
          this.notifications.showNotification('Datos no encontrados, por favor revisa de nuevo los datos', 'Cerrar', 'error');
        }
      }
    })
  }

  onRowClick(disMeta: DataTable){
    this.cargoIsHidden=false
    this.selectedShipment = disMeta.entity_id
    this.dispatchService._requestByRoute({
      url: disMeta.url,
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
    console.log(copiedValue)
    this.clipboard.copyFromContent(copiedValue);
    this.notifications.showNotification(`Se copió ${copiedValue} al portapapeles`, 'Cerrar', 'success');
  }

}
