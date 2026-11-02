import { useEffect, useState, useMemo, type ReactNode } from "react";
import React from "react";

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
  | "delivery-tracking"
  | "owner-deliveries"
  | "admin-deliveries"
  | "driver-workspace";




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
  phone: string;
  rating: number;
  plateNumber: string;
  etaMinutes: number;
}

export interface AdminDeliveryJob {
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
  lastUpdated: string;
  auditTrail: { time: string; event: string; actor: string }[];
  supportHistory: { date: string; note: string; status: string }[];
}


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
  deliveryAddress: string;
  deliveryWindow: string;
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
  deliveryWindow?: string;
  deliveryStatus?: DeliveryStatus;
  status: "upcoming" | "active" | "past";
  totalAmount: number;
  bookingRef: string;
  fuelLevel?: string;
}

const FLEET: Car[] = [
  {
    id: "car-corolla-2022",
    name: "Toyota Corolla",
    modelYear: 2022,
    type: "Economy",
    pricePerDay: 420,
    neighborhood: "East Legon",
    distanceKm: 2.4,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    bags: 2,
    doors: 4,
    rating: 4.88,
    reviewCount: 34,
    tripsCompleted: 42,
    images: [
      "https://images.unsplash.com/photo-1640973655413-f5fd13295f8f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85",
    ],
    host: {
      name: "Kwame Osei",
      initials: "KO",
      avatarBg: "var(--gold)",
      rating: 4.95,
      trips: 48,
      responseRate: "100%",
      joined: "Host since 2023",
      verified: true,
      phone: "+233 24 412 8890",
    },
    features: ["Air Conditioning", "Bluetooth Audio", "Reverse Camera", "USB Charger", "Eco Mode"],
    mileagePolicy: "200 km/day included (GH₵2.50 per excess km)",
    fuelPolicy: "Same-to-same (pick up full, return full)",
    rules: ["No smoking in vehicle", "Valid Ghana/International licence required", "Greater Accra only (regional trips need prior approval)"],
    depositGh: 500,
    deliveryAvailable: true,
    deliveryFeeGh: 80,
    description: "Reliable, well-maintained Toyota Corolla in East Legon. Fuel-efficient with chilling A/C, ideal for business meetings, airport runs, or daily commutes across Accra.",
  },
  {
    id: "car-bmw-x3-2021",
    name: "BMW X3 xDrive",
    modelYear: 2021,
    type: "SUV",
    pricePerDay: 780,
    neighborhood: "Airport Residential",
    distanceKm: 1.8,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    bags: 4,
    doors: 4,
    rating: 4.96,
    reviewCount: 52,
    tripsCompleted: 61,
    images: [
      "https://images.unsplash.com/photo-1670951295478-975b208d31c2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
    ],
    host: {
      name: "Kofi Boateng",
      initials: "KB",
      avatarBg: "#4a7c59",
      rating: 4.98,
      trips: 75,
      responseRate: "98%",
      joined: "Host since 2022",
      verified: true,
      phone: "+233 20 890 1234",
    },
    features: ["Panoramic Sunroof", "Apple CarPlay & Android Auto", "Leather Seats", "360° Parking Camera", "Dual Climate Control"],
    mileagePolicy: "250 km/day included (GH₵3.50 per excess km)",
    fuelPolicy: "Same-to-same (pick up full, return full)",
    rules: ["No smoking", "Chauffeur available upon request", "Primary driver must be 23+"],
    depositGh: 800,
    deliveryAvailable: true,
    deliveryFeeGh: 100,
    description: "Luxury compact SUV stationed 5 minutes from Kotoka International Airport. Smooth all-wheel drive, refined interior, and top-tier sound system.",
  },
  {
    id: "car-lexus-es-2020",
    name: "Lexus ES 350",
    modelYear: 2020,
    type: "Luxury",
    pricePerDay: 690,
    neighborhood: "Cantonments",
    distanceKm: 3.1,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    bags: 3,
    doors: 4,
    rating: 4.91,
    reviewCount: 29,
    tripsCompleted: 35,
    images: [
      "https://images.unsplash.com/photo-1787510026651-3b53ebe37093?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=85",
    ],
    host: {
      name: "Nana Ama Sarpong",
      initials: "NA",
      avatarBg: "#c4882e",
      rating: 4.94,
      trips: 39,
      responseRate: "100%",
      joined: "Host since 2023",
      verified: true,
      phone: "+233 55 123 4567",
    },
    features: ["Executive Leather", "Mark Levinson Premium Sound", "Ventilated Front Seats", "Tinted Privacy Glass", "Keyless Entry"],
    mileagePolicy: "200 km/day included (GH₵3.00 per excess km)",
    fuelPolicy: "Same-to-same (pick up full, return full)",
    rules: ["Strictly non-smoking", "City driving preferred", "No unpaved rough tracks"],
    depositGh: 750,
    deliveryAvailable: true,
    deliveryFeeGh: 80,
    description: "Executive luxury sedan with whisper-quiet cabin and plush ride comfort. Stationed in Cantonments near embassy row. Pristine condition guaranteed.",
  },
  {
    id: "car-tucson-2023",
    name: "Hyundai Tucson",
    modelYear: 2023,
    type: "SUV",
    pricePerDay: 550,
    neighborhood: "Dzorwulu",
    distanceKm: 2.8,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    bags: 3,
    doors: 4,
    rating: 4.85,
    reviewCount: 19,
    tripsCompleted: 24,
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1670951295478-975b208d31c2?auto=format&fit=crop&w=1000&q=85",
    ],
    host: {
      name: "Yaw Mensah",
      initials: "YM",
      avatarBg: "#2c5282",
      rating: 4.88,
      trips: 28,
      responseRate: "96%",
      joined: "Host since 2024",
      verified: true,
      phone: "+233 24 555 7788",
    },
    features: ["Modern Digital Cockpit", "Lane Keep Assist", "Rear View Camera", "Spacious Boot", "LED Headlights"],
    mileagePolicy: "200 km/day included (GH₵2.50 per excess km)",
    fuelPolicy: "Same-to-same (pick up full, return full)",
    rules: ["No smoking", "Family friendly", "Pets allowed with carrier"],
    depositGh: 600,
    deliveryAvailable: true,
    deliveryFeeGh: 70,
    description: "Futuristic styling, elevated ground clearance for Accra speed bumps, and high safety rating. Perfect for weekend family outings to Aburi or Ada.",
  },
  {
    id: "car-prado-2022",
    name: "Toyota Land Cruiser Prado",
    modelYear: 2022,
    type: "SUV",
    pricePerDay: 1200,
    neighborhood: "Labone",
    distanceKm: 3.5,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
    bags: 5,
    doors: 4,
    rating: 5.0,
    reviewCount: 46,
    tripsCompleted: 58,
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1670951295478-975b208d31c2?auto=format&fit=crop&w=1000&q=85",
    ],
    host: {
      name: "Emmanuel Kyeremeh",
      initials: "EK",
      avatarBg: "var(--forest)",
      rating: 5.0,
      trips: 82,
      responseRate: "100%",
      joined: "Host since 2022",
      verified: true,
      phone: "+233 27 778 9900",
    },
    features: ["Robust 4WD", "Cool Box / Mini Fridge", "7 Seats Capacity", "High Clearance", "Heavy Duty Suspension"],
    mileagePolicy: "300 km/day included (GH₵4.00 per excess km)",
    fuelPolicy: "Same-to-same (diesel)",
    rules: ["Permitted for upcountry travel (Kumasi, Cape Coast, Takoradi)", "No smoking", "Clean return required"],
    depositGh: 1200,
    deliveryAvailable: true,
    deliveryFeeGh: 120,
    description: "The gold standard for Ghanaian road trips. Rugged, imposing, and ultra-comfortable with 7 seats, high suspension, and onboard beverage cooler.",
  },
  {
    id: "car-civic-2021",
    name: "Honda Civic",
    modelYear: 2021,
    type: "Economy",
    pricePerDay: 380,
    neighborhood: "Osu",
    distanceKm: 4.2,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    bags: 2,
    doors: 4,
    rating: 4.82,
    reviewCount: 22,
    tripsCompleted: 30,
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1640973655413-f5fd13295f8f?auto=format&fit=crop&w=1000&q=85",
    ],
    host: {
      name: "Abena Twum",
      initials: "AT",
      avatarBg: "#702459",
      rating: 4.89,
      trips: 34,
      responseRate: "97%",
      joined: "Host since 2023",
      verified: true,
      phone: "+233 24 333 4455",
    },
    features: ["Touchscreen Display", "Apple CarPlay", "Fuel Saver Mode", "Compact Parking", "Alloy Wheels"],
    mileagePolicy: "200 km/day included (GH₵2.50 per excess km)",
    fuelPolicy: "Same-to-same (pick up full, return full)",
    rules: ["No smoking", "Accra metropolis only"],
    depositGh: 500,
    deliveryAvailable: true,
    deliveryFeeGh: 60,
    description: "Zippy, modern, and very fuel-efficient sedan based right in central Osu near Oxford Street. Effortless to maneuver through Accra traffic.",
  },
  {
    id: "car-hiace-2020",
    name: "Toyota HiAce Grand Cabin",
    modelYear: 2020,
    type: "Family",
    pricePerDay: 850,
    neighborhood: "Spintex",
    distanceKm: 5.6,
    transmission: "Manual",
    fuel: "Diesel",
    seats: 12,
    bags: 6,
    doors: 4,
    rating: 4.86,
    reviewCount: 35,
    tripsCompleted: 44,
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1640973655413-f5fd13295f8f?auto=format&fit=crop&w=1000&q=85",
    ],
    host: {
      name: "Joseph Annan",
      initials: "JA",
      avatarBg: "#2d3748",
      rating: 4.9,
      trips: 50,
      responseRate: "99%",
      joined: "Host since 2021",
      verified: true,
      phone: "+233 20 111 2233",
    },
    features: ["12 Comfortable Highback Seats", "Rear Air Conditioning Ducts", "Luggage Compartment", "PA System Placeholder", "Tinted Windows"],
    mileagePolicy: "250 km/day included (GH₵3.50 per excess km)",
    fuelPolicy: "Same-to-same (diesel)",
    rules: ["Manual transmission experience required", "Professional driver option available", "No smoking"],
    depositGh: 900,
    deliveryAvailable: true,
    deliveryFeeGh: 100,
    description: "Generous 12-seater passenger van located on Spintex Road. Best choice for large family gatherings, corporate team outings, or church delegations.",
  },
];

const iconPaths: Record<string, ReactNode> = {
  home: <><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  trips: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/></>,
  back: <path d="m15 18-6-6 6-6"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  shield: <><path d="M12 3 4.5 6v5c0 5 3 8 7.5 10 4.5-2 7.5-5 7.5-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  filter: <><path d="M4 7h16M7 12h10M10 17h4"/></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15m6-12v15"/></>,
  heart: <path d="M20 5c-2-2-5-2-8 1-3-3-6-3-8-1-2 3-1 7 8 15 9-8 10-12 8-15Z"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  chat: <><path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3Z"/></>,
  camera: <><path d="M4 8h4l2-3h4l2 3h4v11H4Z"/><circle cx="12" cy="13" r="3"/></>,
  alert: <><path d="M12 3 2 21h20Z"/><path d="M12 9v5m0 3v.1"/></>,
  phone: <path d="M7 3 4 5c0 8 7 15 15 15l2-3-5-3-2 2c-3-1-5-3-6-6l2-2Z"/>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  x: <path d="M18 6 6 18M6 6l12 12"/>,
  share: <><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  fuel: <><path d="M3 22h12M4 9h10v13H4z"/><circle cx="9" cy="6" r="2"/><path d="M14 9l4-4 2 2-3 3v7a2 2 0 0 1-2 2h-1"/></>,
  key: <><circle cx="7.5" cy="15.5" r="3.5"/><path d="M10.8 12.2L21 2m-3 2 2 2-3 3-2-2"/></>,
  truck: <><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
};

