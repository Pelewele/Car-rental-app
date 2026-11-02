export type Screen =
  | "welcome"
  | "otp"
  | "home"
  | "results"
  | "detail"
  | "verify"
  | "checkout"
  | "confirmed"
  | "trips"
  | "chat"
  | "inspection"
  | "return"
  | "review"
  | "support"
  | "dispute"
  | "profile"
  | "delivery-tracking";

export interface Host {
  name: string;
  initials: string;
  avatarBg: string;
  rating: number;
  trips: number;
  responseRate: string;
  joined: string;
  verified: boolean;
  phone: string;
}

export interface Car {
  id: string;
  name: string;
  modelYear: number;
  type: "Economy" | "SUV" | "Family" | "Luxury";
  pricePerDay: number;
  neighborhood: string;
  distanceKm: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid";
  seats: number;
  bags: number;
  doors: number;
  rating: number;
  reviewCount: number;
  tripsCompleted: number;
  images: string[];
  host: Host;
  features: string[];
  mileagePolicy: string;
  fuelPolicy: string;
  rules: string[];
  depositGh: number;
  deliveryAvailable: boolean;
  deliveryFeeGh: number;
  description: string;
}

export interface Message {
  id: string;
  sender: "host" | "renter";
  text: string;
  time: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  category: string;
  bookingRef: string;
  description: string;
  status: "Received" | "Under Review" | "Resolved";
  date: string;
}

export interface BookingDraft {
  carId: string | null;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  deliverySelected: boolean;
  deliveryAddress?: string;
  deliveryWindow?: string;
}

export interface TripRecord {
  id: string;
  carId: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  deliverySelected: boolean;
  deliveryAddress?: string;
  status: "upcoming" | "active" | "past";
  totalAmount: number;
  bookingRef: string;
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
