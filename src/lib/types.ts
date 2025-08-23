export interface Timestamp{
  _nanoseconds: number;
  _seconds: number;
}

export interface Country {
  name: string;
  code: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  age?: string;
  count?: number;
  created?: Timestamp | string;
  email?: string;
  phone?: string;
  enrolled?: string;
  gender?: string;
  name?: string;
  points?: number;
  state?: string;
  updated?: Timestamp | string;
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
  [key: string]: any; // Allow other properties
}

export interface Event {
  id: string;
  created?: Timestamp | string;
  enrolled?: string;
  name?: string;
  state?: string;
  updated?: Timestamp | string;
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
  [key: string]: any; // Allow other properties
}

export interface Transaction {
  id?: string;
  actual_charges?: string;
  charge_estimate?: string;
  failed_amount?: number;
  file_id?: string;
  paid_amount?: string;
  provider_reference?: string;
  status?: string;
  created?: Timestamp | string;
  updated?: Timestamp | string;
  source?: string;
  total_amount?: string;
  total_amount_estimate?: string;
  tracking_id?: string;
  userId?: string;
  sent?: {
    push: string;
    sms: string;
  };
  [key: string]: any; // Allow other properties
}

export interface Smartbin {
  id: string;
  name: string;
  status: "deployed" | "maintenance" | "storage" | "deactivated";
  address: {
    city: string;
    detail: string;
    name: string;
    country: string;
  };
  coords: {
    lat: number;
    lng: number;
  };
  client?: {
    id: string;
    name: string;
  };
  created?: Timestamp | string;
  updated?: Timestamp | string;
  dbSync?: Timestamp | string;
  imgSync?: Timestamp | string;
  [key: string]: any; // Allow other properties
}

export interface SmartbinDrop {
  id: string;
  binDropId: string;
  binId: string;
  created: Timestamp | string;
  location: {
    lat: number;
    lng: number;
  };
  other: number;
  plastic: number;
  source: string;
  status: string;
  timestamp: Timestamp | string;
  sync_source?: string;
  synced?: Timestamp | string;
  userId?: string;
  [key: string]: any; // Allow other properties
}

export interface Request {
  id: string;
  address: string;
  pickup: Timestamp | string;
  source: string;
  status: string;
  timestamp: Timestamp | string;
  userId: string;
  [key: string]: any; // Allow other properties
}

export interface Pickup {
  id: string;
  quantity: number;
  status: string;
  submitted: string;
  timestamp: Timestamp | string;
  type: string;
  userId: string;
  [key: string]: any; // Allow other properties
}

export interface Employee {
  id: string;
  email: string;
  name: string | null;
  notId?: string;
  [key: string]: any; // Allow other properties
}

export interface Casual {
  id: string;
  phoneNumber: string;
  name: string | null;
  [key: string]: any; // Allow other properties
}

export interface CasualEngagement {
  id: string;
  casualId: string;
  start: Timestamp | string;
  end: Timestamp | string;
  status: string;
  [key: string]: any; // Allow other properties
}

export interface Client {
  id: string;
  name: string;
  [key: string]: any; // Allow other properties
}

export interface UserFrequency {
  phoneNumber: string;
  name: string;
  state: string;
  count: number;
  [key: string]: any; // Allow other properties
}