function Icon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {iconPaths[name]}
    </svg>
  );
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`logo ${inverse ? "inverse" : ""}`}>
      <span className="logo-mark"><span /></span>
      <span>KasaRide</span>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className={`btn ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Badge({ children, gold = false }: { children: ReactNode; gold?: boolean }) {
  return (
    <span className={`badge ${gold ? "gold" : ""}`}>
      <Icon name="shield" size={13} />
      {children}
    </span>
  );
}

function Header({
  title,
  back,
  action,
}: {
  title?: string;
  back?: () => void;
  action?: ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="topbar-side">
        {back ? (
          <button className="icon-btn" onClick={back} aria-label="Go back">
            <Icon name="back" />
          </button>
        ) : (
          <Logo />
        )}
      </div>
      {title && <strong>{title}</strong>}
      <div className="topbar-side end">{action}</div>
    </header>
  );
}

function BottomNav({
  active,
  go,
  role = "renter",
}: {
  active: string;
  go: (s: Screen) => void;
  role?: "renter" | "owner" | "admin" | "driver";
}) {
  const renterItems: [string, string, Screen][] = [
    ["home", "Home", "home"],
    ["search", "Search", "results"],
    ["trips", "Trips", "trips"],
    ["user", "Profile", "profile"],
  ];

  const ownerItems: [string, string, Screen][] = [
    ["map", "Delivery Jobs", "owner-deliveries"],
    ["trips", "Fleet", "home"],
    ["user", "Profile", "profile"],
  ];

  const adminItems: [string, string, Screen][] = [
    ["shield", "Dispatch", "admin-deliveries"],
    ["map", "Owner Jobs", "owner-deliveries"],
    ["trips", "Fleet", "home"],
    ["user", "Profile", "profile"],
  ];

  const driverItems: [string, string, Screen][] = [
    ["map", "Driver Jobs", "driver-workspace"],
    ["shield", "Dispatch", "admin-deliveries"],
    ["trips", "Owner Jobs", "owner-deliveries"],
    ["user", "Profile", "profile"],
  ];

  const items =
    role === "driver"
      ? driverItems
      : role === "admin"
      ? adminItems
      : role === "owner"
      ? ownerItems
      : renterItems;

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(([icon, label, screen]) => (
        <button
          key={label}
          className={active === screen ? "active" : ""}
          onClick={() => go(screen)}
        >
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Page({
  children,
  nav,
  go,
  role = "renter",
  className = "",
}: {
  children: ReactNode;
  nav?: string;
  go?: (s: Screen) => void;
  role?: "renter" | "owner" | "admin" | "driver";
  className?: string;
}) {
  return (
    <div className={`app-shell ${nav ? "with-nav" : ""} ${className}`}>
      <main>{children}</main>
      {nav && go && <BottomNav active={nav} go={go} role={role} />}
    </div>
  );
}

function CarCard({
  car,
  onClick,
  horizontal = false,
  isUnavailable = false,
  unavailReason = "Out for delivery",
}: {
  car: Car;
  onClick?: () => void;
  horizontal?: boolean;
  isUnavailable?: boolean;
  unavailReason?: string;
}) {
  return (
    <button className={`car-card ${horizontal ? "horizontal" : ""}`} onClick={onClick}>
      <div className="car-img">
        <img src={car.images[0]} alt={`${car.name} in Accra`} loading="lazy" />
        <span className="demo-label" style={isUnavailable ? { background: "#991b1b" } : undefined}>
          {isUnavailable ? "UNAVAILABLE" : "ACCRA DEMO"}
        </span>
        <span className="heart" aria-label="Save to favourites">
          <Icon name="heart" size={17} />
        </span>
      </div>
      <div className="car-info">
        <div className="car-title">
          <div>
            <small>{car.type} · {car.modelYear}</small>
            <h3>{car.name}</h3>
          </div>
          <div className="price">
            <strong>GH₵{car.pricePerDay}</strong>
            <small>/day</small>
          </div>
        </div>
        <p>
          <Icon name="pin" size={14} /> {car.neighborhood} · {car.distanceKm} km
        </p>
        {isUnavailable && (
          <div className="vehicle-unavail-badge" style={{ marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#991b1b", fontSize: 10, fontWeight: 800 }}>
              <Icon name="alert" size={13} /> {unavailReason}
            </span>
          </div>
        )}
        <div className="car-meta">
          <Badge>Verified car</Badge>
          <span>{car.transmission}</span>
          <span>{car.seats} seats</span>
          <span>★ {car.rating} ({car.reviewCount})</span>
        </div>
      </div>
    </button>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [appRole, setAppRole] = useState<"renter" | "owner" | "admin" | "driver">("renter");
  const [signedInRole, setSignedInRole] = useState<"renter" | "owner" | "admin" | "driver" | null>("renter");

  // Verification & Approval demo states
  const [ownerApprovalStatus, setOwnerApprovalStatus] = useState<"approved" | "pending_review" | "rejected">("approved");
  const [driverApprovalStatus, setDriverApprovalStatus] = useState<"approved" | "pending_approval" | "suspended">("approved");

  // Welcome sign-in local form states
  const [welcomeRoleTab, setWelcomeRoleTab] = useState<"renter" | "owner" | "admin" | "driver">("renter");
  const [authCredentialInput, setAuthCredentialInput] = useState("+233 24 456 7890");
  const [authOtpInput, setAuthOtpInput] = useState("284196");
  const [adminPinInput, setAdminPinInput] = useState("8890");
  const [showDemoRoleSwitcher, setShowDemoRoleSwitcher] = useState(false);

  const [pickupChecklist, setPickupChecklist] = useState<number[]>([]);
  const [handoverChecklist, setHandoverChecklist] = useState<number[]>([]);



  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    carId: "car-corolla-2022",
    pickupDate: "2025-07-18",
    pickupTime: "09:00",
    returnDate: "2025-07-21",
    returnTime: "18:00",
    deliverySelected: false,
    deliveryAddress: "",
    deliveryWindow: "09:00 – 11:00",
  });

  const [trips, setTrips] = useState<TripRecord[]>([]);

  // Search & filter state
  const [searchLocation, setSearchLocation] = useState("East Legon, Accra");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [transmissionFilter, setTransmissionFilter] = useState<string>("All");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc">("recommended");
  const [searchQuery, setSearchQuery] = useState("");

  // Checkout options

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"momo_mtn" | "momo_telecel" | "card">("momo_mtn");
  const [momoNumber, setMomoNumber] = useState("+233 24 456 7890");
  const [momoProcessing, setMomoProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [bookingRef, setBookingRef] = useState("KR-A7F2D9");

  // Verification state
  const [verifiedDriver, setVerifiedDriver] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<number[]>([]);
  const [uploadLoading, setUploadLoading] = useState<number | null>(null);
  const [simulateFail, setSimulateFail] = useState(false);
  const [failError, setFailError] = useState<string | null>(null);

  // Trips state
  const [tripTab, setTripTab] = useState<"upcoming" | "active" | "past">("active");
  const [mileageUsed, setMileageUsed] = useState(428);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "host",
      text: "Hi Ama, hope your Accra trip is going smoothly! Let me know when you are about 20 minutes from the East Legon drop-off.",
      time: "13:08",
      read: true,
    },
    {
      id: "m2",
      sender: "renter",
      text: "Everything is great with the Corolla, thanks! I am in Osu right now and will message before heading back.",
      time: "13:11",
      read: true,
    },
    {
      id: "m3",
      sender: "host",
      text: "Perfect. Take your time, see you at the same pickup gate.",
      time: "13:12",
      read: true,
    },
  ]);
  const [composerText, setComposerText] = useState("");

  // Inspection state
  const inspectionAngles = [
    "Front bumper & grille",
    "Rear bumper & boot",
    "Left side body",
    "Right side body",
    "Interior & seats",
    "Dashboard & odometer",
    "All 4 tyres",
    "Fuel level gauge",
  ];
  const [pickupInspections, setPickupInspections] = useState<number[]>([]);
  const [returnInspections, setReturnInspections] = useState<number[]>([0, 1, 2]);
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [inspectionAck, setInspectionAck] = useState(false);
  const [inspectingTripId, setInspectingTripId] = useState<string | null>(null);
  const [fuelLevelCaptured, setFuelLevelCaptured] = useState<string | null>(null);

  // Support & Dispute state
  const [supportCategory, setSupportCategory] = useState("Security deposit refund");
  const [supportNotes, setSupportNotes] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "KS-1048",
      category: "Roadside assistance inquiry",
      bookingRef: "KR-A7F2D9",
      description: "Inquiry on tyre assistance protocol on Tema motorway.",
      status: "Resolved",
      date: "17 Jul 2025",
    },
  ]);
  const [ticketCreated, setTicketCreated] = useState(false);

  // Delivery state
  const [deliveryConsentAccepted, setDeliveryConsentAccepted] = useState(false);
  const [activeDeliveryTripId, setActiveDeliveryTripId] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("pending_assignment");
  const [deliveryDriver, setDeliveryDriver] = useState<DeliveryDriver | null>(null);
  const [deliveryEta, setDeliveryEta] = useState(18);

  const DEMO_DRIVER: DeliveryDriver = {
    name: "Kofi Mensah",
    initials: "KM",
    avatarBg: "#2c5282",
    phone: "+233 24 701 8845",
    rating: 4.91,
    plateNumber: "GR-2847-21",
    etaMinutes: 18,
  };

  const DELIVERY_WINDOWS = [
    "08:00 – 10:00",
    "10:00 – 12:00",
    "12:00 – 14:00",
    "14:00 – 17:00",
  ];

  const advanceDeliveryStatus = () => {
    const order: DeliveryStatus[] = [
      "pending_assignment",
      "driver_assigned",
      "en_route",
      "arrived",
      "handover_complete",
    ];
    setDeliveryStatus(prev => {
      const idx = order.indexOf(prev);
      if (idx < 0 || idx >= order.length - 1) return prev;
      const next = order[idx + 1];
      if (next === "driver_assigned") setDeliveryDriver(DEMO_DRIVER);
      if (next === "en_route") setDeliveryEta(12);
      if (next === "arrived") setDeliveryEta(0);
      return next;
    });
  };

  // System states
  const [isOffline, setIsOffline] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const selectedCar = FLEET.find((c) => c.id === bookingDraft.carId) || FLEET[0];

  const rentalDays = useMemo(() => {
    try {
      const p = new Date(bookingDraft.pickupDate).getTime();
      const r = new Date(bookingDraft.returnDate).getTime();
      const diff = Math.ceil((r - p) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  }, [bookingDraft.pickupDate, bookingDraft.returnDate]);

  const subtotal = selectedCar.pricePerDay * rentalDays;
  const serviceFee = Math.round(subtotal * 0.1);
  const deliveryFee = bookingDraft.deliverySelected ? selectedCar.deliveryFeeGh : 0;
  const depositFee = selectedCar.depositGh;
  const totalAmount = Math.max(0, subtotal + serviceFee + deliveryFee + depositFee - promoDiscount);

  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Start a pre-trip inspection for a specific upcoming trip
  const startInspection = (tripId: string) => {
    setInspectingTripId(tripId);
    setPickupInspections([]);
    setInspectionNotes("");
    setInspectionAck(false);
    setFuelLevelCaptured(null);
    go("inspection");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  useEffect(() => {
    document.title = "KasaRide — Trusted Ghana Car Rental";
  }, []);

  // Filtered cars logic
  const filteredCars = useMemo(() => {
    return FLEET.filter((car) => {
      if (categoryFilter !== "All" && car.type !== categoryFilter) return false;
      if (transmissionFilter !== "All" && car.transmission !== transmissionFilter) return false;
      if (verifiedOnly && !car.host.verified) return false;
      if (
        searchQuery.trim() !== "" &&
        !car.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !car.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-desc") return b.pricePerDay - a.pricePerDay;
      return b.rating - a.rating;
    });
  }, [categoryFilter, transmissionFilter, verifiedOnly, searchQuery, sortBy]);

  // Apply promo
  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === "AKWAABA10") {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setAppliedPromo("AKWAABA10 (10% off)");
      showToast("Promo AKWAABA10 applied! GH₵" + discount + " off.");
    } else if (code === "ACCRAFREE") {
      setPromoDiscount(50);
      setAppliedPromo("ACCRAFREE (GH₵50 off)");
      showToast("Promo ACCRAFREE applied! GH₵50 off.");
    } else {
      showToast("Invalid promo code. Try 'AKWAABA10'");
    }
  };

  // Chat send message simulation
  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || composerText).trim();
    if (!content) return;
    const newMsg: Message = {
      id: "m-" + Date.now(),
      sender: "renter",
      text: content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setComposerText("");

    // Simulate automated host response
    setTimeout(() => {
      const replies = [
        "Received! Thanks for checking in, drive safely.",
        "Understood. If you need any assistance along the route, don't hesitate to call.",
        "Sounds good! The car is ready for your inspection whenever you arrive.",
        "Thank you! Everything looks orderly on our end.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: "m-reply-" + Date.now(),
          sender: "host",
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: true,
        },
      ]);
    }, 1200);
  };

  // Payment execution simulation
  const handleExecutePayment = () => {
    setMomoProcessing(true);
    setTimeout(() => {
      setMomoProcessing(false);
      const newRef = "KR-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setBookingRef(newRef);

      // Reset delivery state for new booking
      if (bookingDraft.deliverySelected) {
        setDeliveryStatus("pending_assignment");
        setDeliveryDriver(null);
        setDeliveryEta(18);
        setActiveDeliveryTripId(newRef);
      }

      const newTrip: TripRecord = {
        id: newRef,
        carId: bookingDraft.carId || FLEET[0].id,
        pickupDate: bookingDraft.pickupDate,
        pickupTime: bookingDraft.pickupTime,
        returnDate: bookingDraft.returnDate,
        returnTime: bookingDraft.returnTime,
        deliverySelected: bookingDraft.deliverySelected,
        ...(bookingDraft.deliverySelected && {
          deliveryAddress: bookingDraft.deliveryAddress || "East Legon, Accra (Demo)",
          deliveryWindow: bookingDraft.deliveryWindow,
          deliveryStatus: "pending_assignment" as DeliveryStatus,
        }),
        status: "upcoming",
        totalAmount,
        bookingRef: newRef,
      };

      setTrips(prev => [newTrip, ...prev]);
      setScreen("confirmed");
      showToast("Payment verified! Reference: " + newRef);
    }, 1800);
  };

  return (
    <>
      {/* Dev / Prototype Toolbar */}
      <div className="dev-sim-bar" role="toolbar" aria-label="Prototype Controls">
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Badge gold>PROTOTYPE</Badge>
          <span style={{ fontSize: 11, fontWeight: 700 }}>Active Role: {appRole.toUpperCase()}</span>
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setShowDemoRoleSwitcher(!showDemoRoleSwitcher)}
            style={{ background: showDemoRoleSwitcher ? "var(--forest)" : undefined, color: showDemoRoleSwitcher ? "#fff" : undefined }}
            title="Open Demo Account Switcher for testing"
          >
          <Icon name="user" size={14} /> Demo Account Switcher
          </button>
          <button
            onClick={() => {
              setIsOffline(!isOffline);
              showToast(isOffline ? "Network online" : "Offline mode simulated");
            }}
            className={isOffline ? "active" : ""}
            title="Toggle offline state simulation"
          >
            {isOffline ? "Offline ON" : "Offline Mode"}
          </button>
        </div>
      </div>

      {/* Collapsible Demo Account Switcher Drawer */}
      {showDemoRoleSwitcher && (
        <div style={{ background: "#1a202c", color: "#fff", padding: "12px 16px", fontSize: 11, borderBottom: "2px solid var(--forest)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong>Demo Account & Approval State Switcher</strong>
            <button onClick={() => setShowDemoRoleSwitcher(false)} style={{ background: "transparent", color: "#a0aec0", border: "none", cursor: "pointer", fontSize: 14 }}>✕ Close</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span>Role Workspace:</span>
            <button
              style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: appRole === "renter" ? "var(--forest)" : "#2d3748", color: "#fff", cursor: "pointer" }}
              onClick={() => { setAppRole("renter"); setSignedInRole("renter"); go("home"); showToast("Switched to Renter view"); }}
            >
              Renter
            </button>
            <button
              style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: appRole === "owner" ? "var(--forest)" : "#2d3748", color: "#fff", cursor: "pointer" }}
              onClick={() => { setAppRole("owner"); setSignedInRole("owner"); go("owner-deliveries"); showToast("Switched to Host view"); }}
            >
              Host ({ownerApprovalStatus})
            </button>
            <button
              style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: appRole === "driver" ? "var(--forest)" : "#2d3748", color: "#fff", cursor: "pointer" }}
              onClick={() => { setAppRole("driver"); setSignedInRole("driver"); go("driver-workspace"); showToast("Switched to Driver view"); }}
            >
              Driver ({driverApprovalStatus})
            </button>
            <button
              style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: appRole === "admin" ? "var(--forest)" : "#2d3748", color: "#fff", cursor: "pointer" }}
              onClick={() => { setAppRole("admin"); setSignedInRole("admin"); go("admin-deliveries"); showToast("Switched to Admin Dispatch"); }}
            >
              Admin Dispatch
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8, paddingTop: 8, borderTop: "1px solid #2d3748" }}>
            <span>Owner Status:</span>
            <select
              value={ownerApprovalStatus}
              onChange={(e) => setOwnerApprovalStatus(e.target.value as any)}
              style={{ background: "#2d3748", color: "#fff", border: "1px solid #4a5568", borderRadius: 4, padding: "2px 6px", fontSize: 11 }}
            >
              <option value="approved">Approved (Active Fleet)</option>
              <option value="pending_review">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
            <span>Driver Status:</span>
            <select
              value={driverApprovalStatus}
              onChange={(e) => setDriverApprovalStatus(e.target.value as any)}
              style={{ background: "#2d3748", color: "#fff", border: "1px solid #4a5568", borderRadius: 4, padding: "2px 6px", fontSize: 11 }}
            >
              <option value="approved">Approved (Active Driver)</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              style={{ marginLeft: "auto", background: "#e53e3e", color: "#fff", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}
              onClick={() => { go("welcome"); showToast("Signed out. Back to Welcome screen."); }}
            >
              Sign Out to Welcome
            </button>
          </div>
        </div>
      )}

      {/* Offline Banner */}
      {isOffline && (
        <div className="offline-banner" role="alert">
          <Icon name="alert" size={16} />
          <span>You are currently in offline demo mode. Serving cached Accra vehicles.</span>
          <button onClick={() => setIsOffline(false)}>Go Online</button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* SCREEN: WELCOME */}
      {screen === "welcome" && (
        <div className="welcome">
          <div className="welcome-art">
            <img src={FLEET[1].images[0]} alt="BMW X3 parked in Airport Residential, Accra" />
            <div className="welcome-shade" />
            <div className="welcome-brand">
              <Logo inverse />
              <span className="demo-pill">ACCRA P2P DEMO</span>
            </div>
            <div className="welcome-copy">
              <p>PEER-TO-PEER CAR RENTAL FOR GHANA</p>
              <h1>Your keys to<br />moving freely.</h1>
              <span>Verified local cars. Trusted hosts. Built for Accra.</span>
            </div>
          </div>
          <div className="welcome-panel" style={{ overflowY: "auto", maxHeight: "90vh" }}>
            <h2>Sign in to KasaRide</h2>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "-6px 0 10px" }}>
              Select your demo workspace account type to continue:
            </p>

            {/* Role Selection Grid */}
            <div className="role-selector-grid">
              <button
                type="button"
                className={`role-card-item ${welcomeRoleTab === "renter" ? "selected" : ""}`}
                onClick={() => {
                  setWelcomeRoleTab("renter");
                  setAuthCredentialInput("+233 24 456 7890");
                }}
              >
                <div className="role-card-icon"><Icon name="home" size={22} /></div>
                <span className="role-card-title">Renter</span>
                <span className="role-card-desc">Book cars &amp; track vehicle deliveries</span>
              </button>

              <button
                type="button"
                className={`role-card-item ${welcomeRoleTab === "owner" ? "selected" : ""}`}
                onClick={() => {
                  setWelcomeRoleTab("owner");
                  setAuthCredentialInput("+233 20 890 1234");
                }}
              >
                <div className="role-card-icon"><Icon name="key" size={22} /></div>
                <span className="role-card-title">Vehicle Owner</span>
                <span className="role-card-desc">List fleet &amp; monitor delivery jobs</span>
              </button>

              <button
                type="button"
                className={`role-card-item ${welcomeRoleTab === "driver" ? "selected" : ""}`}
                onClick={() => {
                  setWelcomeRoleTab("driver");
                  setAuthCredentialInput("+233 27 654 3210");
                }}
              >
                <div className="role-card-icon"><Icon name="map" size={22} /></div>
                <span className="role-card-title">Delivery Driver</span>
                <span className="role-card-desc">Accept jobs, inspect &amp; handover</span>
              </button>

              <button
                type="button"
                className={`role-card-item ${welcomeRoleTab === "admin" ? "selected" : ""}`}
                onClick={() => {
                  setWelcomeRoleTab("admin");
                  setAuthCredentialInput("dispatch@kasaride.gh");
                }}
              >
                <div className="role-card-icon"><Icon name="shield" size={22} /></div>
                <span className="role-card-title">Admin Dispatch</span>
                <span className="role-card-desc">System dispatch console &amp; operations</span>
              </button>
            </div>

            {/* Role Credentials Form */}
            <div style={{ background: "#f8faf9", border: "1px solid var(--line)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <label className="field">
                <span>
                  {welcomeRoleTab === "admin" ? "Staff Email / Username" : "Ghana mobile number or email"}
                </span>
                <div>
                  <Icon name={welcomeRoleTab === "admin" ? "shield" : "phone"} size={18} />
                  <input
                    value={authCredentialInput}
                    onChange={(e) => setAuthCredentialInput(e.target.value)}
                    placeholder={welcomeRoleTab === "admin" ? "admin@kasaride.gh" : "+233 24 000 0000"}
                  />
                </div>
              </label>

              <label className="field" style={{ marginTop: 8 }}>
                <span>{welcomeRoleTab === "admin" ? "Staff Access PIN" : "OTP Security Code"}</span>
                <div>
                  <Icon name="shield" size={18} />
                  <input
                    value={welcomeRoleTab === "admin" ? adminPinInput : authOtpInput}
                    onChange={(e) => welcomeRoleTab === "admin" ? setAdminPinInput(e.target.value) : setAuthOtpInput(e.target.value)}
                    placeholder="284196"
                  />
                </div>
              </label>

              {/* Demo Approval Status Selectors for Owner & Driver */}
              {welcomeRoleTab === "owner" && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                    DEMO OWNER VERIFICATION STATE:
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["approved", "pending_review", "rejected"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        style={{
                          flex: 1,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "4px 6px",
                          borderRadius: 6,
                          border: "1px solid var(--line)",
                          background: ownerApprovalStatus === st ? "var(--forest)" : "#fff",
                          color: ownerApprovalStatus === st ? "#fff" : "var(--navy)",
                          cursor: "pointer",
                        }}
                        onClick={() => setOwnerApprovalStatus(st)}
                      >
                        {st === "approved" ? "Approved" : st === "pending_review" ? "Pending" : "Rejected"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {welcomeRoleTab === "driver" && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                    DEMO DRIVER VERIFICATION STATE:
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["approved", "pending_approval", "suspended"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        style={{
                          flex: 1,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "4px 6px",
                          borderRadius: 6,
                          border: "1px solid var(--line)",
                          background: driverApprovalStatus === st ? "var(--forest)" : "#fff",
                          color: driverApprovalStatus === st ? "#fff" : "var(--navy)",
                          cursor: "pointer",
                        }}
                        onClick={() => setDriverApprovalStatus(st)}
                      >
                        {st === "approved" ? "Approved" : st === "pending_approval" ? "Pending" : "Suspended"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {welcomeRoleTab === "admin" && (
                <div style={{ marginTop: 8, background: "#edf6f2", padding: "8px 10px", borderRadius: 8, fontSize: 10, color: "#065f46" }}>
                  <Icon name="shield" size={14} /> <strong>Staff-Only Portal:</strong> Authorized KasaRide central dispatch personnel only.
                </div>
              )}
            </div>

            <Button
              onClick={() => {
                setSignedInRole(welcomeRoleTab);
                setAppRole(welcomeRoleTab);
                if (welcomeRoleTab === "renter") {
                  showToast("Signed in as Renter Ama Asante");
                  go("home");
                } else if (welcomeRoleTab === "owner") {
                  showToast("Signed in as Vehicle Owner Nana Ama Sarpong");
                  go("owner-deliveries");
                } else if (welcomeRoleTab === "driver") {
                  showToast("Signed in as Delivery Driver Kwesi Mensah");
                  go("driver-workspace");
                } else {
                  showToast("Signed in to Admin Dispatch Console");
                  go("admin-deliveries");
                }
              }}
            >
              Sign in as {welcomeRoleTab === "renter" ? "Renter" : welcomeRoleTab === "owner" ? "Vehicle Owner" : welcomeRoleTab === "driver" ? "Delivery Driver" : "Admin Dispatcher"} →
            </Button>

            {/* Quick 1-Click Demo Login Shortcuts */}
            <div style={{ marginTop: 12 }}>
              <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700 }}>1-CLICK DEMO LOGIN:</span>
              <div className="quick-login-pills">
                <button
                  type="button"
                  className="quick-login-btn"
                  onClick={() => {
                    setWelcomeRoleTab("renter");
                    setSignedInRole("renter");
                    setAppRole("renter");
                    showToast("Quick Login: Renter Ama Asante");
                    go("home");
                  }}
                >
                  Ama (Renter)
                </button>

                <button
                  type="button"
                  className="quick-login-btn"
                  onClick={() => {
                    setWelcomeRoleTab("owner");
                    setOwnerApprovalStatus("approved");
                    setSignedInRole("owner");
                    setAppRole("owner");
                    showToast("Quick Login: Host Nana Ama (Approved)");
                    go("owner-deliveries");
                  }}
                >
                  Nana Ama (Approved Host)
                </button>

                <button
                  type="button"
                  className="quick-login-btn"
                  onClick={() => {
                    setWelcomeRoleTab("driver");
                    setDriverApprovalStatus("approved");
                    setSignedInRole("driver");
                    setAppRole("driver");
                    showToast("Quick Login: Kwesi (Approved Driver)");
                    go("driver-workspace");
                  }}
                >
                  Kwesi (Approved Driver)
                </button>

                <button
                  type="button"
                  className="quick-login-btn"
                  onClick={() => {
                    setWelcomeRoleTab("admin");
                    setSignedInRole("admin");
                    setAppRole("admin");
                    showToast("Quick Login: Admin Dispatch Console");
                    go("admin-deliveries");
                  }}
                >
                  Admin Dispatch
                </button>
              </div>
            </div>

            <small style={{ marginTop: 12, display: "block" }}>
              By signing in, you acknowledge that this is a local Ghana peer-to-peer car rental prototype.
            </small>
          </div>
        </div>
      )}

      {/* SCREEN: OTP */}
      {screen === "otp" && (
        <Page className="plain-page">
          <Header title="Verify your number" back={() => go("welcome")} />
          <section className="auth-body">
            <div className="auth-icon">
              <Icon name="phone" size={28} />
            </div>
            <h1>Enter verification code</h1>
            <p>We sent a 6-digit simulation code to +233 24 ••• 7890.</p>
            <div className="otp" aria-label="One-time passcode">
              {[2, 8, 4, 1, 9, 6].map((n, i) => (
                <input key={i} defaultValue={n} aria-label={`Digit ${i + 1}`} readOnly />
              ))}
            </div>
            <Button onClick={() => { showToast("Welcome back, Ama!"); go("home"); }}>
              Confirm & explore cars
            </Button>
            <p className="center muted">
              Didn't receive it? <button className="inline-link" onClick={() => showToast("Demo code resent: 284196")}>Resend demo code</button>
            </p>
            <div className="notice">
              <Icon name="shield" />
              <div>
                <strong>Privacy first</strong>
                <p>We only use your credentials to securely link your demo bookings.</p>
              </div>
            </div>
          </section>
        </Page>
      )}

      {/* SCREEN: HOME */}
      {screen === "home" && (
        <Page nav="home" go={go}>
          <div className="home-hero">
            <Header
              action={
                <button className="avatar" onClick={() => go("profile")} aria-label="View user profile">
                  AA
                </button>
              }
            />
            <div className="hero-copy">
              <p>AKWAABA, AMA</p>
              <h1>Where do you<br />want to go?</h1>
            </div>
            <div className="search-panel">
              <label className="field">
                <span>Pick-up location</span>
                <div>
                  <Icon name="pin" />
                  <input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="e.g. East Legon, Cantonments"
                  />
                </div>
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Pick-up</span>
                  <div>
                    <input
                      type="date"
                      value={bookingDraft.pickupDate}
                      onChange={(e) => {
                        const newPickup = e.target.value;
                        setBookingDraft(prev => {
                          const draft = { ...prev, pickupDate: newPickup };
                          if (draft.returnDate < newPickup) {
                            draft.returnDate = newPickup; // prevent return before pickup
                          }
                          return draft;
                        });
                      }}
                    />
                  </div>
                </label>
                <label className="field">
                  <span>Return</span>
                  <div>
                    <input
                      type="date"
                      min={bookingDraft.pickupDate}
                      value={bookingDraft.returnDate}
                      onChange={(e) => setBookingDraft(prev => ({ ...prev, returnDate: e.target.value }))}
                    />
                  </div>
                </label>
              </div>
              <Button onClick={() => go("results")}>
                <Icon name="search" /> Search {FLEET.length} cars
              </Button>
            </div>
          </div>

          <section className="content-section">
            <div className="section-head">
              <h2>Find your fit</h2>
              <button onClick={() => { setCategoryFilter("All"); go("results"); }}>View all</button>
            </div>
            <div className="categories">
              {[
                ["Economy", "From GH₵380", "Economy"],
                ["SUV", "Elevated & 4WD", "SUV"],
                ["Family", "Spacious Vans", "Family"],
                ["Luxury", "Executive style", "Luxury"],
              ].map(([title, subtitle, cat], i) => (
                <button
                  key={title}
                  onClick={() => {
                    setCategoryFilter(cat);
                    go("results");
                  }}
                >
                  <span className={`car-silhouette s${i}`} />
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="trust-band">
            <div>
              <Icon name="shield" size={28} />
            </div>
            <span>
              <strong>Trust at every turn</strong>
              <small>DVLA-checked licences, verified car inspections, and local Mobile Money security.</small>
            </span>
            <Icon name="chevron" />
          </section>

          <section className="content-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">HANDPICKED IN ACCRA</p>
                <h2>Featured vehicles</h2>
              </div>
              <button onClick={() => go("results")}>See all ({FLEET.length})</button>
            </div>
            <div className="card-scroller">
              {FLEET.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => {
                    setBookingDraft(prev => ({ ...prev, carId: car.id }));
                    setActiveGalleryIndex(0);
                    go("detail");
                  }}
                />
              ))}
            </div>
          </section>
        </Page>
      )}

      {/* SCREEN: RESULTS (WITH FILTERS & EMPTY STATE) */}
      {screen === "results" && (
        <Page nav="results" go={go}>
          <Header
            title="Cars in Accra"
            back={() => go("home")}
            action={
              <button
                className="icon-btn"
                onClick={() => showToast("Interactive map preview active")}
                aria-label="Map view"
              >
                <Icon name="map" />
              </button>
            }
          />

          <div className="results-search" onClick={() => go("home")}>
            <Icon name="search" />
            <span>
              <strong>{searchLocation}</strong>
              <small>{bookingDraft.pickupDate} to {bookingDraft.returnDate} · {rentalDays} days</small>
            </span>
            <button className="text-link" style={{ fontSize: 11 }}>Edit</button>
          </div>

          {/* Quick Filters Row */}
          <div className="filter-row">
            {["All", "Economy", "SUV", "Family", "Luxury"].map((cat) => (
              <button
                key={cat}
                className={categoryFilter === cat ? "active" : ""}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat === "All" && <Icon name="filter" size={15} />}
                {cat}
              </button>
            ))}
            <button
              className={transmissionFilter === "Automatic" ? "active" : ""}
              onClick={() =>
                setTransmissionFilter(transmissionFilter === "Automatic" ? "All" : "Automatic")
              }
            >
              Automatic
            </button>
            <button
              className={verifiedOnly ? "active" : ""}
              onClick={() => setVerifiedOnly(!verifiedOnly)}
            >
              Verified hosts
            </button>
          </div>

          <section className="results-body">
            <div className="section-head">
              <h2>{filteredCars.length} cars available</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    background: "#fff",
                    padding: "4px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredCars.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Icon name="search" size={28} />
                </div>
                <h3>No cars match your criteria</h3>
                <p>We couldn't find vehicles matching "{categoryFilter}" in this location. Try loosening your filters or changing dates.</p>
                <Button
                  onClick={() => {
                    setCategoryFilter("All");
                    setTransmissionFilter("All");
                    setVerifiedOnly(false);
                    setSearchQuery("");
                  }}
                >
                  Reset all filters
                </Button>
              </div>
            ) : (
              <div className="desktop-layout">
                <div className="results-list">
                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      horizontal
                      onClick={() => {
                        setBookingDraft(prev => ({ ...prev, carId: car.id }));
                        setActiveGalleryIndex(0);
                        go("detail");
                      }}
                    />
                  ))}
                </div>

                {/* Desktop Interactive Map Preview */}
                <div className="map-card" aria-hidden="true">
                  <div className="map-grid" />
                  <span className="map-pin p1">GH₵{filteredCars[0]?.pricePerDay || 420}</span>
                  {filteredCars[1] && <span className="map-pin p2">GH₵{filteredCars[1].pricePerDay}</span>}
                  {filteredCars[2] && <span className="map-pin p3">GH₵{filteredCars[2].pricePerDay}</span>}
                  <div>
                    <Icon name="map" /> Greater Accra Pickup Zones
                  </div>
                </div>
              </div>
            )}
          </section>
        </Page>
      )}

      {/* SCREEN: VEHICLE DETAIL */}
      {screen === "detail" && (
        <Page>
          {/* Main Gallery Hero */}
          <div className="gallery">
            <img
              src={selectedCar.images[activeGalleryIndex] || selectedCar.images[0]}
              alt={`${selectedCar.name} in Accra`}
            />
            <Header
              back={() => go("results")}
              action={
                <button
                  className="icon-btn glass"
                  onClick={() => showToast("Saved to favourites")}
                  aria-label="Save favourite"
                >
                  <Icon name="heart" />
                </button>
              }
            />
            <span className="gallery-count">
              {activeGalleryIndex + 1} / {selectedCar.images.length}
            </span>
          </div>

          {/* Interactive Thumbnails */}
          <div className="gallery-thumbs">
            {selectedCar.images.map((img, idx) => (
              <button
                key={idx}
                className={`gallery-thumb ${activeGalleryIndex === idx ? "active" : ""}`}
                onClick={() => setActiveGalleryIndex(idx)}
              >
                <img src={img} alt={`View angle ${idx + 1}`} />
              </button>
            ))}
          </div>

          <div className="detail-wrap">
            <section className="detail-main">
              <p className="eyebrow">{selectedCar.type.toUpperCase()} · ACCRA VERIFIED</p>
              <div className="title-price">
                <div>
                  <h1>{selectedCar.name}</h1>
                  <p>{selectedCar.modelYear} · {selectedCar.transmission} · {selectedCar.fuel}</p>
                </div>
                <div>
                  <strong>GH₵{selectedCar.pricePerDay}</strong>
                  <small>/ day</small>
                </div>
              </div>

              <div className="badge-row">
                <Badge>Verified vehicle</Badge>
                <Badge gold>Top rated host</Badge>
                <span className="badge" style={{ background: "#edf2f7", color: "var(--forest)" }}>
                  ★ {selectedCar.rating} ({selectedCar.reviewCount} reviews)
                </span>
              </div>

              {/* Spec Grid */}
              <div className="spec-grid">
                <div>
                  <strong>{selectedCar.seats}</strong>
                  <small>Seats</small>
                </div>
                <div>
                  <strong>{selectedCar.bags}</strong>
                  <small>Bags</small>
                </div>
                <div>
                  <strong>{selectedCar.transmission.substring(0, 4)}</strong>
                  <small>Gearbox</small>
                </div>
                <div>
                  <strong>{selectedCar.fuel}</strong>
                  <small>Engine</small>
                </div>
              </div>

              {/* Trip Pickup / Delivery Selection */}
              <section className="detail-section">
                <h2>Your trip dates & handover</h2>
                <div className="trip-box">
                  <div>
                    <small>PICK-UP</small>
                    <strong>{bookingDraft.pickupDate} · {bookingDraft.pickupTime}</strong>
                    <span>{selectedCar.neighborhood}</span>
                  </div>
                  <div>
                    <small>RETURN</small>
                    <strong>{bookingDraft.returnDate} · {bookingDraft.returnTime}</strong>
                    <span>{selectedCar.neighborhood}</span>
                  </div>
                  <button onClick={() => go("home")}>Change</button>
                </div>

                <div
                  className="choice"
                  onClick={() => setBookingDraft(prev => ({ ...prev, deliverySelected: false }))}
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderRadius: 10,
                    background: !bookingDraft.deliverySelected ? "#eef6f3" : "transparent",
                  }}
                >
                  <span>
                    <Icon name="pin" />
                    <span>
                      <strong>Pick up in {selectedCar.neighborhood}</strong>
                      <small>Exact pickup pin shared after confirmation</small>
                    </span>
                  </span>
                  <strong>Included</strong>
                </div>

                <div
                  className="choice"
                  onClick={() => setBookingDraft(prev => ({ ...prev, deliverySelected: true }))}
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderRadius: 10,
                    background: bookingDraft.deliverySelected ? "#eef6f3" : "transparent",
                  }}
                >
                  <span>
                    <Icon name="trips" />
                    <span>
                      <strong>Host delivery to you</strong>
                      <small>Airport, hotel, or office in central Accra</small>
                    </span>
                  </span>
                  <strong>+ GH₵{selectedCar.deliveryFeeGh}</strong>
                </div>
              </section>

              {/* Verified Host Card */}
              <section className="detail-section host">
                <div className="host-avatar" style={{ background: selectedCar.host.avatarBg }}>
                  {selectedCar.host.initials}
                </div>
                <div>
                  <small>YOUR HOST</small>
                  <h3>{selectedCar.host.name}</h3>
                  <div style={{ display: "flex", gap: 6, margin: "2px 0 4px" }}>
                    <Badge>Verified owner</Badge>
                  </div>
                  <p>{selectedCar.host.joined} · {selectedCar.host.trips} trips · {selectedCar.host.responseRate} response rate</p>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => go("chat")}
                  aria-label="Chat with host"
                >
                  <Icon name="chat" />
                </button>
              </section>

              {/* Policies & Good to know */}
              <section className="detail-section">
                <h2>Good to know</h2>
                {[
                  ["Mileage policy", selectedCar.mileagePolicy],
                  ["Fuel policy", selectedCar.fuelPolicy],
                  ["Refundable deposit", `GH₵${selectedCar.depositGh} held securely during rental`],
                  ["Cancellation", "Free cancellation up to 24 hours before pickup"],
                  ["Vehicle rules", selectedCar.rules.join(" · ")],
                ].map(([title, val]) => (
                  <div className="info-row" key={title}>
                    <span>
                      <strong>{title}</strong>
                      <small>{val}</small>
                    </span>
                    <Icon name="chevron" size={16} />
                  </div>
                ))}
              </section>

              {/* Renter Reviews */}
              <section className="detail-section">
                <div className="section-head">
                  <h2>Renter feedback</h2>
                  <span className="rating">★ {selectedCar.rating} · Accra community</span>
                </div>
                <div className="review-card">
                  “The car was spotless, handed over right on time at East Legon, and the A/C was freezing. Host Kwame was very responsive on WhatsApp and the in-app chat.”
                  <small>Kwabena A. · Verified Accra Renter</small>
                </div>
              </section>

              <button className="support-link" onClick={() => go("support")}>
                <Icon name="shield" /> Questions about this rental? Support can help <Icon name="chevron" />
              </button>
            </section>

            {/* Desktop Reserve Card */}
            <aside className="reserve-desktop">
              <h3>Trip summary</h3>
              <p>{rentalDays} days × GH₵{selectedCar.pricePerDay}</p>
              <strong>GH₵{totalAmount}</strong>
              <small>Includes GH₵{depositFee} refundable deposit & estimated fees</small>
              <Button onClick={() => go(verifiedDriver ? "checkout" : "verify")}>
                Reserve this car
              </Button>
              <label>
                <input
                  type="checkbox"
                  checked={verifiedDriver}
                  onChange={(e) => setVerifiedDriver(e.target.checked)}
                />
                Demo: simulated verified driver status
              </label>
            </aside>
          </div>

          {/* Sticky Mobile Reserve Bar */}
          <div className="sticky-reserve">
            <div>
              <small>{rentalDays}-day total (inc. deposit)</small>
              <strong>GH₵{totalAmount}</strong>
              <button onClick={() => setVerifiedDriver(!verifiedDriver)}>
                {verifiedDriver ? "Driver verified" : "Verification needed"}
              </button>
            </div>
            <Button onClick={() => go(verifiedDriver ? "checkout" : "verify")}>
              Reserve
            </Button>
          </div>
        </Page>
      )}

      {/* SCREEN: DRIVER VERIFICATION (WITH SIMULATED FAIL/RETRY) */}
      {screen === "verify" && (
        <Page className="plain-page">
          <Header title="Driver verification" back={() => go("detail")} />
          <section className="form-page">
            <div className="progress-label">
              <span>STEP 1 OF 2</span>
              <strong>
                {verificationSteps.length === 3
                  ? "Ready for checkout"
                  : `${verificationSteps.length} of 3 complete`}
              </strong>
            </div>
            <div className="progress">
              <span style={{ width: `${Math.max(15, (verificationSteps.length / 3) * 100)}%` }} />
            </div>

            <h1>Help us keep every trip safe</h1>
            <p>
              Before picking up Kwame's car, KasaRide verifies your Ghana Driving Licence and national ID. This local prototype does not store real personal documents.
            </p>

            <div className="notice">
              <Icon name="shield" />
              <div>
                <strong>Simulation mode</strong>
                <p>Click each item below to simulate instant document verification.</p>
              </div>
            </div>

            {/* Upload Error Simulation Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "8px 12px", background: "#f8f9f8", borderRadius: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>Simulate network upload failure:</span>
              <button
                className="inline-link"
                style={{ fontSize: 11 }}
                onClick={() => setSimulateFail(!simulateFail)}
              >
                {simulateFail ? "Fail Mode ON" : "Normal Upload"}
              </button>
            </div>

            {failError && (
              <div className="notice warning">
                <Icon name="alert" />
                <div>
                  <strong>Upload failed</strong>
                  <p>{failError} Tap the item again to retry.</p>
                </div>
              </div>
            )}

            <div className="upload-list">
              {[
                ["Ghana Driving Licence", "Front and back DVLA card photo", "camera"],
                ["Ghana Card or Passport", "Identity match against national database", "shield"],
                ["Liveness Selfie Check", "Quick 3D face verification", "user"],
              ].map(([title, desc, iconName], i) => {
                const isDone = verificationSteps.includes(i);
                const isLoading = uploadLoading === i;
                return (
                  <button
                    key={title}
                    className={`upload ${isDone ? "done" : ""}`}
                    disabled={isLoading}
                    onClick={() => {
                      if (isDone) return;
                      setUploadLoading(i);
                      setFailError(null);
                      setTimeout(() => {
                        setUploadLoading(null);
                        if (simulateFail) {
                          setFailError("Simulated network timeout while verifying document. Please retry.");
                        } else {
                          setVerificationSteps((prev) => [...prev, i]);
                          showToast(`${title} verified!`);
                        }
                      }, 700);
                    }}
                  >
                    <span>
                      {isLoading ? (
                        <div style={{ width: 18, height: 18, border: "2px solid #fff", borderTopColor: "var(--emerald)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      ) : (
                        <Icon name={isDone ? "check" : iconName} />
                      )}
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <small>{isLoading ? "Verifying..." : isDone ? "Document verified" : desc}</small>
                    </div>
                    <Icon name="chevron" />
                  </button>
                );
              })}
            </div>

            {verificationSteps.length === 3 && (
              <div className="success-box">
                <Icon name="check" />
                <div>
                  <strong>All documents verified</strong>
                  <p>Your demo profile is cleared for all Accra car rentals.</p>
                </div>
              </div>
            )}

            <Button
              disabled={verificationSteps.length < 3}
              onClick={() => {
                setVerifiedDriver(true);
                go("checkout");
              }}
            >
              Continue to checkout
            </Button>
            <Button variant="ghost" onClick={() => go("detail")}>
              Save and return later
            </Button>
          </section>
        </Page>
      )}

      {/* SCREEN: CHECKOUT (WITH MOMO / CARD & PROMO CODE) */}
      {screen === "checkout" && (
        <Page className="plain-page">
          <Header
            title="Review & pay"
            back={() => go("detail")}
            action={
              <span className="secure">
                <Icon name="shield" size={15} /> 256-bit Secure
              </span>
            }
          />
          <div className="checkout-grid">
            <section className="form-page checkout">
              <div className="booking-car">
                <img src={selectedCar.images[0]} alt={selectedCar.name} />
                <div>
                  <small>SELECTED VEHICLE</small>
                  <strong>{selectedCar.name} ({selectedCar.modelYear})</strong>
                  <span><Badge>Verified host: {selectedCar.host.name}</Badge></span>
                </div>
              </div>

              <section>
                <h2>Trip schedule</h2>
                <div className="trip-box">
                  <div>
                    <small>PICK-UP</small>
                    <strong>{bookingDraft.pickupDate} · {bookingDraft.pickupTime}</strong>
                    <span>{bookingDraft.deliverySelected ? "Delivery in Accra" : selectedCar.neighborhood}</span>
                  </div>
                  <div>
                    <small>RETURN</small>
                    <strong>{bookingDraft.returnDate} · {bookingDraft.returnTime}</strong>
                    <span>{selectedCar.neighborhood}</span>
                  </div>
                </div>
              </section>

              {/* Itemised Breakdown */}
              <section>
                <h2>Price breakdown</h2>
                <div className="fee-row">
                  <span>GH₵{selectedCar.pricePerDay} × {rentalDays} rental days</span>
                  <strong>GH₵{subtotal}</strong>
                </div>
                <div className="fee-row">
                  <span>KasaRide platform service fee (10%)</span>
                  <strong>GH₵{serviceFee}</strong>
                </div>
                <div className="fee-row">
                  <span>Vehicle delivery fee <small style={{ color: "var(--muted)", fontWeight: 400 }}>— covers driver fuel &amp; time within Greater Accra</small></span>
                  <strong>{bookingDraft.deliverySelected ? `GH₵${selectedCar.deliveryFeeGh}` : "Self pickup (GH₵0)"}</strong>
                </div>
                <div className="fee-row">
                  <span>Refundable security deposit</span>
                  <strong>GH₵{depositFee}</strong>
                </div>
                {promoDiscount > 0 && (
                  <div className="fee-row" style={{ color: "var(--success)" }}>
                    <span>Promo discount ({appliedPromo})</span>
                    <strong>- GH₵{promoDiscount}</strong>
                  </div>
                )}

                <p className="fine">
                  The security deposit (GH₵{depositFee}) is pre-authorized and returned automatically within 24 hours of vehicle return without damage.
                </p>

                {/* Promo Code Input */}
                <div className="promo">
                  <input
                    placeholder="Enter code (e.g. AKWAABA10)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                  />
                  <button onClick={handleApplyPromo}>Apply</button>
                </div>

                <div className="fee-row total">
                  <span>Total due now</span>
                  <strong>GH₵{totalAmount}</strong>
                </div>
              </section>

              {/* Delivery Details — shown when delivery is selected */}
              {bookingDraft.deliverySelected && (
                <section style={{ border: "1.5px solid var(--emerald)", borderRadius: 14, padding: "18px 16px", background: "#f4fbf8" }}>
                  <h2 style={{ color: "var(--forest)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="pin" size={18} /> Delivery details
                  </h2>

                  <label className="field" style={{ marginBottom: 14 }}>
                    <span>Delivery address <span style={{ color: "var(--danger, #e53e3e)", marginLeft: 2 }}>*</span></span>
                    <div>
                      <Icon name="pin" size={17} />
                      <input
                        placeholder="e.g. Movenpick Hotel, Airport City, Accra"
                        value={bookingDraft.deliveryAddress}
                        onChange={(e) => setBookingDraft(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      />
                    </div>
                  </label>

                  <label className="field" style={{ marginBottom: 14 }}>
                    <span>Preferred delivery window <span style={{ color: "var(--danger, #e53e3e)", marginLeft: 2 }}>*</span></span>
                    <div>
                      <Icon name="clock" size={17} />
                      <select
                        value={bookingDraft.deliveryWindow}
                        onChange={(e) => setBookingDraft(prev => ({ ...prev, deliveryWindow: e.target.value }))}
                        style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, fontWeight: 700, color: "var(--ink)", outline: "none" }}
                      >
                        {DELIVERY_WINDOWS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                  </label>

                  <div className="notice" style={{ marginTop: 0 }}>
                    <Icon name="pin" />
                    <div>
                      <strong>Location-sharing consent</strong>
                      <p>KasaRide will share your approximate delivery location with the assigned driver for this trip only. No data is stored beyond handover.</p>
                    </div>
                  </div>
                  <label className="terms" style={{ marginTop: 10 }}>
                    <input
                      type="checkbox"
                      checked={deliveryConsentAccepted}
                      onChange={(e) => setDeliveryConsentAccepted(e.target.checked)}
                    />
                    <span>I consent to location-sharing for this delivery.</span>
                  </label>
                </section>
              )}

              {/* Payment Method Selector */}
              <section>
                <h2>Payment method</h2>
                <button
                  type="button"
                  className={`pay-option ${paymentMethod === "momo_mtn" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("momo_mtn")}
                >
                  <span className="pay-icon" style={{ background: "#ffcc00", color: "#000" }}>M</span>
                  <span>
                    <strong>MTN Mobile Money</strong>
                    <small>Instant prompt to your Ghana mobile phone</small>
                  </span>
                  <i />
                </button>

                <button
                  type="button"
                  className={`pay-option ${paymentMethod === "momo_telecel" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("momo_telecel")}
                >
                  <span className="pay-icon" style={{ background: "#e60000", color: "#fff" }}>T</span>
                  <span>
                    <strong>Telecel Cash (Vodafone)</strong>
                    <small>Authorize via USSD prompt</small>
                  </span>
                  <i />
                </button>

                <button
                  type="button"
                  className={`pay-option ${paymentMethod === "card" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <span className="pay-icon">C</span>
                  <span>
                    <strong>Debit or Credit Card</strong>
                    <small>Visa, Mastercard, GH-Link</small>
                  </span>
                  <i />
                </button>

                {paymentMethod.startsWith("momo") && (
                  <label className="field" style={{ marginTop: 12 }}>
                    <span>Mobile Money Number</span>
                    <div>
                      <Icon name="phone" size={17} />
                      <input
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        placeholder="+233 24 000 0000"
                      />
                    </div>
                  </label>
                )}
              </section>

              <div className="notice warning">
                <Icon name="alert" />
                <div>
                  <strong>Free cancellation until 24h prior</strong>
                  <p>Cancel free before pickup. 100% of deposit and rental refunded.</p>
                </div>
              </div>

              <label className="terms">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>
                  I agree to KasaRide rental rules, handover inspection requirements, and deposit policy.
                </span>
              </label>

              <Button
                disabled={
                  !termsAccepted ||
                  (bookingDraft.deliverySelected && (
                    !bookingDraft.deliveryAddress.trim() ||
                    !deliveryConsentAccepted
                  ))
                }
                onClick={handleExecutePayment}
              >
                Pay GH₵{totalAmount} securely
              </Button>
              {bookingDraft.deliverySelected && !bookingDraft.deliveryAddress.trim() && (
                <p style={{ fontSize: 11, color: "#e53e3e", textAlign: "center", marginTop: 6 }}>Enter your delivery address above to continue.</p>
              )}
            </section>

            <aside className="checkout-aside">
              <h3>Protected by KasaRide</h3>
              <p><Icon name="shield" /> {selectedCar.host.name} — identity &amp; car verified</p>
              <p><Icon name="camera" /> 8-point digital inspection protects deposit</p>
              <p><Icon name="phone" /> 24/7 Accra roadside emergency support</p>
            </aside>
          </div>

          {/* MoMo Approval Simulation Modal */}
          {momoProcessing && (
            <div className="momo-modal-overlay">
              <div className="momo-modal">
                <div className="spinner" />
                <h3>Waiting for approval...</h3>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0 16px" }}>
                  A simulated Mobile Money authorization prompt has been sent to <strong>{momoNumber}</strong> for <strong>GH₵{totalAmount}</strong>.
                </p>
                <div style={{ background: "#edf5f1", padding: 12, borderRadius: 10, fontSize: 11, color: "var(--forest)" }}>
                  Enter MoMo PIN to authorize KasaRide reservation...
                </div>
              </div>
            </div>
          )}
        </Page>
      )}

      {/* SCREEN: CONFIRMED */}
      {screen === "confirmed" && (
        <Page className="plain-page confirmed">
          <Header action={<button className="text-link" onClick={() => go("home")}>Done</button>} />
          <section className="confirmation">
            <div className="success-ring">
              <Icon name="check" size={34} />
            </div>
            <p className="eyebrow">BOOKING CONFIRMED</p>
            <h1>You are all set, Ama!</h1>
            <p>{selectedCar.host.name}'s {selectedCar.name} is confirmed for your Accra trip.</p>

            <div className="reference">
              <span>
                <small>BOOKING REFERENCE</small>
                <strong>{bookingRef}</strong>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(bookingRef);
                  showToast("Reference " + bookingRef + " copied!");
                }}
              >
                Copy
              </button>
            </div>

            <div className="confirm-card">
              <img src={selectedCar.images[0]} alt={selectedCar.name} />
              <div>
                <strong>{selectedCar.name} ({selectedCar.modelYear})</strong>
                <span>{bookingDraft.pickupDate} to {bookingDraft.returnDate} · {bookingDraft.deliverySelected ? "Delivery" : selectedCar.neighborhood}</span>
                <Badge>Verified host: {selectedCar.host.name}</Badge>
              </div>
            </div>

            {/* Delivery status card — shown when delivery was selected */}
            {bookingDraft.deliverySelected && (
              <div style={{ border: "1.5px solid var(--emerald)", borderRadius: 14, padding: "16px", background: "#f4fbf8", margin: "4px 0 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Icon name="truck" size={18} />
                  <strong style={{ fontSize: 15, color: "var(--forest)" }}>Delivery status</strong>
                <span style={{ marginLeft: "auto", background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20 }}>PENDING ASSIGNMENT</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>Address</span>
                    <span style={{ fontWeight: 700, maxWidth: "60%", textAlign: "right" }}>{bookingDraft.deliveryAddress || "Not specified"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>Window</span>
                    <span style={{ fontWeight: 700 }}>{bookingDraft.deliveryWindow}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>Delivery fee</span>
                    <span style={{ fontWeight: 700 }}>GH₵{selectedCar.deliveryFeeGh}</span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setActiveDeliveryTripId(bookingRef);
                    go("delivery-tracking");
                  }}
                  className=""
                >
                  <Icon name="pin" size={16} /> Track my delivery
                </Button>
              </div>
            )}

            <div className="action-grid">
              {bookingDraft.deliverySelected ? (
                <button onClick={() => { setActiveDeliveryTripId(bookingRef); go("delivery-tracking"); }}>
                  <Icon name="pin" />
                  <strong>Track delivery</strong>
                  <small>See live driver status</small>
                </button>
              ) : (
                <button onClick={() => go("chat")}>
                  <Icon name="chat" />
                  <strong>Message host</strong>
                  <small>Coordinate pickup in {selectedCar.neighborhood}</small>
                </button>
              )}
              <button onClick={() => { showToast("Added to demo calendar!"); }}>
                <Icon name="calendar" />
                <strong>Add to calendar</strong>
                <small>Pick up {bookingDraft.pickupDate} at {bookingDraft.pickupTime}</small>
              </button>
            </div>

            {bookingDraft.deliverySelected ? (
              <div className="notice">
                <Icon name="pin" />
                <div>
                  <strong>Next step: Vehicle delivery</strong>
                  <p>A driver will be assigned shortly. Track progress and confirm handover to activate your rental.</p>
                </div>
              </div>
            ) : (
              <div className="notice">
                <Icon name="camera" />
                <div>
                  <strong>Next step: Pre-trip inspection</strong>
                  <p>Before driving off, complete the 8-photo check with your host.</p>
                </div>
              </div>
            )}

            <Button onClick={() => go("trips")}>View in My Trips</Button>
            <button className="support-link" onClick={() => go("support")}>
              <Icon name="shield" /> Need support or adjustments? <Icon name="chevron" />
            </button>
          </section>
        </Page>
      )}

      {/* SCREEN: TRIPS (3 TABS: UPCOMING, ACTIVE, PAST) */}
      {screen === "trips" && (
        <Page nav="trips" go={go}>
          <Header
            title="My trips"
            action={
              <button className="icon-btn" onClick={() => go("support")} aria-label="Support">
                <Icon name="shield" />
              </button>
            }
          />
          <section className="content-section trips-page">
            <div className="tabs">
              <button
                className={tripTab === "upcoming" ? "active" : ""}
                onClick={() => setTripTab("upcoming")}
              >
                Upcoming ({trips.filter(t => t.status === "upcoming").length})
              </button>
              <button
                className={tripTab === "active" ? "active" : ""}
                onClick={() => setTripTab("active")}
              >
                Active ({trips.filter(t => t.status === "active").length})
              </button>
              <button
                className={tripTab === "past" ? "active" : ""}
                onClick={() => setTripTab("past")}
              >
                Past (2)
              </button>
            </div>

            {/* TAB: ACTIVE */}
            {tripTab === "active" && (
              <>
                {trips.filter(t => t.status === "active").length === 0 ? (
                  <div className="empty-state" style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>
                    <Icon name="trips" size={32} />
                    <p style={{ marginTop: 12 }}>No active rentals right now.</p>
                    <p style={{ fontSize: 11 }}>Complete the pre-trip inspection on an upcoming trip to activate it.</p>
                  </div>
                ) : (
                  trips.filter(t => t.status === "active").map(activeTrip => {
                    const activeCar = FLEET.find(c => c.id === activeTrip.carId) || FLEET[0];
                    return (
                      <React.Fragment key={activeTrip.id}>
                        <div className="active-card">
                          <div className="active-image">
                            <img src={activeCar.images[0]} alt={activeCar.name} />
                            <span>ACTIVE NOW</span>
                          </div>
                          <div className="active-content">
                            <p className="eyebrow">RETURN DEADLINE</p>
                            <div className="return-time">
                              <strong>{activeTrip.returnDate} · {activeTrip.returnTime}</strong>
                              <span><Icon name="clock" /> Active rental</span>
                            </div>
                            <h2>{activeCar.name} ({activeCar.modelYear})</h2>
                            <p>Return to {activeCar.neighborhood} · Booking {activeTrip.bookingRef}</p>

                            <div className="inspection-status">
                              <Icon name="check" />
                              <span>
                                <strong>Pre-trip inspection complete</strong>
                                <small>8 pickup photos on file · signed by Ama Asante</small>
                              </span>
                            </div>

                            <div className="trip-actions">
                              <Button onClick={() => go("chat")}>
                                <Icon name="chat" /> Chat with {activeCar.host.name.split(" ")[0]}
                              </Button>
                              <Button variant="secondary" onClick={() => go("return")}>
                                <Icon name="camera" /> Start return
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="trip-guidance">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>During your trip</h3>
                            <button
                              className="inline-link"
                              style={{ fontSize: 11 }}
                              onClick={() => {
                                const newMiles = mileageUsed + 25;
                                setMileageUsed(newMiles);
                                showToast(`Mileage updated: ${newMiles} km used`);
                              }}
                            >
                              + Add simulated 25 km
                            </button>
                          </div>
                          <div className="info-row">
                            <span>
                              <strong>Mileage tracker</strong>
                              <small>{mileageUsed} of 600 km included</small>
                            </span>
                            <strong>{Math.max(0, 600 - mileageUsed)} km remaining</strong>
                          </div>
                          <div className="meter">
                            <span style={{ width: `${Math.min(100, (mileageUsed / 600) * 100)}%` }} />
                          </div>
                          <div className="info-row">
                            <span>
                              <strong>Fuel level recorded at pickup</strong>
                              <small>Return at same mark to avoid refill charge</small>
                            </span>
                            <strong>{activeTrip.fuelLevel ?? "¾ Tank"}</strong>
                          </div>
                        </div>

                        <button className="emergency" onClick={() => go("support")}>
                          <Icon name="phone" />
                          <span>
                            <strong>Accra roadside assistance</strong>
                            <small>Flat tyre, mechanical help or towing support is available</small>
                          </span>
                          <Icon name="chevron" />
                        </button>
                      </React.Fragment>
                    );
                  })
                )}
              </>
            )}

            {/* TAB: UPCOMING */}
            {tripTab === "upcoming" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {trips.filter(t => t.status === "upcoming").length === 0 ? (
                  <div className="empty-state" style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
                    <Icon name="calendar" size={32} />
                    <p>No upcoming trips. Find a car for your next adventure.</p>
                    <Button onClick={() => go("home")} className="mt-3">Search Cars</Button>
                  </div>
                ) : (
                  trips.filter(t => t.status === "upcoming").map(trip => {
                    const tripCar = FLEET.find(c => c.id === trip.carId) || FLEET[0];
                    const isDelivery = trip.deliverySelected;
                    const tripDeliveryStatus = trip.id === activeDeliveryTripId ? deliveryStatus : (trip.deliveryStatus ?? "pending_assignment");
                    const handoverDone = tripDeliveryStatus === "handover_complete";
                    return (
                      <div key={trip.id} className="active-card" style={{ padding: 18 }}>
                        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                          <img
                            src={tripCar.images[0]}
                            alt={tripCar.name}
                            style={{ width: 85, height: 70, objectFit: "cover", borderRadius: 10 }}
                          />
                          <div>
                            <span className="badge">{isDelivery ? "DELIVERY BOOKING" : "CONFIRMED RESERVATION"}</span>
                            <h3 style={{ margin: "4px 0", fontSize: 16 }}>{tripCar.name}</h3>
                            <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
                              {trip.pickupDate} · {isDelivery ? (trip.deliveryAddress || "Delivery") : tripCar.neighborhood} · {trip.bookingRef}
                            </p>
                            <p style={{ fontSize: 11, fontWeight: "bold", margin: "4px 0 0" }}>Total: GH₵{trip.totalAmount}</p>
                          </div>
                        </div>
                        {isDelivery && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0 0", padding: "8px 10px", borderRadius: 8, background: handoverDone ? "#edf6f3" : "#fffbeb" }}>
                            <Icon name={handoverDone ? "check" : "truck"} size={14} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: handoverDone ? "var(--forest)" : "#92400e" }}>
                              {handoverDone ? "Handover complete — ready for inspection" : `Delivery: ${tripDeliveryStatus.replace(/_/g, " ")}`}
                            </span>
                          </div>
                        )}
                        <div style={{ margin: "12px 0 0", borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                          {isDelivery && !handoverDone ? (
                            <Button onClick={() => { setActiveDeliveryTripId(trip.id); go("delivery-tracking"); }}>
                              <Icon name="pin" /> Track delivery
                            </Button>
                          ) : (
                            <Button onClick={() => startInspection(trip.id)}>
                              <Icon name="camera" /> Start pre-trip inspection
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: PAST */}
            {tripTab === "past" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="confirm-card" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>Toyota Land Cruiser Prado</strong>
                    <span>12–15 Jun 2025 · Labone</span>
                    <small style={{ color: "var(--success)", fontWeight: 700 }}>Returned in good order · Deposit refunded</small>
                  </div>
                  <button className="inline-link" onClick={() => go("review")}>Rate trip</button>
                </div>
                <div className="confirm-card" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>Honda Civic 2021</strong>
                    <span>2–4 May 2025 · Osu</span>
                    <small style={{ color: "var(--muted)" }}>Completed · Receipt #GH-90182</small>
                  </div>
                  <button className="inline-link" onClick={() => showToast("Receipt downloaded!")}>Receipt</button>
                </div>
              </div>
            )}
          </section>
        </Page>
      )}

      {/* SCREEN: HOST CHAT */}
      {screen === "chat" && (
        <Page className="plain-page chat-page">
          <Header
            title={selectedCar.host.name}
            back={() => go("trips")}
            action={
              <button
                className="icon-btn"
                onClick={() => showToast("Host contact: " + selectedCar.host.phone)}
                aria-label="Host details"
              >
                <Icon name="phone" />
              </button>
            }
          />
          <div className="chat-context">
            <img src={selectedCar.images[0]} alt="" />
            <span>
              <strong>{selectedCar.name} · Active rental</strong>
              <small>Return today by {bookingDraft.returnTime} in {selectedCar.neighborhood}</small>
            </span>
            <button onClick={() => go("trips")}>Trip details</button>
          </div>

          <div className="messages" aria-live="polite">
            <div className="date-chip">TODAY IN ACCRA</div>
            {messages.map((m) => (
              <div key={m.id} className={`bubble ${m.sender === "renter" ? "me" : "host"}`}>
                {m.text}
                <small>{m.time} {m.sender === "renter" ? "· Read" : ""}</small>
              </div>
            ))}
          </div>

          {/* Quick Reply Chips */}
          <div className="quick-replies">
            {[
              "I am 15 minutes away!",
              "Where is the exact drop-off spot?",
              "Arrived at the gate.",
              "Fuel tank is full at ¾ mark.",
            ].map((chip) => (
              <button
                key={chip}
                className="quick-reply-chip"
                onClick={() => handleSendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              placeholder="Write a message to your host…"
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
            />
            <button type="submit" className="send" aria-label="Send message">
              <Icon name="chevron" />
            </button>
          </form>
        </Page>
      )}

      {/* SCREEN: INSPECTION (PRE-TRIP & RETURN WITH SIDE-BY-SIDE COMPARISON) */}
      {(screen === "inspection" || screen === "return") && (
        <Page className="plain-page">
          <Header
            title={screen === "return" ? "Return inspection" : "Pre-trip inspection"}
            back={() => go("trips")}
            action={
              <button className="text-link" onClick={() => go("support")}>
                Support
              </button>
            }
          />
          <section className="form-page inspection-page">
            {/* Progress indicator */}
            <div className="progress-label">
              <span>EVIDENCE VERIFICATION</span>
              <strong>
                {screen === "return"
                  ? `${returnInspections.length} of 8 return photos`
                  : `${pickupInspections.length} of 8 vehicle photos`}
              </strong>
            </div>
            <div className="progress">
              <span
                style={{
                  width: `${
                    ((screen === "return" ? returnInspections.length : pickupInspections.length) / 8) * 100
                  }%`,
                }}
              />
            </div>

            <h1>{screen === "return" ? "Document vehicle return" : "Capture vehicle before driving"}</h1>
            <p>
              {screen === "return"
                ? "Photograph the same 8 angles. Your pickup photos will be displayed side-by-side for an undisputed deposit return."
                : `Walk around ${selectedCar.name} with the host. These photos protect you against liability for any pre-existing marks.`}
            </p>

            {/* DEMO label for pickup mode */}
            {screen !== "return" && (
              <div className="notice" style={{ marginTop: 0, marginBottom: 16 }}>
                <Icon name="camera" />
                <div>
                  <strong>DEMO MODE — no real camera access needed</strong>
                  <p>Tap each panel below to simulate capturing a photo. All evidence is local only.</p>
                </div>
              </div>
            )}

            {/* Side-by-side comparison for return mode */}
            {screen === "return" && (
              <div style={{ margin: "16px 0" }}>
                <div className="section-head">
                  <h2>Before & after comparison</h2>
                  <span className="badge">Handover audit</span>
                </div>
                <div className="inspection-compare-grid">
                  <div className="inspection-compare-card">
                    <span className="tag">PICKUP PHOTO</span>
                    <img src={selectedCar.images[0]} alt="Pickup front" />
                    <div className="caption">Front bumper: Clean</div>
                  </div>
                  <div className="inspection-compare-card after">
                    <span className="tag">RETURN PHOTO</span>
                    <img src={selectedCar.images[0]} alt="Return front" />
                    <div className="caption">Front bumper: No change</div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive 8-point photo checklist */}
            <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Vehicle evidence ({pickupInspections.length}/8 captured)</h2>
            <div className="inspection-grid">
              {inspectionAngles.map((angle, i) => {
                const list = screen === "return" ? returnInspections : pickupInspections;
                const isCaptured = list.includes(i);
                return (
                  <button
                    key={angle}
                    className={isCaptured ? "done" : ""}
                    aria-label={`${angle}: ${isCaptured ? "captured" : "required"}`}
                    onClick={() => {
                      if (screen === "return") {
                        setReturnInspections((prev) =>
                          prev.includes(i) ? prev : [...prev, i]
                        );
                      } else {
                        setPickupInspections((prev) =>
                          prev.includes(i) ? prev : [...prev, i]
                        );
                      }
                      showToast(`${angle} — photo recorded ✓`);
                    }}
                  >
                    <div>
                      {screen === "return" && <span className="before">EVIDENCE</span>}
                      {isCaptured ? <Icon name="check" size={26} /> : <Icon name="camera" size={26} />}
                    </div>
                    <strong>{angle}</strong>
                    <small>{isCaptured ? "Captured ✓" : "Required — tap to capture"}</small>
                  </button>
                );
              })}
            </div>

            {/* Fuel level — pickup only */}
            {screen !== "return" && (
              <div style={{ margin: "20px 0" }}>
                <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Fuel level at collection</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {["Empty", "¼ Tank", "½ Tank", "¾ Tank", "Full"].map(level => (
                    <button
                      key={level}
                      aria-label={`Fuel level: ${level}`}
                      onClick={() => {
                        setFuelLevelCaptured(level);
                        showToast(`Fuel level recorded: ${level}`);
                      }}
                      style={{
                        minHeight: 48,
                        border: `2px solid ${
                          fuelLevelCaptured === level ? "var(--emerald)" : "var(--line)"
                        }`,
                        borderRadius: 10,
                        background: fuelLevelCaptured === level ? "#edf6f3" : "#fff",
                        fontWeight: fuelLevelCaptured === level ? 800 : 600,
                        color: fuelLevelCaptured === level ? "var(--emerald)" : "var(--ink)",
                        fontSize: 11,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {fuelLevelCaptured === level && <Icon name="check" size={13} />}
                      &nbsp;{level}
                    </button>
                  ))}
                </div>
                {fuelLevelCaptured && (
                  <p style={{ fontSize: 10, color: "var(--success)", marginTop: 6, fontWeight: 700 }}>
                    Fuel level recorded as <strong>{fuelLevelCaptured}</strong> — host must return vehicle at this level.
                  </p>
                )}
                {!fuelLevelCaptured && (
                  <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 6 }}>Select the current fuel gauge reading.</p>
                )}
              </div>
            )}

            {/* Existing damage notes */}
            <label className="field">
              <span>Existing marks, dents, or handover notes (optional)</span>
              <textarea
                placeholder={
                  screen === "return"
                    ? "Confirm any differences or note road dust, tyre condition..."
                    : "Note any minor stone chips, tyre wear, or pre-existing scratches here..."
                }
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
              />
            </label>

            {/* Readiness summary — pickup only */}
            {screen !== "return" && (
              <div style={{
                background: "#f5f7f5",
                borderRadius: 12,
                padding: "12px 14px",
                margin: "14px 0",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700 }}>Checklist status</p>
                <p style={{ margin: 0, fontSize: 11, color: pickupInspections.length === 8 ? "var(--success)" : "var(--muted)" }}>
                  {pickupInspections.length === 8 ? "✓" : `${pickupInspections.length}/8`} Vehicle photos
                </p>
                <p style={{ margin: 0, fontSize: 11, color: fuelLevelCaptured ? "var(--success)" : "var(--muted)" }}>
                  {fuelLevelCaptured ? "✓" : "○"} Fuel level recorded
                </p>
                <p style={{ margin: 0, fontSize: 11, color: inspectionAck ? "var(--success)" : "var(--muted)" }}>
                  {inspectionAck ? "✓" : "○"} Renter acknowledgement
                </p>
              </div>
            )}

            {/* Acknowledgement */}
            <label className="terms">
              <input
                type="checkbox"
                checked={inspectionAck}
                onChange={(e) => setInspectionAck(e.target.checked)}
              />
              <span>
                I acknowledge these photos and notes accurately represent the current condition of {selectedCar.name} and agree to the KasaRide handover policy.
              </span>
            </label>

            <Button
              disabled={
                screen !== "return"
                  ? (pickupInspections.length < 8 || !fuelLevelCaptured || !inspectionAck)
                  : !inspectionAck
              }
              onClick={() => {
                if (screen === "return") {
                  showToast("Return inspection submitted! Deposit release initiated.");
                  go("review");
                } else {
                  // Promote the inspecting trip from upcoming → active
                  if (inspectingTripId) {
                    setTrips(prev => prev.map(t =>
                      t.id === inspectingTripId
                        ? { ...t, status: "active" as const, fuelLevel: fuelLevelCaptured ?? undefined }
                        : t
                    ));
                  }
                  showToast("Vehicle collected! Pre-trip inspection signed. Rental is now active.");
                  setTripTab("active");
                  go("trips");
                }
              }}
            >
              {screen === "return" ? "Sign & complete return inspection" : "Confirm vehicle collection"}
            </Button>
            <Button variant="ghost" onClick={() => go("dispute")}>
              Report damage or open dispute instead
            </Button>
          </section>
        </Page>
      )}

      {/* SCREEN: REVIEW */}
      {screen === "review" && (
        <Page className="plain-page">
          <Header title="Rate your trip" back={() => go("home")} />
          <section className="form-page">
            <p className="eyebrow">COMPLETED TRIP · ACCRA</p>
            <h1>How was your rental?</h1>
            <p>Your feedback helps maintain a trusted KasaRide community across Ghana.</p>

            <div className="rating-input" aria-label="Rating selection">
              {["★", "★", "★", "★", "★"].map((star, i) => (
                <button
                  key={i}
                  style={{ color: "var(--gold)" }}
                  onClick={() => showToast(`Rated ${i + 1} stars`)}
                >
                  {star}
                </button>
              ))}
              <strong>5.0 · Outstanding host & vehicle</strong>
            </div>

            <div className="chip-wrap">
              {[
                "Pristine condition",
                "Freezing A/C",
                "Smooth pickup",
                "Clear communication",
                "Accurate fuel level",
              ].map((chip) => (
                <button key={chip} onClick={() => showToast(`Selected tag: ${chip}`)}>
                  {chip}
                </button>
              ))}
            </div>

            <label className="field">
              <span>Write a public review for {selectedCar.host.name}</span>
              <textarea placeholder="Tell other Accra renters about the driving experience and host communication..." />
            </label>

            <Button
              onClick={() => {
                showToast("Thank you for your review!");
                go("home");
              }}
            >
              Submit review
            </Button>
          </section>
        </Page>
      )}

      {/* SCREEN: SUPPORT & DISPUTE ENTRY */}
      {(screen === "support" || screen === "dispute") && (
        <Page className="plain-page">
          <Header
            title={screen === "dispute" ? "Dispute resolution" : "Support centre"}
            back={() => go("trips")}
          />
          <section className="form-page">
            <p className="eyebrow">ACCRA RESOLUTION TEAM</p>
            <h1>{screen === "dispute" ? "Open an official dispute" : "How can we help today?"}</h1>
            <p>
              KasaRide mediation follows documented photo evidence and GPS timestamps to resolve disputes fairly within 48 hours.
            </p>

            <div className="option-list">
              {[
                "Security deposit refund dispute",
                "Pre-existing damage claim disagreement",
                "Roadside breakdown / mechanical fault",
                "Host handover delay or no-show",
                "Fuel calculation discrepancy",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSupportCategory(cat);
                    showToast("Selected: " + cat);
                  }}
                  style={{
                    background: supportCategory === cat ? "#edf6f3" : "#fff",
                    fontWeight: supportCategory === cat ? 800 : 600,
                  }}
                >
                  <span>{cat}</span>
                  {supportCategory === cat && <Icon name="check" size={16} />}
                </button>
              ))}
            </div>

            <label className="field">
              <span>Booking reference</span>
              <div>
                <Icon name="trips" size={17} />
                <input value={bookingRef} readOnly />
              </div>
            </label>

            <label className="field">
              <span>Describe the issue in detail</span>
              <textarea
                placeholder="Include facts, times, and what resolution you request. Do not include sensitive financial passwords..."
                value={supportNotes}
                onChange={(e) => setSupportNotes(e.target.value)}
              />
            </label>

            <div className="notice warning">
              <Icon name="alert" />
              <div>
                <strong>Accra emergency contacts</strong>
                <p>For police emergencies in Ghana, dial 191/112. KasaRide support is not an emergency dispatch service.</p>
              </div>
            </div>

            <Button
              onClick={() => {
                const newId = "KS-" + Math.floor(1000 + Math.random() * 9000);
                const newTicket: SupportTicket = {
                  id: newId,
                  category: supportCategory,
                  bookingRef: bookingRef,
                  description: supportNotes || "Issue reported by renter.",
                  status: "Received",
                  date: new Date().toLocaleDateString("en-GB"),
                };
                setTickets([newTicket, ...tickets]);
                setTicketCreated(true);
                showToast(`Ticket ${newId} logged with resolution team!`);
                setTimeout(() => {
                  setTicketCreated(false);
                  go("home");
                }, 2000);
              }}
            >
              {ticketCreated ? "Ticket submitted" : "Submit dispute / ticket"}
            </Button>
          </section>
        </Page>
      )}

      {/* SCREEN: PROFILE */}
      {screen === "profile" && (
        <Page nav="profile" go={go} role={appRole}>
          <Header title="My account" action={<button className="text-link">Edit</button>} />
          <section className="content-section profile-page">
            <div className="profile-head">
              <div className="profile-avatar">{appRole === "driver" ? "KM" : appRole === "admin" ? "KR" : appRole === "owner" ? "NA" : "AA"}</div>
              <div>
                <h1>{appRole === "driver" ? "Kwesi Mensah" : appRole === "admin" ? "KasaRide Operations" : appRole === "owner" ? "Nana Ama Sarpong" : "Ama Asante"}</h1>
                <p>{appRole === "driver" ? "Accra Fleet Delivery Partner · GR-2847-21" : appRole === "admin" ? "Accra Central Dispatch & Logistics Admin" : appRole === "owner" ? "Verified Accra Vehicle Host · Cantonments" : "Verified Ghana Renter · Accra"}</p>
                <Badge gold>{appRole === "driver" ? `Verified Partner (${driverApprovalStatus})` : appRole === "admin" ? "System Admin" : appRole === "owner" ? `Super Host (${ownerApprovalStatus})` : "Verified Renter"}</Badge>
              </div>
            </div>

            <div className="status-card">
              <div>
                <Icon name="shield" />
                <span>
                  <strong>Account status: {appRole === "owner" ? ownerApprovalStatus.toUpperCase() : appRole === "driver" ? driverApprovalStatus.toUpperCase() : "ACTIVE"}</strong>
                  <small>Ghana Driving Licence &amp; Ghana Card verified</small>
                </span>
              </div>
              <span style={{ textTransform: "capitalize" }}>{appRole === "owner" ? ownerApprovalStatus : appRole === "driver" ? driverApprovalStatus : "Active"}</span>
            </div>

            {/* Demo Account Switcher Section inside Profile */}
            <div style={{ background: "#f8faf9", border: "1.5px solid var(--line)", borderRadius: 14, padding: 14, margin: "14px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--navy)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="user" size={13} /> DEMO ACCOUNT SWITCHER
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, background: "var(--forest)", color: "#fff", padding: "2px 6px", borderRadius: 4 }}>
                  {appRole.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 10, color: "var(--muted)", margin: "0 0 10px" }}>
                Switch active demo persona or test verification approval states:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                <button
                  type="button"
                  style={{ padding: "8px", borderRadius: 8, border: "1px solid var(--line)", background: appRole === "renter" ? "var(--forest)" : "#fff", color: appRole === "renter" ? "#fff" : "var(--navy)", fontWeight: 700, fontSize: 11, cursor: "pointer", textAlign: "left" }}
                  onClick={() => { setAppRole("renter"); setSignedInRole("renter"); go("home"); showToast("Switched to Renter Ama Asante"); }}
                >
                  Renter
                </button>
                <button
                  type="button"
                  style={{ padding: "8px", borderRadius: 8, border: "1px solid var(--line)", background: appRole === "owner" ? "var(--forest)" : "#fff", color: appRole === "owner" ? "#fff" : "var(--navy)", fontWeight: 700, fontSize: 11, cursor: "pointer", textAlign: "left" }}
                  onClick={() => { setAppRole("owner"); setSignedInRole("owner"); go("owner-deliveries"); showToast("Switched to Host Nana Ama"); }}
                >
                  Host ({ownerApprovalStatus})
                </button>
                <button
                  type="button"
                  style={{ padding: "8px", borderRadius: 8, border: "1px solid var(--line)", background: appRole === "driver" ? "var(--forest)" : "#fff", color: appRole === "driver" ? "#fff" : "var(--navy)", fontWeight: 700, fontSize: 11, cursor: "pointer", textAlign: "left" }}
                  onClick={() => { setAppRole("driver"); setSignedInRole("driver"); go("driver-workspace"); showToast("Switched to Driver Kwesi"); }}
                >
                  Driver ({driverApprovalStatus})
                </button>
                <button
                  type="button"
                  style={{ padding: "8px", borderRadius: 8, border: "1px solid var(--line)", background: appRole === "admin" ? "var(--forest)" : "#fff", color: appRole === "admin" ? "#fff" : "var(--navy)", fontWeight: 700, fontSize: 11, cursor: "pointer", textAlign: "left" }}
                  onClick={() => { setAppRole("admin"); setSignedInRole("admin"); go("admin-deliveries"); showToast("Switched to Admin Dispatch"); }}
                >
                  Admin Dispatch
                </button>
              </div>

              <button
                className="btn secondary"
                style={{ width: "100%", fontSize: 11, padding: "8px" }}
                onClick={() => {
                  setSignedInRole(null);
                  showToast("Signed out of demo account");
                  go("welcome");
                }}
              >
                Sign out & return to Welcome Role Selection
              </button>
            </div>

            <h2>Account details</h2>
            <div className="option-list">
              {[
                ["user", "Personal information (Name, Email, Phone)"],
                ["phone", "Emergency contact in Ghana"],
                ["trips", "Saved Mobile Money & Card accounts"],
                ["alert", "Trip notification preferences"],
                ["shield", "Security, Privacy & Ghana Card data"],
              ].map(([iconName, text]) => (
                <button key={text} onClick={() => showToast(text)}>
                  <Icon name={iconName} />
                  <span>{text}</span>
                  <Icon name="chevron" />
                </button>
              ))}
            </div>

            <h2>Support & legal</h2>
            <div className="option-list">
              <button onClick={() => go("support")}>
                <Icon name="chat" />
                <span>Help Centre & active tickets ({tickets.length})</span>
                <Icon name="chevron" />
              </button>
              <button onClick={() => showToast("KasaRide Ghana Renter Terms v1.2")}>
                <Icon name="shield" />
                <span>Terms of service & vehicle rules</span>
                <Icon name="chevron" />
              </button>
            </div>

            <button className="signout" onClick={() => go("welcome")}>
              Sign out of demo account
            </button>
            <p className="version">KasaRide Accra Prototype · v0.2.0-preview</p>
          </section>
        </Page>
      )}

      {/* SCREEN: DELIVERY TRACKING */}
      {screen === "delivery-tracking" && <DeliveryTrackingScreen />}

      {/* SCREEN: OWNER DELIVERY JOBS */}
      {screen === "owner-deliveries" && <OwnerDeliveryJobsScreen />}

      {/* SCREEN: ADMIN DELIVERIES DASHBOARD */}
      {screen === "admin-deliveries" && <AdminDeliveriesScreen />}

      {/* SCREEN: DRIVER WORKSPACE */}
      {screen === "driver-workspace" && <DriverWorkspaceScreen />}
    </>
  );

  // ─── inner component: DeliveryTrackingScreen ───────────────────────────────
  function DeliveryTrackingScreen() {
    // Status metadata
    const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
      pending_assignment: { label: "Pending driver assignment", color: "#92400e", bg: "#fef3c7" },
      driver_assigned:   { label: "Driver assigned — preparing vehicle", color: "#1e40af", bg: "#dbeafe" },
      en_route:          { label: "Driver en route to your location", color: "#1e40af", bg: "#dbeafe" },
      arrived:           { label: "Driver has arrived — confirm handover", color: "#065f46", bg: "#d1fae5" },
      handover_complete: { label: "Handover complete — rental active!", color: "#065f46", bg: "#d1fae5" },
      no_driver_available: { label: "No driver available — contact support", color: "#7f1d1d", bg: "#fee2e2" },
      delayed:           { label: "Delivery delayed — ETA updating", color: "#92400e", bg: "#fef3c7" },
      location_unavailable: { label: "Location signal unavailable", color: "#92400e", bg: "#fef3c7" },
      cancelled:         { label: "Delivery cancelled", color: "#7f1d1d", bg: "#fee2e2" },
    };

    const TIMELINE_STEPS: { key: DeliveryStatus; label: string }[] = [
      { key: "pending_assignment", label: "Booking confirmed" },
      { key: "driver_assigned",    label: "Driver assigned" },
      { key: "en_route",           label: "En route to you" },
      { key: "arrived",            label: "Driver arrived" },
      { key: "handover_complete",  label: "Handover complete" },
    ];

    const ORDER: DeliveryStatus[] = ["pending_assignment","driver_assigned","en_route","arrived","handover_complete"];
    const currentIdx = ORDER.indexOf(deliveryStatus);

    const meta = STATUS_META[deliveryStatus];

    // Driver-dot position based on status
    const driverPos: Record<string, { top: string; left: string }> = {
      driver_assigned:   { top: "22%", left: "30%" },
      en_route:          { top: "42%", left: "52%" },
      arrived:           { top: "63%", left: "48%" },
    };
    const showDriverDot = ["driver_assigned","en_route","arrived"].includes(deliveryStatus);
    const dotPos = driverPos[deliveryStatus] ?? { top: "35%", left: "40%" };

    const activeTrip = trips.find(t => t.id === activeDeliveryTripId);
    const activeCar = activeTrip ? (FLEET.find(c => c.id === activeTrip.carId) || FLEET[0]) : selectedCar;

    const handleHandover = () => {
      setDeliveryStatus("handover_complete");
      if (activeDeliveryTripId) {
        setTrips(prev => prev.map(t =>
          t.id === activeDeliveryTripId
            ? { ...t, status: "active" as const, deliveryStatus: "handover_complete" }
            : t
        ));
      }
      showToast("Handover complete! Your rental is now active.");
      setTripTab("active");
      go("trips");
    };

    return (
      <Page className="plain-page">
        <Header
          title="Delivery tracking"
          back={() => go("trips")}
          action={
            <button className="text-link" onClick={() => go("support")}>Support</button>
          }
        />

        {/* ── MAP PLACEHOLDER ── */}
        <div style={{ position: "relative", height: 230, background: "#1a2e1a", overflow: "hidden", margin: "0 0 0 0" }}>
          {/* Grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          {/* Road lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <line x1="0" y1="55%" x2="100%" y2="55%" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            {/* Route line driver → you */}
            {showDriverDot && (
              <line
                x1={dotPos.left} y1={dotPos.top}
                x2="50%" y2="82%"
                stroke="#34d399" strokeWidth="2" strokeDasharray="6 4" opacity="0.7"
              />
            )}
          </svg>

          {/* Driver marker */}
          {showDriverDot && (
            <div style={{
              position: "absolute",
              top: dotPos.top, left: dotPos.left,
              transform: "translate(-50%, -50%)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: "#2563eb",
                border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 0 0 6px rgba(37,99,235,0.3)",
                animation: deliveryStatus === "en_route" ? "pulse 1.5s infinite" : "none",
              }}><Icon name="home" size={18} /></div>
              {deliveryDriver && (
                <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", background: "#1e40af", color: "#fff", borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 800, whiteSpace: "nowrap" }}>
                  {deliveryDriver.plateNumber}
                </div>
              )}
            </div>
          )}

          {/* "You" pin */}
          <div style={{
            position: "absolute", bottom: "12%", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#10b981", border: "3px solid #fff", boxShadow: "0 0 0 4px rgba(16,185,129,0.3)" }} />
            <div style={{ background: "#064e3b", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 6, padding: "2px 6px", marginTop: 4 }}>YOU</div>
          </div>

          {/* Map label */}
          <div style={{ position: "absolute", bottom: 8, right: 10, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "3px 7px", fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>
            ACCRA · DEMO MAP
          </div>
        </div>

        <section style={{ padding: "0 16px 100px" }}>

          {/* ── STATUS BANNER ── */}
          <div style={{ background: meta.bg, borderRadius: 12, padding: "12px 14px", margin: "14px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: meta.color, display: "flex", alignItems: "center" }}>
              <Icon
                name={
                  deliveryStatus === "pending_assignment" ? "clock" :
                  deliveryStatus === "driver_assigned" ? "check" :
                  deliveryStatus === "en_route" ? "home" :
                  deliveryStatus === "arrived" ? "pin" :
                  deliveryStatus === "handover_complete" ? "check" :
                  deliveryStatus === "no_driver_available" ? "alert" :
                  deliveryStatus === "cancelled" ? "x" : "clock"
                }
                size={20}
              />
            </div>
            <div>
              <strong style={{ fontSize: 13, color: meta.color, display: "block" }}>{meta.label}</strong>
              {(deliveryStatus === "en_route" || deliveryStatus === "driver_assigned") && (
                <span style={{ fontSize: 11, color: meta.color, fontWeight: 700 }}>
                  ETA: ~{deliveryEta} min
                </span>
              )}
            </div>
          </div>

          {/* ── DRIVER CARD ── */}
          {deliveryDriver && ["driver_assigned","en_route","arrived"].includes(deliveryStatus) && (
            <div style={{ border: "1.5px solid var(--line)", borderRadius: 14, padding: "14px 16px", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: deliveryDriver.avatarBg, color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {deliveryDriver.initials}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14 }}>{deliveryDriver.name}</strong>
                <div style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0" }}>
                  {deliveryDriver.plateNumber} · ★ {deliveryDriver.rating}
                </div>
                <Badge>Verified KasaRide Driver</Badge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  className="icon-btn"
                  onClick={() => showToast("Demo: " + deliveryDriver.phone)}
                  aria-label="Call driver"
                  style={{ background: "#edf6f3" }}
                >
                  <Icon name="phone" size={18} />
                </button>
                <button
                  className="icon-btn"
                  onClick={() => go("chat")}
                  aria-label="Chat with driver"
                  style={{ background: "#edf6f3" }}
                >
                  <Icon name="chat" size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ── DELIVERY ADDRESS SUMMARY ── */}
          {activeTrip && (
            <div style={{ background: "#f5f7f5", borderRadius: 12, padding: "12px 14px", margin: "0 0 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="pin" size={18} />
              <div style={{ fontSize: 12 }}>
                <strong style={{ display: "block", marginBottom: 2 }}>Delivering to</strong>
                <span style={{ color: "var(--muted)" }}>{activeTrip.deliveryAddress || bookingDraft.deliveryAddress || "East Legon, Accra"}</span>
                <span style={{ display: "block", marginTop: 3, color: "var(--muted)" }}>Window: {activeTrip.deliveryWindow || bookingDraft.deliveryWindow}</span>
              </div>
            </div>
          )}

          {/* ── STATUS TIMELINE ── */}
          <div style={{ margin: "0 0 16px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>Delivery progress</h2>
            {TIMELINE_STEPS.map((step, i) => {
              const stepIdx = ORDER.indexOf(step.key);
              const isActive = i === currentIdx && currentIdx >= 0;
              const isDone = currentIdx > i;
              return (
                <div key={step.key} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: isDone ? "var(--emerald)" : isActive ? "#2563eb" : "#e5e7eb",
                      border: isActive ? "3px solid #bfdbfe" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: isDone || isActive ? "#fff" : "#9ca3af",
                      fontWeight: 800,
                    }}>
                      {isDone ? "✓" : i + 1}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div style={{ width: 2, height: 20, background: isDone ? "var(--emerald)" : "#e5e7eb", marginTop: 3 }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <strong style={{ fontSize: 12, color: isActive ? "#1e40af" : isDone ? "var(--forest)" : "var(--muted)" }}>
                      {step.label}
                    </strong>
                    {isActive && <small style={{ display: "block", color: "#6b7280", fontSize: 10 }}>In progress…</small>}
                    {isDone && <small style={{ display: "block", color: "var(--success)", fontSize: 10 }}>Completed ✓</small>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── HANDOVER BUTTON (arrived state only) ── */}
          {deliveryStatus === "arrived" && (
            <div style={{ margin: "0 0 16px", background: "#d1fae5", borderRadius: 14, padding: "16px" }}>
              <strong style={{ fontSize: 14, color: "#065f46", display: "block", marginBottom: 6 }}>
                Driver is at your location
              </strong>
              <p style={{ fontSize: 12, color: "#047857", margin: "0 0 12px" }}>
                Confirm you have received the keys and inspected the vehicle with the driver.
              </p>
              <Button onClick={handleHandover}>
                Confirm handover — activate rental
              </Button>
            </div>
          )}

          {/* ── ACTION BUTTONS ── */}
          <div style={{ display: "flex", gap: 10, margin: "0 0 16px" }}>
            <button
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid var(--line)", background: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              onClick={() => go("support")}
            >
              <Icon name="shield" size={16} /> Contact support
            </button>
            <button
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid var(--line)", background: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              onClick={() => go("chat")}
            >
              <Icon name="chat" size={16} /> Chat with host
            </button>
          </div>

          {/* ── DEMO SIMULATION CONTROLS ── */}
          <div style={{ background: "#f8f9f8", borderRadius: 12, padding: "14px 16px", border: "1px dashed var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Badge gold>PROTOTYPE</Badge>
              <span style={{ fontSize: 11, fontWeight: 700 }}>Delivery simulation controls</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <button
                className="inline-link"
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 8, background: "#edf6f3", color: "var(--forest)" }}
                onClick={advanceDeliveryStatus}
                disabled={deliveryStatus === "handover_complete"}
              >
                Advance status
              </button>
              <button
                className="inline-link"
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 8, background: "#fee2e2", color: "#7f1d1d" }}
                onClick={() => { setDeliveryStatus("no_driver_available"); setDeliveryDriver(null); }}
              >
                No driver
              </button>
              <button
                className="inline-link"
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 8, background: "#fef3c7", color: "#92400e" }}
                onClick={() => setDeliveryStatus("delayed")}
              >
                Delayed
              </button>
              <button
                className="inline-link"
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 8, background: "#fef3c7", color: "#92400e" }}
                onClick={() => setDeliveryStatus("location_unavailable")}
              >
                No location
              </button>
              <button
                className="inline-link"
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 8, background: "#fee2e2", color: "#7f1d1d" }}
                onClick={() => { setDeliveryStatus("cancelled"); setDeliveryDriver(null); }}
              >
                Cancelled
              </button>
              <button
                className="inline-link"
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 8, background: "#e5e7eb", color: "#374151" }}
                onClick={() => {
                  setDeliveryStatus("pending_assignment");
                  setDeliveryDriver(null);
                  setDeliveryEta(18);
                }}
              >
                ↺ Reset
              </button>
            </div>
          </div>
        </section>
      </Page>
    );
  }

  // ─── inner component: OwnerDeliveryJobsScreen ─────────────────────────────
  function OwnerDeliveryJobsScreen() {
    const [filterTab, setFilterTab] = useState<"all" | "active" | "exceptions" | "completed">("all");
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (ownerApprovalStatus !== "approved") {
      return (
        <Page nav="owner-deliveries" go={go} role="owner">
          <Header title="Host Approval Status" action={<button className="text-link" onClick={() => go("welcome")}>Sign Out</button>} />
          <section className="content-section" style={{ padding: 16 }}>
            <div className={`review-status-card ${ownerApprovalStatus}`}>
              <div className="review-status-icon">
                <Icon name={ownerApprovalStatus === "pending_review" ? "clock" : "x"} size={28} />
              </div>
              <h2 style={{ margin: "6px 0" }}>
                {ownerApprovalStatus === "pending_review" ? "Host Application Under Review" : "Host Application Not Approved"}
              </h2>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0 16px" }}>
                {ownerApprovalStatus === "pending_review"
                  ? "Your vehicle registration and ownership documentation for Accra host operations are being verified by KasaRide Compliance. Estimated completion: 2–4 business hours."
                  : "Your application did not meet KasaRide vehicle age or commercial insurance criteria for peer-to-peer rental in Ghana."}
              </p>

              <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 12, textAlign: "left", fontSize: 11, marginBottom: 16 }}>
                <strong>SUBMITTED HOST DETAILS:</strong>
                <div style={{ margin: "4px 0" }}>• Host Name: Nana Ama Sarpong</div>
                <div style={{ margin: "4px 0" }}>• Primary Vehicle: BMW X3 (GT-4920-24)</div>
                <div style={{ margin: "4px 0" }}>• Hub Location: Cantonments, Accra</div>
                <div style={{ margin: "4px 0" }}>• Insurance Provider: Enterprise Insurance Ghana</div>
              </div>

              <div style={{ background: "#edf6f2", padding: 12, borderRadius: 12, border: "1px dashed var(--forest)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--forest)", display: "block", marginBottom: 6 }}>
                  PROTOTYPE DEMO CONTROL:
                </span>
                <button
                  className="btn primary"
                  style={{ fontSize: 11, padding: "8px 14px" }}
                  onClick={() => {
                    setOwnerApprovalStatus("approved");
                    showToast("Owner Account Approved! Operational jobs unlocked.");
                  }}
                >
                  Mark Host Approved &amp; Unlock Operational Jobs
                </button>
              </div>
            </div>
          </section>
        </Page>
      );
    }

    const bookedCar = FLEET.find(c => c.id === bookingDraft.carId) || FLEET[0];
    const isDeliveryActive = bookingDraft.deliverySelected;

    const OWNER_STATUS_META: Record<
      DeliveryStatus,
      { label: string; sub: string; badgeBg: string; badgeColor: string; isException: boolean; isCompleted: boolean }
    > = {
      pending_assignment: {
        label: "Pending driver assignment",
        sub: "KasaRide dispatch searching for nearest available driver in Accra",
        badgeBg: "#fef3c7",
        badgeColor: "#92400e",
        isException: false,
        isCompleted: false,
      },
      driver_assigned: {
        label: "Driver assigned — vehicle prepped",
        sub: "Driver prepped vehicle at host hub and heading out",
        badgeBg: "#dbeafe",
        badgeColor: "#1e40af",
        isException: false,
        isCompleted: false,
      },
      en_route: {
        label: "Driver en route to renter location",
        sub: "Driver navigating to delivery address in Accra",
        badgeBg: "#dbeafe",
        badgeColor: "#1e40af",
        isException: false,
        isCompleted: false,
      },
      arrived: {
        label: "Driver arrived at destination",
        sub: "Awaiting renter pre-trip inspection and handover key code",
        badgeBg: "#d1fae5",
        badgeColor: "#065f46",
        isException: false,
        isCompleted: false,
      },
      handover_complete: {
        label: "Handover complete — active rental",
        sub: "Vehicle handed over to renter Ama Bonsu; rental active",
        badgeBg: "#d1fae5",
        badgeColor: "#065f46",
        isException: false,
        isCompleted: true,
      },
      no_driver_available: {
        label: "No driver available — alert dispatch",
        sub: "High Accra demand; re-allocating backup dispatch driver",
        badgeBg: "#fee2e2",
        badgeColor: "#7f1d1d",
        isException: true,
        isCompleted: false,
      },
      delayed: {
        label: "Delivery delayed — traffic backup",
        sub: "Heavy traffic near Spintex/East Legon; ETA updated",
        badgeBg: "#fef3c7",
        badgeColor: "#92400e",
        isException: true,
        isCompleted: false,
      },
      location_unavailable: {
        label: "Location signal unavailable",
        sub: "Driver GPS signal lost temporary; contact driver by phone",
        badgeBg: "#fef3c7",
        badgeColor: "#92400e",
        isException: true,
        isCompleted: false,
      },
      cancelled: {
        label: "Delivery cancelled",
        sub: "Booking cancelled; vehicle returned to available fleet",
        badgeBg: "#fee2e2",
        badgeColor: "#7f1d1d",
        isException: true,
        isCompleted: true,
      },
    };

    const currentMeta = OWNER_STATUS_META[deliveryStatus];
    const ORDER: DeliveryStatus[] = ["pending_assignment", "driver_assigned", "en_route", "arrived", "handover_complete"];
    const currentStepIdx = ORDER.indexOf(deliveryStatus);

    const TIMELINE_STEPS = [
      { key: "pending_assignment", label: "Pending" },
      { key: "driver_assigned", label: "Assigned" },
      { key: "en_route", label: "En route" },
      { key: "arrived", label: "Arrived" },
      { key: "handover_complete", label: "Handover" },
    ];

    const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    };

    const shouldShowCurrentJob = () => {
      if (filterTab === "all") return true;
      if (filterTab === "active") return !currentMeta.isCompleted && !currentMeta.isException;
      if (filterTab === "exceptions") return currentMeta.isException;
      if (filterTab === "completed") return currentMeta.isCompleted;
      return true;
    };

    const showCard = isDeliveryActive && shouldShowCurrentJob();

    return (
      <Page nav="owner-deliveries" go={go} role="owner">
        <Header
          title="Vehicle Delivery Jobs"
          action={
            <button className="icon-btn" onClick={handleRefresh} title="Refresh jobs list">
              <Icon name="clock" size={18} />
            </button>
          }
        />
        <section className="content-section">
          {/* Role Switch Bar */}
          <div className="role-switch-bar">
            <button
              className={`role-switch-btn ${appRole === "renter" ? "active" : ""}`}
              onClick={() => { setAppRole("renter"); go("home"); }}
            >
              Renter View
            </button>
            <button
              className={`role-switch-btn ${appRole === "owner" ? "active" : ""}`}
              onClick={() => { setAppRole("owner"); setScreen("owner-deliveries"); }}
            >
              Vehicle Owner (Host View)
            </button>
          </div>

          {/* Banner */}
          <div className="card" style={{ background: "linear-gradient(135deg, #0d4739 0%, #176551 100%)", color: "#fff", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="tag" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>OWNER DASHBOARD</span>
                <h2 style={{ color: "#fff", margin: "6px 0 2px" }}>Accra Delivery Operations</h2>
                <p style={{ fontSize: 11, opacity: 0.9 }}>
                  Manage vehicle drop-offs, track assigned drivers &amp; review handover readiness.
                </p>
              </div>
              <div style={{ textAlign: "right", paddingLeft: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 800 }}>{isDeliveryActive ? "1" : "0"}</span>
                <small style={{ display: "block", fontSize: 9, opacity: 0.8, textTransform: "uppercase" }}>Active Job</small>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="segment-control" style={{ marginBottom: 14 }}>
            <button className={filterTab === "all" ? "active" : ""} onClick={() => setFilterTab("all")}>
              All ({isDeliveryActive ? 1 : 0})
            </button>
            <button className={filterTab === "active" ? "active" : ""} onClick={() => setFilterTab("active")}>
              Active {!currentMeta.isCompleted && !currentMeta.isException && isDeliveryActive ? "(1)" : ""}
            </button>
            <button className={filterTab === "exceptions" ? "active" : ""} onClick={() => setFilterTab("exceptions")}>
              Exceptions {currentMeta.isException && isDeliveryActive ? "(1)" : ""}
            </button>
            <button className={filterTab === "completed" ? "active" : ""} onClick={() => setFilterTab("completed")}>
              Completed {currentMeta.isCompleted && isDeliveryActive ? "(1)" : ""}
            </button>
          </div>

          {/* Loading Indicator */}
          {isRefreshing && (
            <div className="card text-center" style={{ padding: 10, background: "#f0fdf4", color: "#166534", marginBottom: 12 }}>
              <small style={{ fontWeight: 700 }}>↻ Refreshing Accra delivery dispatch feed...</small>
            </div>
          )}

          {/* EMPTY STATE */}
          {!showCard && (
            <div className="card text-center" style={{ padding: "32px 16px", margin: "16px 0" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: "var(--muted)" }}><Icon name="truck" size={36} /></div>
              <h3>No Delivery Jobs Found</h3>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0 16px" }}>
                {filterTab === "exceptions"
                  ? "No active delivery exceptions. All vehicle deliveries operating normally."
                  : filterTab === "completed"
                  ? "No completed vehicle deliveries in this session."
                  : "You currently have no active vehicle delivery requests in Accra."}
              </p>
              <button
                className="btn primary"
                onClick={() => {
                  setBookingDraft(prev => ({
                    ...prev,
                    deliverySelected: true,
                    deliveryAddress: "GH-054-9201, Cantonments Rd, Accra",
                    deliveryWindow: "09:00 – 11:00",
                  }));
                  setDeliveryStatus("pending_assignment");
                  setDeliveryDriver(null);
                  setDeliveryEta(18);
                  showToast("Demo delivery booking created!");
                }}
              >
                + Create Demo Delivery Booking
              </button>
            </div>
          )}

          {/* JOB CARD */}
          {showCard && (
            <div className="owner-job-card">
              {/* Card Header & Status */}
              <div className="owner-job-header">
                <div>
                  <span className="owner-job-ref">BOOKING REF: {bookingRef}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 800,
                        background: currentMeta.badgeBg,
                        color: currentMeta.badgeColor,
                      }}
                    >
                      ● {currentMeta.label}
                    </span>
                  </div>
                </div>
                <div>
                  {deliveryStatus !== "cancelled" ? (
                    <span className="vehicle-unavail-badge">Vehicle Unavailable</span>
                  ) : (
                    <span className="vehicle-avail-badge">Vehicle Available</span>
                  )}
                </div>
              </div>

              {/* Sub-explanation */}
              <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 12px", background: "#f8faf9", padding: "6px 10px", borderRadius: 6 }}>
                {currentMeta.sub}
              </p>

              {/* Special State Banners */}
              {deliveryStatus === "delayed" && (
                <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "10px 12px", borderRadius: 8, color: "#92400e", fontSize: 11, marginBottom: 12 }}>
                  <strong>Delivery Delay Alert:</strong> Driver stuck in Spintex traffic. Updated ETA ~25 mins. Renter notified.
                </div>
              )}
              {deliveryStatus === "no_driver_available" && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: 8, color: "#991b1b", fontSize: 11, marginBottom: 12 }}>
                  <strong>No Driver Available:</strong> High demand in Accra. Re-allocating backup dispatch driver.
                </div>
              )}
              {deliveryStatus === "location_unavailable" && (
                <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "10px 12px", borderRadius: 8, color: "#92400e", fontSize: 11, marginBottom: 12 }}>
                  <strong>GPS Signal Lost:</strong> Telematics link temporarily down. Driver is en route. Contact driver via phone.
                </div>
              )}
              {deliveryStatus === "cancelled" && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "10px 12px", borderRadius: 8, color: "#991b1b", fontSize: 11, marginBottom: 12 }}>
                  <strong>Job Cancelled:</strong> Delivery cancelled. Vehicle returned to Accra available fleet.
                </div>
              )}

              {/* 5-Step Delivery Timeline */}
              <div style={{ margin: "14px 0 10px" }}>
                <small style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", display: "block" }}>
                  Delivery Progress Timeline
                </small>
                <div className="owner-timeline">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isDone = currentStepIdx > idx || deliveryStatus === "handover_complete";
                    const isActive = currentStepIdx === idx && deliveryStatus !== "handover_complete";
                    return (
                      <div
                        key={step.key}
                        className={`owner-timeline-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                      >
                        <div className="dot">
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vehicle & Renter Details Grid */}
              <div className="owner-job-grid">
                <div className="owner-job-info-box">
                  <label>Vehicle &amp; Host Fleet</label>
                  <strong style={{ display: "block", color: "var(--ink)" }}>{bookedCar.name} ({bookedCar.modelYear})</strong>
                  <span style={{ color: "var(--muted)", fontSize: 10 }}>Plate: GW 4821 - 22 • {bookedCar.type}</span>
                </div>
                <div className="owner-job-info-box">
                  <label>Renter Contact</label>
                  <strong style={{ display: "block", color: "var(--ink)" }}>Ama Bonsu</strong>
                  <span style={{ color: "var(--muted)", fontSize: 10 }}>+233 24 456 7890 • Ghana Card ✓</span>
                </div>
                <div className="owner-job-info-box">
                  <label>Delivery Destination &amp; Window</label>
                  <strong style={{ display: "block", color: "var(--ink)" }}>{bookingDraft.deliveryAddress || "Cantonments Rd, Accra"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 10 }}>Window: {bookingDraft.deliveryWindow}</span>
                </div>
                <div className="owner-job-info-box">
                  <label>Delivery Fee &amp; Driver</label>
                  <strong style={{ display: "block", color: "#065f46" }}>GH₵100 (Host Earnings)</strong>
                  <span style={{ color: "var(--muted)", fontSize: 10 }}>
                    {deliveryDriver ? `Driver: ${deliveryDriver.name} (★ ${deliveryDriver.rating})` : "Driver: Unassigned placeholder"}
                  </span>
                </div>
              </div>

              {/* Vehicle Availability Status Banner */}
              <div style={{ background: deliveryStatus !== "cancelled" ? "#fff5f5" : "#f0fdf4", border: `1px solid ${deliveryStatus !== "cancelled" ? "#feb2b2" : "#bbf7d0"}`, padding: "8px 10px", borderRadius: 8, fontSize: 11, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: deliveryStatus !== "cancelled" ? "#991b1b" : "#166534" }}>
                  {deliveryStatus !== "cancelled"
                    ? `Fleet Availability: ${bookedCar.name} is currently UNAVAILABLE for new bookings (Out for delivery / active rental).`
                    : `Fleet Availability: ${bookedCar.name} is AVAILABLE in Accra for new bookings.`}
                </span>
              </div>

              {/* Owner Actions */}
              <small style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 6 }}>
                Owner Actions
              </small>
              <div className="owner-actions-grid">
                <button
                  className="owner-action-btn primary"
                  onClick={() => go("delivery-tracking")}
                >
                  <Icon name="map" size={14} />
                  <span>View Delivery</span>
                </button>
                <button
                  className="owner-action-btn"
                  onClick={() => go("chat")}
                >
                  <Icon name="chat" size={14} />
                  <span>Chat with Partner</span>
                </button>
                <button
                  className="owner-action-btn"
                  onClick={() => go("support")}
                >
                  <Icon name="phone" size={14} />
                  <span>Contact Support</span>
                </button>
                <button
                  className="owner-action-btn"
                  onClick={() => go("dispute")}
                >
                  <Icon name="alert" size={14} />
                  <span>Report an Issue</span>
                </button>
              </div>

              {/* Owner Demo Controls */}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px dashed var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <small style={{ fontSize: 10, fontWeight: 800, color: "var(--forest)", textTransform: "uppercase" }}>
                    Owner Demo Controls (Status Overrides)
                  </small>
                  <button
                    className="inline-link"
                    style={{ fontSize: 11, fontWeight: 700, background: "var(--sand)", padding: "2px 8px", borderRadius: 6 }}
                    onClick={advanceDeliveryStatus}
                  >
                    ▶ Advance Status
                  </button>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {[
                    ["pending_assignment", "Pending"],
                    ["driver_assigned", "Assigned"],
                    ["en_route", "En Route"],
                    ["arrived", "Arrived"],
                    ["handover_complete", "Complete"],
                    ["delayed", "Delayed"],
                    ["no_driver_available", "No Driver"],
                    ["location_unavailable", "No GPS"],
                    ["cancelled", "Cancelled"],
                  ].map(([st, lbl]) => (
                    <button
                      key={st}
                      style={{
                        fontSize: 10,
                        padding: "3px 7px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        background: deliveryStatus === st ? "var(--forest)" : "#fff",
                        color: deliveryStatus === st ? "#fff" : "#333",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      onClick={() => {
                        setDeliveryStatus(st as DeliveryStatus);
                        if (st === "driver_assigned" || st === "en_route" || st === "arrived" || st === "handover_complete") {
                          if (!deliveryDriver) setDeliveryDriver(DEMO_DRIVER);
                        } else if (st === "no_driver_available" || st === "pending_assignment" || st === "cancelled") {
                          setDeliveryDriver(null);
                        }
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                  <button
                    style={{ fontSize: 10, padding: "3px 7px", borderRadius: 6, border: "1px solid #ccc", background: "#e5e7eb", cursor: "pointer", fontWeight: 700 }}
                    onClick={() => { setDeliveryStatus("pending_assignment"); setDeliveryDriver(null); }}
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </Page>
    );
  }

  // ─── inner component: AdminDeliveriesScreen ──────────────────────────────
  function AdminDeliveriesScreen() {
    const [adminFilter, setAdminFilter] = useState<
      "all" | "unassigned" | "active" | "delayed" | "cancelled" | "no_driver" | "location_unavailable" | "completed"
    >("all");
    const [selectedJobId, setSelectedJobId] = useState<string>("job-1");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [simulateError, setSimulateError] = useState(false);

    const bookedCar = FLEET.find(c => c.id === bookingDraft.carId) || FLEET[0];

    const DEMO_ALT_DRIVER: DeliveryDriver = {
      name: "Kwame Osei",
      initials: "KO",
      avatarBg: "#2b6cb0",
      phone: "+233 20 555 6677",
      rating: 4.88,
      plateNumber: "GW-9120-23",
      etaMinutes: 14,
    };

    // Full delivery jobs list (Job 1 is live synced with top-level state)
    const jobs: AdminDeliveryJob[] = [
      {
        id: "job-1",
        bookingRef: bookingRef || "KR-A7F2D9",
        vehicleName: `${bookedCar.name} (${bookedCar.modelYear})`,
        vehiclePlate: "GW 4821 - 22",
        renterName: "Ama Bonsu",
        renterContactMasked: "Ama B. (+233 24 *** 7890)",
        deliveryAddress: bookingDraft.deliveryAddress || "GH-054-9201, Cantonments Rd, Accra",
        deliveryWindow: bookingDraft.deliveryWindow || "09:00 – 11:00",
        deliveryFeeGh: 100,
        status: deliveryStatus,
        driver: deliveryDriver,
        etaMinutes: deliveryEta,
        lastUpdated: "2 mins ago",
        auditTrail: [
          { time: "09:00 AM", event: "Booking created & vehicle delivery selected", actor: "Ama Bonsu (Renter)" },
          { time: "09:02 AM", event: "Dispatch system initialized Accra driver matching", actor: "System Automator" },
          ...(deliveryDriver
            ? [{ time: "09:05 AM", event: `Assigned driver ${deliveryDriver.name} (${deliveryDriver.plateNumber})`, actor: "Central Dispatch" }]
            : []),
          ...(deliveryStatus === "en_route"
            ? [{ time: "09:12 AM", event: "Driver en route to Cantonments destination", actor: "Telematics Link" }]
            : []),
          ...(deliveryStatus === "arrived"
            ? [{ time: "09:25 AM", event: "Driver arrived at delivery destination pin", actor: "Driver App" }]
            : []),
          ...(deliveryStatus === "handover_complete"
            ? [{ time: "09:30 AM", event: "Handover inspection verified & keys transferred", actor: "Renter & Driver" }]
            : []),
          ...(deliveryStatus === "delayed"
            ? [{ time: "09:15 AM", event: "Traffic delay reported near Spintex road; ETA extended", actor: "Driver App" }]
            : []),
          ...(deliveryStatus === "no_driver_available"
            ? [{ time: "09:04 AM", event: "No local driver responded; re-queuing dispatch", actor: "System Alert" }]
            : []),
          ...(deliveryStatus === "location_unavailable"
            ? [{ time: "09:18 AM", event: "GPS location signal interrupted", actor: "Telematics Alert" }]
            : []),
          ...(deliveryStatus === "cancelled"
            ? [{ time: "09:10 AM", event: "Delivery booking cancelled by user", actor: "Ama Bonsu (Renter)" }]
            : []),
        ],
        supportHistory: tickets.map(t => ({ date: t.date, note: `${t.category}: ${t.description}`, status: t.status })),
      },
      {
        id: "job-2",
        bookingRef: "KR-B391E0",
        vehicleName: "BMW X3 (2021)",
        vehiclePlate: "GR 9012 - 20",
        renterName: "Kwame Mensah",
        renterContactMasked: "Kwame M. (+233 55 *** 1234)",
        deliveryAddress: "14 Senchi St, Airport Residential, Accra",
        deliveryWindow: "11:00 – 13:00",
        deliveryFeeGh: 100,
        status: "en_route",
        driver: DEMO_ALT_DRIVER,
        etaMinutes: 12,
        lastUpdated: "8 mins ago",
        auditTrail: [
          { time: "10:45 AM", event: "Booking created for Airport Residential delivery", actor: "Kwame Mensah" },
          { time: "10:48 AM", event: "Assigned Kwame Osei (GW-9120-23)", actor: "Dispatch Admin" },
          { time: "10:55 AM", event: "Driver en route", actor: "Driver App" },
        ],
        supportHistory: [],
      },
      {
        id: "job-3",
        bookingRef: "KR-C552F8",
        vehicleName: "Honda Civic (2019)",
        vehiclePlate: "GT 3341 - 19",
        renterName: "Esi Sarpong",
        renterContactMasked: "Esi S. (+233 27 *** 9988)",
        deliveryAddress: "Spintex Rd near Palace Mall, Accra",
        deliveryWindow: "14:00 – 16:00",
        deliveryFeeGh: 100,
        status: "pending_assignment",
        driver: null,
        etaMinutes: 25,
        lastUpdated: "15 mins ago",
        auditTrail: [
          { time: "13:30 PM", event: "Delivery request submitted", actor: "Esi Sarpong" },
          { time: "13:32 PM", event: "Awaiting driver assignment", actor: "System" },
        ],
        supportHistory: [],
      },
      {
        id: "job-4",
        bookingRef: "KR-D881A2",
        vehicleName: "Lexus ES 350 (2020)",
        vehiclePlate: "GW 1102 - 20",
        renterName: "Kojo Boateng",
        renterContactMasked: "Kojo B. (+233 50 *** 4411)",
        deliveryAddress: "7 Independence Ave, Ridge, Accra",
        deliveryWindow: "08:00 – 10:00",
        deliveryFeeGh: 100,
        status: "handover_complete",
        driver: DEMO_DRIVER,
        etaMinutes: 0,
        lastUpdated: "1 hour ago",
        auditTrail: [
          { time: "07:30 AM", event: "Booking created", actor: "Kojo Boateng" },
          { time: "07:35 AM", event: "Assigned Kofi Mensah", actor: "Dispatch" },
          { time: "08:10 AM", event: "Handover completed cleanly", actor: "Renter & Driver" },
        ],
        supportHistory: [{ date: "18 Jul 2025", note: "Early delivery requested", status: "Resolved" }],
      },
    ];

    // Filter jobs
    const filteredJobs = jobs.filter(j => {
      if (adminFilter === "all") return true;
      if (adminFilter === "unassigned") return !j.driver || j.status === "pending_assignment" || j.status === "no_driver_available";
      if (adminFilter === "active") return j.status === "pending_assignment" || j.status === "driver_assigned" || j.status === "en_route" || j.status === "arrived";
      if (adminFilter === "delayed") return j.status === "delayed";
      if (adminFilter === "cancelled") return j.status === "cancelled";
      if (adminFilter === "no_driver") return j.status === "no_driver_available";
      if (adminFilter === "location_unavailable") return j.status === "location_unavailable";
      if (adminFilter === "completed") return j.status === "handover_complete";
      return true;
    });

    const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

    // Metrics calculation
    const totalJobsCount = jobs.length;
    const activeJobsCount = jobs.filter(j => j.status === "pending_assignment" || j.status === "driver_assigned" || j.status === "en_route" || j.status === "arrived").length;
    const attentionJobsCount = jobs.filter(j => j.status === "delayed" || j.status === "no_driver_available" || j.status === "location_unavailable").length;
    const completedJobsCount = jobs.filter(j => j.status === "handover_complete").length;
    const totalRevenueGh = jobs.reduce((sum, j) => sum + j.deliveryFeeGh, 0);

    const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    };

    const STATUS_BADGES: Record<DeliveryStatus, { label: string; bg: string; color: string }> = {
      pending_assignment: { label: "Pending", bg: "#fef3c7", color: "#92400e" },
      driver_assigned: { label: "Assigned", bg: "#dbeafe", color: "#1e40af" },
      en_route: { label: "En Route", bg: "#dbeafe", color: "#1e40af" },
      arrived: { label: "Arrived", bg: "#d1fae5", color: "#065f46" },
      handover_complete: { label: "Completed", bg: "#d1fae5", color: "#065f46" },
      no_driver_available: { label: "No Driver", bg: "#fee2e2", color: "#7f1d1d" },
      delayed: { label: "Delayed", bg: "#fef3c7", color: "#92400e" },
      location_unavailable: { label: "No Signal", bg: "#fef3c7", color: "#92400e" },
      cancelled: { label: "Cancelled", bg: "#fee2e2", color: "#7f1d1d" },
    };

    const ORDER: DeliveryStatus[] = ["pending_assignment", "driver_assigned", "en_route", "arrived", "handover_complete"];
    const activeStepIdx = ORDER.indexOf(activeJob.status);

    return (
      <Page nav="admin-deliveries" go={go} role="admin">
        <Header
          title="Admin Dispatch Dashboard"
          action={
            <button className="icon-btn" onClick={handleRefresh} title="Refresh dispatch feed">
              <Icon name="clock" size={18} />
            </button>
          }
        />
        <section className="content-section" style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Role Switch Bar */}
          <div className="role-switch-bar">
            <button
              className={`role-switch-btn ${appRole === "renter" ? "active" : ""}`}
              onClick={() => { setAppRole("renter"); go("home"); }}
            >
              Renter
            </button>
            <button
              className={`role-switch-btn ${appRole === "owner" ? "active" : ""}`}
              onClick={() => { setAppRole("owner"); setScreen("owner-deliveries"); }}
            >
              Host
            </button>
            <button
              className={`role-switch-btn ${appRole === "admin" ? "active" : ""}`}
              onClick={() => { setAppRole("admin"); setScreen("admin-deliveries"); }}
            >
              Admin
            </button>
          </div>

          {/* Admin Header Banner */}
          <div className="card" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "#fff", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="tag" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>CENTRAL LOGISTICS &amp; DISPATCH</span>
                <h2 style={{ color: "#fff", margin: "6px 0 2px" }}>KasaRide Accra Delivery Monitor</h2>
                <p style={{ fontSize: 11, opacity: 0.8 }}>
                  Real-time fleet drop-offs, telematics telemetry, driver assignment &amp; dispute override.
                </p>
              </div>
              <button
                className="inline-link"
                style={{ background: simulateError ? "#fee2e2" : "rgba(255,255,255,0.15)", color: simulateError ? "#991b1b" : "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}
                onClick={() => { setSimulateError(!simulateError); showToast(simulateError ? "Dispatch network restored" : "Simulated dispatch error alert"); }}
              >
                {simulateError ? "Error Mode ON" : "Simulate Error"}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {simulateError && (
            <div className="card" style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b", padding: 12, marginBottom: 14, fontSize: 11 }}>
              <strong>Telematics Gateway Warning:</strong> 1 driver node experiencing signal degradation in East Legon area. Manual phone dispatch active.
            </div>
          )}

          {/* Refresh Indicator */}
          {isRefreshing && (
            <div className="card text-center" style={{ padding: 8, background: "#f0fdf4", color: "#166534", marginBottom: 12, fontSize: 11, fontWeight: 700 }}>
              ↻ Syncing live Accra driver GPS coordinates &amp; telematics...
            </div>
          )}

          {/* KPI Cards Grid (5 Cards) */}
          <div className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <label>Total Jobs</label>
              <strong>{totalJobsCount}</strong>
            </div>
            <div className="admin-kpi-card">
              <label>Active</label>
              <strong style={{ color: "#1e40af" }}>{activeJobsCount}</strong>
            </div>
            <div className="admin-kpi-card">
              <label>Attention</label>
              <strong style={{ color: "#92400e" }}>{attentionJobsCount}</strong>
            </div>
            <div className="admin-kpi-card">
              <label>Completed</label>
              <strong style={{ color: "#065f46" }}>{completedJobsCount}</strong>
            </div>
            <div className="admin-kpi-card">
              <label>Revenue (GH₵)</label>
              <strong style={{ color: "var(--forest)" }}>GH₵{totalRevenueGh}</strong>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="segment-control" style={{ marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
            {[
              ["all", `All (${jobs.length})`],
              ["unassigned", "Unassigned"],
              ["active", "Active"],
              ["delayed", "Delayed"],
              ["no_driver", "No Driver"],
              ["location_unavailable", "No Signal"],
              ["cancelled", "Cancelled"],
              ["completed", "Completed"],
            ].map(([fKey, fLabel]) => (
              <button
                key={fKey}
                className={adminFilter === fKey ? "active" : ""}
                onClick={() => setAdminFilter(fKey as any)}
                style={{ whiteSpace: "nowrap", fontSize: 10 }}
              >
                {fLabel}
              </button>
            ))}
          </div>

          {/* QUEUE VIEW: DESKTOP TABLE */}
          <div className="desktop-table-only admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>REF</th>
                  <th>VEHICLE</th>
                  <th>RENTER (MASKED)</th>
                  <th>WINDOW &amp; ADDRESS</th>
                  <th>DRIVER</th>
                  <th>STATUS</th>
                  <th>ETA &amp; FEE</th>
                  <th>UPDATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
                      No delivery jobs match filter "{adminFilter}".
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => {
                    const badge = STATUS_BADGES[job.status as DeliveryStatus];
                    const isSel = job.id === selectedJobId;
                    return (
                      <tr
                        key={job.id}
                        className={isSel ? "selected" : ""}
                        onClick={() => setSelectedJobId(job.id)}
                      >
                        <td><strong>{job.bookingRef}</strong></td>
                        <td>{job.vehicleName}</td>
                        <td>{job.renterContactMasked}</td>
                        <td>
                          <div>{job.deliveryWindow}</div>
                          <small style={{ color: "var(--muted)", fontSize: 10 }}>{job.deliveryAddress}</small>
                        </td>
                        <td>
                          {job.driver ? (
                            <span>{job.driver.name} ({job.driver.plateNumber})</span>
                          ) : (
                            <span style={{ color: "#991b1b", fontWeight: 700 }}>Unassigned</span>
                          )}
                        </td>
                        <td>
                          <span style={{ background: badge.bg, color: badge.color, padding: "2px 6px", borderRadius: 4, fontWeight: 800, fontSize: 10 }}>
                            {badge.label}
                          </span>
                        </td>
                        <td>
                          <div>GH₵{job.deliveryFeeGh}</div>
                          <small style={{ color: "var(--muted)" }}>{job.status === "handover_complete" ? "Handover ✓" : `${job.etaMinutes} mins`}</small>
                        </td>
                        <td style={{ color: "var(--muted)" }}>{job.lastUpdated}</td>
                        <td>
                          <button
                            className="inline-link"
                            style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", background: isSel ? "var(--forest)" : "#e2e8f0", color: isSel ? "#fff" : "#333", borderRadius: 4 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJobId(job.id);
                            }}
                          >
                            {isSel ? "Inspecting" : "Select"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* QUEUE VIEW: MOBILE CARDS */}
          <div className="mobile-cards-only" style={{ marginBottom: 16 }}>
            {filteredJobs.length === 0 ? (
              <div className="card text-center" style={{ padding: 20, color: "var(--muted)" }}>
                No delivery jobs match filter "{adminFilter}".
              </div>
            ) : (
              filteredJobs.map((job) => {
                const badge = STATUS_BADGES[job.status as DeliveryStatus];
                const isSel = job.id === selectedJobId;
                return (
                  <div
                    key={job.id}
                    className="card"
                    style={{
                      marginBottom: 10,
                      border: isSel ? "2px solid var(--forest)" : "1px solid var(--line)",
                      background: isSel ? "#f4fbf7" : "#fff",
                    }}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <strong style={{ fontSize: 11 }}>{job.bookingRef} • {job.vehicleName}</strong>
                      <span style={{ background: badge.bg, color: badge.color, padding: "2px 6px", borderRadius: 4, fontWeight: 800, fontSize: 10 }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>
                      Renter: {job.renterContactMasked}
                    </div>
                    <div style={{ fontSize: 11, marginBottom: 6 }}>
                      {job.deliveryAddress} ({job.deliveryWindow})
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, paddingTop: 6, borderTop: "1px dashed var(--line)" }}>
                      <span>Driver: {job.driver ? job.driver.name : "Unassigned"}</span>
                      <strong style={{ color: "var(--forest)" }}>GH₵{job.deliveryFeeGh}</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* SELECTED JOB DETAIL PANEL */}
          {activeJob && (
            <div className="card" style={{ border: "2px solid var(--forest)", borderRadius: 16, padding: 18, background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                <div>
                  <span className="tag" style={{ background: "var(--forest)", color: "#fff", marginBottom: 4 }}>ADMIN INSPECTOR</span>
                  <h3 style={{ margin: "4px 0 2px" }}>
                    Job Detail: {activeJob.bookingRef} ({activeJob.vehicleName})
                  </h3>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>
                    Renter: {activeJob.renterName} • Destination: {activeJob.deliveryAddress}
                  </p>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 800,
                    background: STATUS_BADGES[activeJob.status as DeliveryStatus].bg,
                    color: STATUS_BADGES[activeJob.status as DeliveryStatus].color,
                  }}
                >
                  ● {STATUS_BADGES[activeJob.status as DeliveryStatus].label}
                </span>
              </div>

              {/* 5-Step Delivery Stepper Timeline */}
              <div style={{ margin: "14px 0" }}>
                <small style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", display: "block" }}>
                  Delivery Progress Stepper
                </small>
                <div className="owner-timeline">
                  {["Pending", "Assigned", "En route", "Arrived", "Handover"].map((lbl, idx) => {
                    const isDone = activeStepIdx > idx || activeJob.status === "handover_complete";
                    const isActive = activeStepIdx === idx && activeJob.status !== "handover_complete";
                    return (
                      <div
                        key={lbl}
                        className={`owner-timeline-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                      >
                        <div className="dot">{isDone ? "✓" : idx + 1}</div>
                        <span>{lbl}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Static Delivery Map Placeholder */}
              <div style={{ margin: "14px 0" }}>
                <small style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 6 }}>
                  Telematics Delivery Map (Live Location Tracking)
                </small>
                <div
                  style={{
                    height: 120,
                    background: "#e5ece8",
                    borderRadius: 12,
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
                    <line x1="0" y1="40" x2="100%" y2="40" stroke="#0d4739" strokeWidth="4" />
                    <line x1="0" y1="80" x2="100%" y2="80" stroke="#0d4739" strokeWidth="3" />
                    <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#0d4739" strokeWidth="3" />
                    <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#0d4739" strokeWidth="3" />
                  </svg>
                  <div style={{ position: "absolute", top: "35%", left: "45%", display: "flex", alignItems: "center", gap: 4, background: "var(--forest)", color: "#fff", padding: "4px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                    <span>Driver: {activeJob.driver ? activeJob.driver.name : "Unassigned"}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(255,255,255,0.9)", padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 700, color: "var(--ink)" }}>
                    {activeJob.deliveryAddress}
                  </div>
                </div>
              </div>

              {/* Grid: Audit Trail + Support History */}
              <div className="owner-job-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="owner-job-info-box">
                  <label>Audit Log History</label>
                  {activeJob.auditTrail.map((log: { time: string; event: string; actor: string }, i: number) => (
                    <div key={i} className="audit-log-item">
                      <span className="audit-time">{log.time}</span>
                      <span>{log.event} <small style={{ color: "var(--muted)", display: "block" }}>by {log.actor}</small></span>
                    </div>
                  ))}
                </div>

                <div className="owner-job-info-box">
                  <label>Support &amp; Dispute Tickets</label>
                  {activeJob.supportHistory.length === 0 ? (
                    <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0" }}>No support disputes filed for this booking.</p>
                  ) : (
                    activeJob.supportHistory.map((t: { date: string; note: string; status: string }, i: number) => (
                      <div key={i} style={{ fontSize: 11, padding: "4px 0", borderBottom: "1px dashed var(--line)" }}>
                        <span style={{ fontWeight: 700 }}>{t.date}: {t.note}</span>
                        <small style={{ color: "var(--emerald)", display: "block", fontWeight: 700 }}>Status: {t.status}</small>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Admin Action Buttons */}
              <small style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", display: "block", margin: "14px 0 6px" }}>
                Admin Operations &amp; Overrides
              </small>
              <div className="owner-actions-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                <button
                  className="owner-action-btn primary"
                  onClick={() => {
                    if (activeJob.id === "job-1") {
                      const newDrv = deliveryDriver?.name === DEMO_DRIVER.name ? DEMO_ALT_DRIVER : DEMO_DRIVER;
                      setDeliveryDriver(newDrv);
                      if (deliveryStatus === "pending_assignment" || deliveryStatus === "no_driver_available") {
                        setDeliveryStatus("driver_assigned");
                      }
                      showToast(`Reassigned driver to ${newDrv.name} (${newDrv.plateNumber})`);
                    } else {
                      showToast("Driver reassigned for demo job!");
                    }
                  }}
                >
                  <Icon name="user" size={14} />
                  <span>Assign / Reassign Driver</span>
                </button>

                <button
                  className="owner-action-btn"
                  style={{ background: "#fef3c7", color: "#92400e" }}
                  onClick={() => {
                    if (activeJob.id === "job-1") setDeliveryStatus("delayed");
                    showToast("Marked delivery as DELAYED in Accra traffic");
                  }}
                >
                  <Icon name="clock" size={14} />
                  <span>Mark Delayed</span>
                </button>

                <button
                  className="owner-action-btn"
                  style={{ background: "#fee2e2", color: "#7f1d1d" }}
                  onClick={() => {
                    if (activeJob.id === "job-1") { setDeliveryStatus("cancelled"); setDeliveryDriver(null); }
                    showToast("Delivery job CANCELLED & vehicle returned to fleet");
                  }}
                >
                  <Icon name="x" size={14} />
                  <span>Cancel Delivery</span>
                </button>

                <button
                  className="owner-action-btn"
                  style={{ background: "#d1fae5", color: "#065f46" }}
                  onClick={() => {
                    if (activeJob.id === "job-1") {
                      setDeliveryStatus("en_route");
                      if (!deliveryDriver) setDeliveryDriver(DEMO_DRIVER);
                    }
                    showToast("Issue RESOLVED — delivery restored to EN ROUTE");
                  }}
                >
                  <Icon name="check" size={14} />
                  <span>Resolve Issue</span>
                </button>

                <button
                  className="owner-action-btn"
                  onClick={() => go("delivery-tracking")}
                >
                  <Icon name="map" size={14} />
                  <span>View Delivery Tracking</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </Page>
    );
  }

  // ─── inner component: DriverWorkspaceScreen ───────────────────────────────
  function DriverWorkspaceScreen() {
    const [driverTab, setDriverTab] = useState<"available" | "active" | "completed" | "exceptions">("active");
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (driverApprovalStatus !== "approved") {
      return (
        <Page nav="driver-workspace" go={go} role="driver">
          <Header title="Driver Verification Status" action={<button className="text-link" onClick={() => go("welcome")}>Sign Out</button>} />
          <section className="content-section" style={{ padding: 16 }}>
            <div className={`review-status-card ${driverApprovalStatus}`}>
              <div className="review-status-icon">
                <Icon name={driverApprovalStatus === "pending_approval" ? "clock" : "x"} size={28} />
              </div>
              <h2 style={{ margin: "6px 0" }}>
                {driverApprovalStatus === "pending_approval" ? "Driver Onboarding Pending Approval" : "Driver Account Suspended"}
              </h2>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0 16px" }}>
                {driverApprovalStatus === "pending_approval"
                  ? "Your Ghana commercial driving license, Accra road history, and background check are being reviewed by KasaRide Operations."
                  : "Your driver account is temporarily suspended pending investigation of a reported delivery delay or safety complaint."}
              </p>

              <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 12, textAlign: "left", fontSize: 11, marginBottom: 16 }}>
                <strong>DRIVER ONBOARDING FILE:</strong>
                <div style={{ margin: "4px 0" }}>• Driver Name: Kwesi Mensah</div>
                <div style={{ margin: "4px 0" }}>• Assigned Vehicle / Badge: GR-2847-21</div>
                <div style={{ margin: "4px 0" }}>• Region: Greater Accra (Airport, East Legon, Osu)</div>
                <div style={{ margin: "4px 0" }}>• DVLA Commercial License: Verified Class B</div>
              </div>

              <div style={{ background: "#edf6f2", padding: 12, borderRadius: 12, border: "1px dashed var(--forest)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--forest)", display: "block", marginBottom: 6 }}>
                  PROTOTYPE DEMO CONTROL:
                </span>
                <button
                  className="btn primary"
                  style={{ fontSize: 11, padding: "8px 14px" }}
                  onClick={() => {
                    setDriverApprovalStatus("approved");
                    showToast("Driver Approved! Driver workspace unlocked.");
                  }}
                >
                  Approve Driver Account &amp; Unlock Workspace
                </button>
              </div>
            </div>
          </section>
        </Page>
      );
    }

    const bookedCar = FLEET.find(c => c.id === bookingDraft.carId) || FLEET[0];
    const isDeliveryActive = bookingDraft.deliverySelected;

    const PICKUP_ITEMS = [
      `Exterior body & paint condition verified`,
      `Fuel level verified (Full tank)`,
      `4-angle inspection photos uploaded`,
      `Vehicle plate (${bookedCar.name} / GW 4821 - 22) & key fob matched`,
    ];

    const HANDOVER_ITEMS = [
      `Renter identity & Ghana Card verified`,
      `Pre-trip inspection walkthrough completed with renter`,
      `Vehicle keys & registration documents handed over`,
      `Digital handover signature & proof photo captured`,
    ];

    const isPickupComplete = pickupChecklist.length === PICKUP_ITEMS.length;
    const isHandoverComplete = handoverChecklist.length === HANDOVER_ITEMS.length;

    const handleTogglePickupItem = (idx: number) => {
      setPickupChecklist(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
    };

    const handleToggleHandoverItem = (idx: number) => {
      setHandoverChecklist(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
    };

    const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    };

    // Determine current step text
    const getDriverStepText = () => {
      if (deliveryStatus === "pending_assignment" || deliveryStatus === "no_driver_available") return "Awaiting Driver Acceptance";
      if (deliveryStatus === "driver_assigned") return "Phase 1: Vehicle Pickup & Inspection at Host Hub";
      if (deliveryStatus === "en_route") return "Phase 2: En Route to Renter Location";
      if (deliveryStatus === "arrived") return "Phase 3: Renter Handover & Walkthrough";
      if (deliveryStatus === "handover_complete") return "Delivery Completed — Rental Active!";
      if (deliveryStatus === "delayed") return "Delivery Delayed — Traffic Backup";
      if (deliveryStatus === "location_unavailable") return "Location Signal Lost";
      if (deliveryStatus === "cancelled") return "Job Cancelled";
      return "Active Delivery Job";
    };

    return (
      <Page nav="driver-workspace" go={go} role="driver">
        <Header
          title="Driver Workspace"
          action={
            <button className="icon-btn" onClick={handleRefresh} title="Refresh driver feed">
              <Icon name="clock" size={18} />
            </button>
          }
        />
        <section className="content-section" style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* Role Switch Bar */}
          <div className="role-switch-bar">
            <button
              className={`role-switch-btn ${appRole === "renter" ? "active" : ""}`}
              onClick={() => { setAppRole("renter"); go("home"); }}
            >
              Renter
            </button>
            <button
              className={`role-switch-btn ${appRole === "owner" ? "active" : ""}`}
              onClick={() => { setAppRole("owner"); setScreen("owner-deliveries"); }}
            >
              Host
            </button>
            <button
              className={`role-switch-btn ${appRole === "admin" ? "active" : ""}`}
              onClick={() => { setAppRole("admin"); setScreen("admin-deliveries"); }}
            >
              Admin
            </button>
            <button
              className={`role-switch-btn ${appRole === "driver" ? "active" : ""}`}
              onClick={() => { setAppRole("driver"); setScreen("driver-workspace"); }}
            >
              Driver
            </button>
          </div>

          {/* Driver Header Card */}
          <div className="card" style={{ background: "linear-gradient(135deg, #164e63 0%, #083344 100%)", color: "#fff", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="tag" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>ACCRA DISPATCH DRIVER</span>
                <h2 style={{ color: "#fff", margin: "6px 0 2px" }}>Kofi Mensah (GR-2847-21)</h2>
                <p style={{ fontSize: 11, opacity: 0.85 }}>
                  Rating: ★ 4.95 • 142 Deliveries • Stationed at Cantonments Hub
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#a7f3d0" }}>GH₵100</span>
                <small style={{ display: "block", fontSize: 9, opacity: 0.8 }}>Payout / Job</small>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="segment-control" style={{ marginBottom: 14 }}>
            <button className={driverTab === "available" ? "active" : ""} onClick={() => setDriverTab("available")}>
              Available {deliveryStatus === "pending_assignment" || deliveryStatus === "no_driver_available" ? "(1)" : "(0)"}
            </button>
            <button className={driverTab === "active" ? "active" : ""} onClick={() => setDriverTab("active")}>
              Active Delivery {deliveryStatus === "driver_assigned" || deliveryStatus === "en_route" || deliveryStatus === "arrived" ? "(1)" : "(0)"}
            </button>
            <button className={driverTab === "completed" ? "active" : ""} onClick={() => setDriverTab("completed")}>
              Completed {deliveryStatus === "handover_complete" ? "(1)" : "(0)"}
            </button>
            <button className={driverTab === "exceptions" ? "active" : ""} onClick={() => setDriverTab("exceptions")}>
              Exceptions {deliveryStatus === "delayed" || deliveryStatus === "location_unavailable" || deliveryStatus === "cancelled" ? "(1)" : "(0)"}
            </button>
          </div>

          {/* Loading Feed */}
          {isRefreshing && (
            <div className="card text-center" style={{ padding: 10, background: "#f0fdf4", color: "#166534", marginBottom: 12, fontSize: 11, fontWeight: 700 }}>
              ↻ Syncing Accra driver dispatch network &amp; GPS route telemetry...
            </div>
          )}

          {/* TAB 1: AVAILABLE JOBS */}
          {driverTab === "available" && (
            <div>
              {deliveryStatus === "pending_assignment" || deliveryStatus === "no_driver_available" ? (
                <div className="card" style={{ border: "2px solid var(--forest)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="tag" style={{ background: "#fef3c7", color: "#92400e" }}>DISPATCH OFFER</span>
                    <strong style={{ fontSize: 12 }}>REF: {bookingRef}</strong>
                  </div>

                  <h3 style={{ margin: "4px 0" }}>{bookedCar.name} ({bookedCar.modelYear})</h3>
                  <div style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 10px" }}>
                    <div><strong>Pickup:</strong> Cantonments Host Hub, Accra</div>
                    <div><strong>Drop-off:</strong> {bookingDraft.deliveryAddress || "Cantonments Rd, Accra"}</div>
                    <div><strong>Window:</strong> {bookingDraft.deliveryWindow}</div>
                  </div>

                  <div style={{ background: "#f0fdf4", padding: "8px 10px", borderRadius: 8, fontSize: 11, marginBottom: 12, color: "#166534", display: "flex", justifyContent: "space-between" }}>
                    <span>Estimated distance: 4.2 km</span>
                    <strong>Payout: GH₵100</strong>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      className="btn primary"
                      onClick={() => {
                        setDeliveryDriver(DEMO_DRIVER);
                        setDeliveryStatus("driver_assigned");
                        setDriverTab("active");
                        showToast("Job accepted! Proceeding to Cantonments Host Hub for pickup.");
                      }}
                    >
                      Accept Job (GH₵100)
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => {
                        setDeliveryStatus("no_driver_available");
                        setDeliveryDriver(null);
                        showToast("Job declined. Returned to Accra dispatch pool.");
                      }}
                    >
                      Decline Job
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card text-center" style={{ padding: 24, color: "var(--muted)" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Icon name="key" size={32} /></div>
                  <p style={{ fontSize: 12 }}>No unassigned delivery offers in your current Accra sector.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE DELIVERY */}
          {driverTab === "active" && (
            <div>
              {deliveryStatus === "driver_assigned" || deliveryStatus === "en_route" || deliveryStatus === "arrived" ? (
                <div className="card" style={{ border: "2px solid var(--forest)" }}>
                  {/* Status Banner */}
                  <div style={{ background: "var(--forest)", color: "#fff", padding: "8px 12px", borderRadius: "10px 10px 0 0", margin: "-16px -16px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 800 }}>{getDriverStepText()}</span>
                    <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: 4 }}>
                      REF: {bookingRef}
                    </span>
                  </div>

                  {/* Vehicle & Renter Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{bookedCar.name} ({bookedCar.modelYear})</h3>
                      <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0" }}>
                        Plate: GW 4821 - 22 • Cantonments Hub
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: 12, color: "#065f46" }}>Payout: GH₵100</strong>
                      <small style={{ display: "block", fontSize: 10, color: "var(--muted)" }}>Ama B. (+233 24 *** 7890)</small>
                    </div>
                  </div>

                  {/* Route Overview */}
                  <div className="owner-job-grid" style={{ gridTemplateColumns: "1fr 1fr", margin: "10px 0" }}>
                    <div className="owner-job-info-box">
                      <label>1. Vehicle Pickup Location</label>
                      <strong>Cantonments Host Hub</strong>
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>Contact: Host Nana Ama</span>
                    </div>
                    <div className="owner-job-info-box">
                      <label>2. Renter Drop-off Pin</label>
                      <strong>{bookingDraft.deliveryAddress || "Cantonments Rd, Accra"}</strong>
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>Window: {bookingDraft.deliveryWindow}</span>
                    </div>
                  </div>

                  {/* Communication & Support Actions */}
                  <div style={{ display: "flex", gap: 6, margin: "10px 0 14px" }}>
                    <button
                      className="inline-link"
                      style={{ fontSize: 11, padding: "5px 10px", background: "#edf3f0", borderRadius: 6, fontWeight: 700 }}
                      onClick={() => go("chat")}
                    >
                      Chat with Renter (In-App)
                    </button>
                    <button
                      className="inline-link"
                      style={{ fontSize: 11, padding: "5px 10px", background: "#edf3f0", borderRadius: 6, fontWeight: 700 }}
                      onClick={() => go("support")}
                    >
                      Contact Support
                    </button>
                  </div>

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* PHASE 1: PICKUP CHECKLIST (When driver_assigned) */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {deliveryStatus === "driver_assigned" && (
                    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <strong style={{ fontSize: 11, color: "var(--forest)" }}>
                          Mandatory Pickup Inspection Checklist ({pickupChecklist.length}/4)
                        </strong>
                        {isPickupComplete && <span style={{ fontSize: 10, color: "#065f46", fontWeight: 800 }}>✓ Verified</span>}
                      </div>

                      <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 8px" }}>
                        Inspect vehicle at Cantonments Host Hub. You must complete all 4 checklist items before starting delivery.
                      </p>

                      <div className="checklist-card">
                        {PICKUP_ITEMS.map((item, idx) => {
                          const isChecked = pickupChecklist.includes(idx);
                          return (
                            <div key={idx} className="checklist-item" onClick={() => handleTogglePickupItem(idx)}>
                              <div className={`checklist-checkbox ${isChecked ? "checked" : ""}`}>
                                {isChecked && "✓"}
                              </div>
                              <span style={{ textDecoration: isChecked ? "line-through" : "none", opacity: isChecked ? 0.7 : 1 }}>
                                {item}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        className="btn primary"
                        style={{ width: "100%", marginTop: 8 }}
                        disabled={!isPickupComplete}
                        onClick={() => {
                          setDeliveryStatus("en_route");
                          setDeliveryEta(12);
                          showToast("Vehicle collected! Delivery started, renter notified.");
                        }}
                      >
                        {isPickupComplete ? "Start Delivery (En Route to Renter)" : "Complete all 4 pickup checklist items to unlock Start Delivery"}
                      </button>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* PHASE 2: EN ROUTE (When en_route) */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {deliveryStatus === "en_route" && (
                    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <strong style={{ fontSize: 11, color: "var(--forest)" }}>
                          Live Navigation to Renter Destination
                        </strong>
                        <span style={{ fontSize: 10, background: "#dbeafe", color: "#1e40af", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>
                          ETA: {deliveryEta} mins
                        </span>
                      </div>

                      {/* Map Placeholder */}
                      <div
                        style={{
                          height: 110,
                          background: "#e5ece8",
                          borderRadius: 10,
                          position: "relative",
                          overflow: "hidden",
                          border: "1px solid var(--line)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 10,
                        }}
                      >
                        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
                          <line x1="0" y1="40" x2="100%" y2="40" stroke="#0d4739" strokeWidth="4" />
                          <line x1="0" y1="80" x2="100%" y2="80" stroke="#0d4739" strokeWidth="3" />
                        </svg>
                        <div style={{ background: "var(--forest)", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                          Driver En Route • {deliveryEta} mins to destination
                        </div>
                      </div>

                      <button
                        className="btn primary"
                        style={{ width: "100%", marginBottom: 8 }}
                        onClick={() => {
                          setDeliveryStatus("arrived");
                          showToast("Arrived at destination pin! Renter notified for handover.");
                        }}
                      >
                        Mark Arrived at Destination
                      </button>

                      {/* Exception Overrides */}
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <button
                          className="inline-link"
                          style={{ fontSize: 10, padding: "4px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 6 }}
                          onClick={() => { setDeliveryStatus("delayed"); showToast("Reported traffic delay"); }}
                        >
                          Report Traffic Delay
                        </button>
                        <button
                          className="inline-link"
                          style={{ fontSize: 10, padding: "4px 8px", background: "#fef3c7", color: "#92400e", borderRadius: 6 }}
                          onClick={() => { setDeliveryStatus("location_unavailable"); showToast("Reported GPS signal loss"); }}
                        >
                          Report Location Signal Loss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ───────────────────────────────────────────────────────── */}
                  {/* PHASE 3: HANDOVER CHECKLIST & PROOF OF DELIVERY (When arrived) */}
                  {/* ───────────────────────────────────────────────────────── */}
                  {deliveryStatus === "arrived" && (
                    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <strong style={{ fontSize: 11, color: "var(--forest)" }}>
                          Mandatory Renter Handover Checklist ({handoverChecklist.length}/4)
                        </strong>
                        {isHandoverComplete && <span style={{ fontSize: 10, color: "#065f46", fontWeight: 800 }}>✓ Verified</span>}
                      </div>

                      <p style={{ fontSize: 11, color: "var(--muted)", margin: "0 0 8px" }}>
                        Perform joint inspection walkthrough with renter Ama Bonsu at drop-off pin. Complete all 4 handover items.
                      </p>

                      <div className="checklist-card">
                        {HANDOVER_ITEMS.map((item, idx) => {
                          const isChecked = handoverChecklist.includes(idx);
                          return (
                            <div key={idx} className="checklist-item" onClick={() => handleToggleHandoverItem(idx)}>
                              <div className={`checklist-checkbox ${isChecked ? "checked" : ""}`}>
                                {isChecked && "✓"}
                              </div>
                              <span style={{ textDecoration: isChecked ? "line-through" : "none", opacity: isChecked ? 0.7 : 1 }}>
                                {item}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Proof of Delivery Card */}
                      <div className="proof-card">
                        <small style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "#065f46", display: "block", marginBottom: 4 }}>
                          Proof of Delivery Watermark
                        </small>
                        <div style={{ fontSize: 10, color: "var(--ink)" }}>
                          <div>Renter Signature: <strong>Ama Bonsu ✓ (Digitally Signed)</strong></div>
                          <div>Timestamp: <strong>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • 23 Sep 2026</strong></div>
                          <div>GPS Verification: <strong>5.5600° N, 0.1700° W (Cantonments Pin)</strong></div>
                        </div>
                      </div>

                      <button
                        className="btn primary"
                        style={{ width: "100%", marginTop: 8 }}
                        disabled={!isHandoverComplete}
                        onClick={() => {
                          setDeliveryStatus("handover_complete");
                          const newTrip: TripRecord = {
                            id: "tr-" + Date.now(),
                            carId: bookedCar.id,
                            pickupDate: bookingDraft.pickupDate,
                            returnDate: bookingDraft.returnDate,
                            pickupTime: bookingDraft.pickupTime,
                            returnTime: bookingDraft.returnTime,
                            totalAmount: 3 * bookedCar.pricePerDay + 100,
                            bookingRef: "KR-882910",
                            status: "active",
                            deliverySelected: true,
                            deliveryAddress: bookingDraft.deliveryAddress || "GH-054-9201, Cantonments Rd, Accra",
                          };
                          setTrips(prev => [newTrip, ...prev]);
                          showToast("Handover complete! Rental is now ACTIVE for renter Ama Bonsu.");
                        }}
                      >
                        {isHandoverComplete
                          ? "Complete Handover & Activate Rental"
                          : "Complete all 4 handover checklist items to finalize rental"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card text-center" style={{ padding: 24, color: "var(--muted)" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Icon name="check" size={32} /></div>
                  <p style={{ fontSize: 12 }}>No active delivery in progress.</p>
                  <button
                    className="inline-link"
                    style={{ fontSize: 11, marginTop: 8, color: "var(--forest)", fontWeight: 700 }}
                    onClick={() => setDriverTab("available")}
                  >
                    View available dispatch jobs →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMPLETED JOBS */}
          {driverTab === "completed" && (
            <div>
              {deliveryStatus === "handover_complete" ? (
                <div className="card" style={{ border: "1px solid var(--emerald)", background: "#f0fdf4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span className="tag" style={{ background: "#065f46", color: "#fff" }}>DELIVERY COMPLETED</span>
                    <strong style={{ fontSize: 11 }}>REF: {bookingRef}</strong>
                  </div>
                  <h3 style={{ margin: "4px 0" }}>{bookedCar.name} Handed Over Successfully</h3>
                  <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 10px" }}>
                    Renter: Ama Bonsu • Destination: {bookingDraft.deliveryAddress || "Cantonments Rd, Accra"}
                  </p>
                  <div style={{ background: "#fff", padding: "8px 10px", borderRadius: 8, fontSize: 11, display: "flex", justifyContent: "space-between" }}>
                    <span>Proof of delivery photo &amp; signature verified</span>
                    <strong style={{ color: "#065f46" }}>Earned GH₵100</strong>
                  </div>
                </div>
              ) : (
                <div className="card text-center" style={{ padding: 24, color: "var(--muted)" }}>
                  No completed deliveries in this session.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EXCEPTIONS */}
          {driverTab === "exceptions" && (
            <div>
              {deliveryStatus === "delayed" || deliveryStatus === "location_unavailable" || deliveryStatus === "cancelled" || deliveryStatus === "no_driver_available" ? (
                <div className="card" style={{ border: "1px solid #fecaca", background: "#fff5f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span className="tag" style={{ background: "#7f1d1d", color: "#fff" }}>EXCEPTIONAL STATE</span>
                    <strong style={{ fontSize: 11 }}>REF: {bookingRef}</strong>
                  </div>
                  <h3 style={{ margin: "4px 0" }}>
                    {deliveryStatus === "delayed"
                      ? "Delivery Delayed in Accra Traffic"
                      : deliveryStatus === "location_unavailable"
                      ? "GPS Telematics Location Signal Lost"
                      : deliveryStatus === "cancelled"
                      ? "Delivery Job Cancelled"
                      : "No Driver Assigned"}
                  </h3>
                  <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 10px" }}>
                    Vehicle: {bookedCar.name} • Destination: {bookingDraft.deliveryAddress || "Cantonments Rd, Accra"}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn primary"
                      style={{ fontSize: 11, padding: "6px 12px" }}
                      onClick={() => {
                        setDeliveryStatus("en_route");
                        if (!deliveryDriver) setDeliveryDriver(DEMO_DRIVER);
                        showToast("Resolved exception! Restored to En Route.");
                      }}
                    >
                      Resolve &amp; Resume Delivery
                    </button>
                    <button
                      className="btn secondary"
                      style={{ fontSize: 11, padding: "6px 12px" }}
                      onClick={() => go("support")}
                    >
                      Contact Dispatch Support
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card text-center" style={{ padding: 24, color: "var(--muted)" }}>
                  No delivery exceptions currently reported.
                </div>
              )}
            </div>
          )}
        </section>
      </Page>
    );
  }
}




