export interface ShipmentPayload {
  authToken: string | null,
  id: string,
  serviceCenter: string,
  serviceType: string
}

export interface ShipmentResponse {
  recipient:   Recipient;
  origin:      Destination;
  destination: Destination;
  package:     Package;
}

interface Destination {
  fiscal_information: FiscalInformation;
  address:            Address;
}

interface Address {
  address_line:  string;
  street_name:   string;
  street_number: string;
  intersection:  string;
  zip_code:      string;
  city:          City;
  state:         City;
  country:       City;
  neighborhood:  City;
  municipality:  City;
}


interface City {
  id:   string;
  name: string;
}

interface FiscalInformation {
  full_name:        string;
  rfc:              string;
  fiscal_residence: string;
}

interface Package {
  items:       Item[];
  total_items: string;
}

interface Item {
  category:    string;
  description: string;
  unit_code:   string;
  quantity:    string;
  dimensions:  Dimensions;
}

interface Dimensions {
  height: string;
  width:  string;
  length: string;
  weight: string;
}

interface Recipient {
  rfc:       string;
  full_name: string;
}
