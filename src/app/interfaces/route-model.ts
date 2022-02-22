export interface RoutePayload {
  id: string,
  authToken: string | null;
}

export interface RequestRoutePayload{
  url: string,
  authToken: string | null;
}

export interface RouteModel {
  id:        string;
  cost:      string;
  shipments: Shipment[];
}

interface Shipment {
  entity_id:  string;
  url: string;
}
