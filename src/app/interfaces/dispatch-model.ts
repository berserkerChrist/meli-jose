export interface DispatchPayload {
  id: string,
  authToken: string | null;
}

export interface RequestDispatchPayload{
  url: string,
  authToken: string | null;
}

export interface DispatchModel {
  id:        string;
  cost:      string;
  shipments: Shipment[];
}

interface Shipment {
  entity_id:  string;
  url: string;
}
