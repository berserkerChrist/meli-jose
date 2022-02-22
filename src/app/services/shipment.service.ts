import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ShipmentPayload, ShipmentResponse } from "../interfaces/shipment-model";

@Injectable()

export class ShipmentService {

  readonly _rootURL = 'https://api.mercadolibre.com/shipments/';

  constructor(private http: HttpClient){}

  _requestShipmentData(payload: ShipmentPayload){
    return this.http.get<ShipmentResponse>
    (this._rootURL + payload.id +'/carta-porte-details/' + payload.serviceType + '?access_token=' + payload.authToken + '&logistic_center=' + payload.serviceCenter)
  }

}
