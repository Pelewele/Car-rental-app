export type OwnerScreen =
  | "welcome"
  | "otp"
  | "approval-status"
  | "jobs"
  | "vehicles"
  | "add-edit-vehicle"
  | "calendar"
  | "booking-detail"
  | "chat"
  | "earnings"
  | "maintenance"
  | "support"
  | "dispute"
  | "profile";

export type OwnerApprovalStatus = "pending_review" | "approved" | "rejected" | "suspended";

export type VehicleStatus = "approved" | "pending_review" | "draft" | "paused" | "unavailable";

export interface HostVehicle {
  id: string;
  name: string;
  modelYear: number;
  type: "Economy" | "SUV" | "Family" | "Luxury";
  pricePerDay: number;
  depositGh: number;
  neighborhood: string;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  seats: number;
  plateNumber: string;
  status: VehicleStatus;
  deliveryAvailable: boolean;
  deliveryFeeGh: number;
  mileagePolicy: string;
  fuelPolicy: string;
  cancellationPolicy: string;
  rules: string[];
  images: string[];
  tripsCompleted: number;
  rating: number;
}

export type DeliveryStatus =
  | "pending_assignment"
  | "driver_assigned"
  | "en_route"
  | "arrived"
  | "handover_complete"
  | "no_driver_available"
  | "delayed"
  | "location_unavailable"
  | "cancelled";

export interface DeliveryDriver {
  name: string;
  initials: string;
  avatarBg: string;
  rating: number;
  plateNumber: string;
  phone: string;
}

export interface OwnerDeliveryJob {
  id: string;
  bookingRef: string;
  vehicleName: string;
  vehiclePlate: string;
  renterName: string;
  renterContactMasked: string;
  deliveryAddress: string;
  deliveryWindow: string;
  deliveryFeeGh: number;
  status: DeliveryStatus;
  driver: DeliveryDriver | null;
  etaMinutes: number;
}

export interface PayoutRecord {
  id: string;
  date: string;
  amountGh: number;
  tripRef: string;
  vehicle: string;
  status: "Paid" | "Processing" | "Pending";
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  vehicle: string;
  serviceType: string;
  costGh: number;
  garage: string;
}
