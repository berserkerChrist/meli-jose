import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RequestRoutePayload, RouteModel, RoutePayload } from "../interfaces/route-model";
import { ShipmentResponse } from "../interfaces/shipment-model";

@Injectable()

export class RouteService {

  readonly _rootURL = 'https://api.mercadolibre.com';

  constructor(private http: HttpClient){}

  _requestRouteData(payload: RoutePayload){
    return this.http.get<RouteModel>(this._rootURL + '/routes/' + payload.id + '/carta-porte-details?access_token=' + payload.authToken)
  }

  _requestByRoute(routePayload: RequestRoutePayload){
    return this.http.get<ShipmentResponse>
    (this._rootURL + routePayload.url +'?access_token=' + routePayload.authToken)
  }

}
