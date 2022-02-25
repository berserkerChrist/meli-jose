/* import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DispatchModel, DispatchPayload, RequestDispatchPayload } from "../interfaces/dispatch-model";
import { ShipmentResponse } from "../interfaces/shipment-model";

@Injectable()

export class DispatchService {

  readonly _rootURL = 'https://api.mercadolibre.com';

  constructor(private http: HttpClient){}

  _requestDispatchData(payload: DispatchPayload){
    return this.http.get<DispatchModel>
    (this._rootURL + '/dispatch/' + payload.id + '/carta-porte-details?access_token=' + payload.authToken)
  }

  _requestByRoute(dispatchPayload: RequestDispatchPayload){
    return this.http.get<ShipmentResponse>
    (this._rootURL + dispatchPayload.url +'&access_token=' + dispatchPayload.authToken)
  }

}
 */
