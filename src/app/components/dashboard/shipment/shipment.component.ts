import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ShipmentResponse } from 'src/app/interfaces/shipment-model';
import { NotifierService } from 'src/app/services/notifier.service';
import { ShipmentService } from 'src/app/services/shipment.service';

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
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss']
})

export class ShipmentComponent implements OnInit{

  shipmentData!: ShipmentResponse | null;
  tableData!: ResponseData[];
  displayedColumns: string[] = ['category', 'description', 'unit_code', 'quantity', 'dimensions'];
  dataSource = new MatTableDataSource<ResponseData>(this.tableData);
  options = [
    {name: 'Primera milla', value: 'first_mile'},
    {name: 'Media milla', value: 'middle_mile'},
    {name: 'Última milla', value: 'last_mile'}]
  selected!: string | null;
  isLoading = false;
  isHidden = true;
  shipCost!: string | null;
  totalItems!: string | null;

  constructor(private shipService: ShipmentService, private notifications: NotifierService ) { }
  private authTokenKey!: string | null;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  ngOnInit(): void {
    let token = localStorage.getItem('auth');
    this.authTokenKey = token!;
  }

  _lenght(value: any){
    const inputValue = String(value);
    return inputValue.length;
  }

  onSubmit(form: NgForm){
    this.isLoading = true;
    this.isHidden = true
    this.shipmentData = null
    this.shipService._requestShipmentData({
      authToken: this.authTokenKey,
      id: form.value.shipmentID,
      serviceCenter: form.value.originID? form.value.originID : '' ,
      serviceType: form.value.selectedValue
    }).subscribe({next: (response) => {
      this.isLoading = false
      this.isHidden = false
      this.shipmentData = response
      this.totalItems = this.shipmentData.package.total_items
      this.dataSource.data = this.shipmentData.package.items as ResponseData []
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
        } else if (error.status == 400) {
          this.notifications.showNotification('Datos de embarque erroneos, por favor revisa de nuevo los datos', 'Cerrar', 'error');
        }
      }
    })
  }

}
