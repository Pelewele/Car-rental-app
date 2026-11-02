import { useState } from "react";
import type {
  Screen,
  Car,
  BookingDraft,
  TripRecord,
  SupportTicket,
  Message,
  DeliveryStatus,
  DeliveryDriver,
} from "./types";
import { FLEET } from "./data/fleet";
import { INSPECTION_ANGLES } from "./data/inspection";
import { Page } from "./components/layout/Page";
import { Header } from "./components/layout/Header";
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";
import { CarCard } from "./components/ui/CarCard";
import { Icon } from "./components/ui/Icon";
import { Logo } from "./components/ui/Logo";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { OtpScreen } from "./screens/OtpScreen";

const DEMO_DRIVER: DeliveryDriver = {
  name: "Kofi Mensah",
  initials: "KM",
  avatarBg: "#0d4739",
  rating: 4.95,
  plateNumber: "GR 2847 - 21",
  phone: "+233 24 *** 7890",
};

export default function RenterApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [toast, setToast] = useState<string | null>(null);

  // Search & Filter state
  const [searchLocation, setSearchLocation] = useState("Accra (Kotoka Airport / East Legon)");
  const [pickupDate, setPickupDate] = useState("2026-10-05");
  const [returnDate, setReturnDate] = useState("2026-10-08");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string>(FLEET[1].id);

  // Booking & Trips state
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({
    carId: FLEET[1].id,
    pickupDate: "2026-10-05",
    pickupTime: "10:00",
    returnDate: "2026-10-08",
    returnTime: "10:00",
    deliverySelected: true,
    deliveryAddress: "GH-054-9201, Cantonments Rd, Accra",
    deliveryWindow: "09:00 – 11:00",
  });
  const [bookingRef, setBookingRef] = useState<string>("KR-882910");
  const [trips, setTrips] = useState<TripRecord[]>([
    {
      id: "tr-1",
      carId: FLEET[1].id,
      pickupDate: "2026-10-05",
      pickupTime: "10:00",
      returnDate: "2026-10-08",
      returnTime: "10:00",
      deliverySelected: true,
      deliveryAddress: "GH-054-9201, Cantonments Rd, Accra",
      status: "upcoming",
      totalAmount: 2440,
      bookingRef: "KR-882910",
    },
  ]);
  const [tripTab, setTripTab] = useState<"upcoming" | "active" | "past">("upcoming");

  // Delivery Tracking state
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("en_route");
  const [deliveryDriver] = useState<DeliveryDriver | null>(DEMO_DRIVER);
  const [deliveryEta] = useState<number>(14);

  // Inspection state
  const [pickupInspections, setPickupInspections] = useState<string[]>([]);
  const [fuelLevelCaptured, setFuelLevelCaptured] = useState(false);
  const [inspectionAck, setInspectionAck] = useState(false);

  // Chat & Support state
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "host", text: "Hello Ama! Welcome to Accra. The BMW X3 is prepped for your delivery.", time: "09:30", read: true },
    { id: "m2", sender: "renter", text: "Thanks Kofi! Is the driver on the way to Cantonments?", time: "09:32", read: true },
    { id: "m3", sender: "host", text: "Yes! Driver Kofi Mensah is en route with plate GR 2847 - 21.", time: "09:35", read: true },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Payment Modal state
  const [showMomoModal, setShowMomoModal] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const go = (s: Screen) => {
    window.scrollTo(0, 0);
    setScreen(s);
  };

  const selectedCar = FLEET.find((c) => c.id === selectedCarId) || FLEET[1];

  const advanceDeliveryStatus = () => {
    const order: DeliveryStatus[] = [
      "pending_assignment",
      "driver_assigned",
      "en_route",
      "arrived",
      "handover_complete",
    ];
    const idx = order.indexOf(deliveryStatus);
    if (idx >= 0 && idx < order.length - 1) {
      setDeliveryStatus(order[idx + 1]);
      showToast(`Demo: Delivery status updated to ${order[idx + 1].replace("_", " ").toUpperCase()}`);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // SCREEN RENDERING
  // ───────────────────────────────────────────────────────────────────────────

  // 1. WELCOME
  if (screen === "welcome") {
    return <WelcomeScreen go={go} />;
  }

  // 2. OTP VERIFICATION
  if (screen === "otp") {
    return <OtpScreen go={go} showToast={showToast} />;
  }

  // 3. HOME / SEARCH
  if (screen === "home") {
    return (
      <Page nav="home" go={go}>
        <div className="home-hero">
          <Header action={<button className="icon-btn" onClick={() => go("profile")} aria-label="Profile"><Icon name="user" /></button>} />
          <div className="hero-copy">
            <p>ACCRA P2P CAR RENTAL</p>
            <h1>Drive Accra<br />on your terms.</h1>
          </div>
          <div className="search-panel">
            <label className="field">
              <span>Pick-up location</span>
              <div>
                <Icon name="pin" size={18} />
                <input
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Accra neighborhood or Airport"
                />
              </div>
            </label>

            <div className="field-row">
              <label className="field">
                <span>Pick-up date</span>
                <div>
                  <Icon name="calendar" size={16} />
                  <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                </div>
              </label>
              <label className="field">
                <span>Return date</span>
                <div>
                  <Icon name="calendar" size={16} />
                  <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                </div>
              </label>
            </div>

            <Button onClick={() => go("results")}>
              <Icon name="search" size={18} /> Search Cars
            </Button>
          </div>
        </div>

        <section className="content-section">
          <div className="section-head">
            <h2>Vehicle Categories</h2>
          </div>
          <div className="categories">
            {["Economy", "SUV", "Luxury", "Family"].map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat ? null : cat);
                  go("results");
                }}
              >
                <strong>{cat}</strong>
                <small>Explore {cat.toLowerCase()}</small>
              </button>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: 24 }}>
            <h2>Featured Accra Fleet</h2>
            <button onClick={() => go("results")}>View all</button>
          </div>
          <div className="card-scroller">
            {FLEET.slice(0, 4).map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onClick={() => {
                  setSelectedCarId(car.id);
                  go("detail");
                }}
              />
            ))}
          </div>
        </section>
      </Page>
    );
  }

  // 4. RESULTS
  if (screen === "results") {
    const filteredFleet = FLEET.filter((car) => {
      if (selectedCategory && car.type !== selectedCategory) return false;
      if (selectedNeighborhood && car.neighborhood !== selectedNeighborhood) return false;
      return true;
    });

    return (
      <Page nav="results" go={go}>
        <Header title="Available Cars in Accra" back={() => go("home")} />
        <div className="results-search">
          <Icon name="pin" size={16} />
          <span>
            <strong>{searchLocation}</strong>
            <small>{pickupDate} – {returnDate}</small>
          </span>
          <button className="inline-link" onClick={() => go("home")}>Change</button>
        </div>

        <div className="filter-row">
          {["All Neighborhoods", "East Legon", "Airport Residential", "Cantonments", "Osu", "Dzorwulu", "Labone"].map((nh) => {
            const isAll = nh === "All Neighborhoods";
            const isActive = isAll ? selectedNeighborhood === null : selectedNeighborhood === nh;
            return (
              <button
                key={nh}
                className={isActive ? "active" : ""}
                onClick={() => setSelectedNeighborhood(isAll ? null : nh)}
              >
                {nh}
              </button>
            );
          })}
        </div>

        <section className="results-body">
          <div className="results-list">
            {filteredFleet.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                horizontal
                onClick={() => {
                  setSelectedCarId(car.id);
                  go("detail");
                }}
              />
            ))}
          </div>
        </section>
      </Page>
    );
  }

  // 5. DETAIL
  if (screen === "detail") {
    return (
      <Page className="plain-page">
        <Header back={() => go("results")} action={<button className="icon-btn" onClick={() => showToast("Saved to favorites")}><Icon name="heart" /></button>} />
        <div className="gallery">
          <img src={selectedCar.images[0]} alt={selectedCar.name} />
          <span className="gallery-count">1 of {selectedCar.images.length} photos</span>
        </div>

        <main className="detail-main">
          <div className="title-price">
            <div>
              <h1>{selectedCar.name} ({selectedCar.modelYear})</h1>
              <p><Icon name="pin" size={14} /> {selectedCar.neighborhood}, Accra • {selectedCar.distanceKm} km away</p>
            </div>
            <div>
              <strong>GH₵{selectedCar.pricePerDay}</strong>
              <small>/ day</small>
            </div>
          </div>

          <div className="badge-row">
            <Badge>Verified Host Fleet</Badge>
            <Badge gold>Instant Booking</Badge>
          </div>

          <div className="spec-grid">
            <div><strong>{selectedCar.transmission}</strong><small>Transmission</small></div>
            <div><strong>{selectedCar.fuel}</strong><small>Fuel</small></div>
            <div><strong>{selectedCar.seats} seats</strong><small>Capacity</small></div>
            <div><strong>{selectedCar.doors} doors</strong><small>Body</small></div>
          </div>

          <div className="detail-section">
            <h2>About this vehicle</h2>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)" }}>{selectedCar.description}</p>
          </div>

          <div className="detail-section">
            <h2>Vehicle Host</h2>
            <div className="host">
              <div className="host-avatar" style={{ background: selectedCar.host.avatarBg }}>
                {selectedCar.host.initials}
              </div>
              <div>
                <h3>{selectedCar.host.name}</h3>
                <p>Rating ★ {selectedCar.host.rating} • {selectedCar.host.trips} trips</p>
                <small>{selectedCar.host.joined} • Response rate: {selectedCar.host.responseRate}</small>
              </div>
              <button className="inline-link" onClick={() => go("chat")}>Contact</button>
            </div>
          </div>

          <div className="detail-section">
            <h2>Delivery Options</h2>
            <div className="info-row">
              <div>
                <strong>Accra Doorstep Delivery (GH₵100)</strong>
                <small>Driver delivers to Airport, East Legon, Cantonments, or hotel</small>
              </div>
              <Badge gold>Available</Badge>
            </div>
          </div>
        </main>

        <div className="sticky-reserve">
          <div>
            <small>Total for 3 days</small>
            <strong>GH₵{selectedCar.pricePerDay * 3 + 100}</strong>
          </div>
          <Button onClick={() => {
            setBookingDraft(prev => ({ ...prev, carId: selectedCar.id }));
            go("verify");
          }}>
            Book Now
          </Button>
        </div>
      </Page>
    );
  }

  // 6. VERIFY IDENTIFICATION
  if (screen === "verify") {
    return (
      <Page className="plain-page">
        <Header title="Identity Verification" back={() => go("detail")} />
        <section className="form-page">
          <div className="auth-icon">
            <Icon name="shield" size={28} />
          </div>
          <h1>Verify your driving license</h1>
          <p>KasaRide requires Ghana Card &amp; driver license verification for peer-to-peer rentals in Ghana.</p>

          <div className="upload-list">
            <div className="upload done">
              <span><Icon name="check" size={20} /></span>
              <div>
                <strong>Ghana Card (National ID)</strong>
                <small>Verified: GHA-72910481-9</small>
              </div>
            </div>
            <div className="upload done">
              <span><Icon name="check" size={20} /></span>
              <div>
                <strong>Ghana Driver License (Class B)</strong>
                <small>Verified: DL-99201-2024</small>
              </div>
            </div>
          </div>

          <div className="notice">
            <Icon name="shield" />
            <div>
              <strong>Instant verification active</strong>
              <p>Your documents pass automated DVLA &amp; NIA compliance checks in Ghana.</p>
            </div>
          </div>

          <Button onClick={() => go("checkout")}>
            Proceed to Checkout
          </Button>
        </section>
      </Page>
    );
  }

  // 7. CHECKOUT & PAYMENT
  if (screen === "checkout") {
    const totalDays = 3;
    const rentalFee = selectedCar.pricePerDay * totalDays;
    const deliveryFee = bookingDraft.deliverySelected ? 100 : 0;
    const totalCost = rentalFee + deliveryFee + selectedCar.depositGh;

    const handleConfirmBooking = () => {
      setShowMomoModal(true);
      setTimeout(() => {
        setShowMomoModal(false);
        const ref = "KR-" + Math.floor(100000 + Math.random() * 900000);
        setBookingRef(ref);
        setDeliveryStatus("en_route");
        go("confirmed");
      }, 1500);
    };

    return (
      <Page className="plain-page">
        <Header title="Review & Pay" back={() => go("verify")} />
        <section className="checkout form-page">
          <div className="booking-car">
            <img src={selectedCar.images[0]} alt={selectedCar.name} />
            <div>
              <small>{selectedCar.type} • {selectedCar.neighborhood}</small>
              <strong>{selectedCar.name} ({selectedCar.modelYear})</strong>
              <span style={{ fontSize: 11, color: "var(--emerald)", fontWeight: 700 }}>Host: {selectedCar.host.name}</span>
            </div>
          </div>

          <section>
            <h2>Delivery &amp; Pickup Choice</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                className={`pay-option ${bookingDraft.deliverySelected ? "active" : ""}`}
                onClick={() => setBookingDraft(prev => ({ ...prev, deliverySelected: true }))}
              >
                <div className="pay-icon"><Icon name="pin" size={18} /></div>
                <span>
                  <strong>Accra Doorstep Delivery (GH₵100)</strong>
                  <small>Driver delivers vehicle to your location in Accra</small>
                </span>
                <i />
              </button>

              <button
                className={`pay-option ${!bookingDraft.deliverySelected ? "active" : ""}`}
                onClick={() => setBookingDraft(prev => ({ ...prev, deliverySelected: false }))}
              >
                <div className="pay-icon"><Icon name="home" size={18} /></div>
                <span>
                  <strong>Self Pick-Up at Host Hub (Free)</strong>
                  <small>Pick up directly at {selectedCar.neighborhood} host hub</small>
                </span>
                <i />
              </button>
            </div>

            {bookingDraft.deliverySelected && (
              <div style={{ marginTop: 12 }}>
                <label className="field">
                  <span>Delivery Address in Accra</span>
                  <div>
                    <Icon name="pin" size={16} />
                    <input
                      value={bookingDraft.deliveryAddress}
                      onChange={(e) => setBookingDraft(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      placeholder="e.g. Cantonments Rd, East Legon, or Airport"
                    />
                  </div>
                </label>
              </div>
            )}
          </section>

          <section>
            <h2>Payment Method</h2>
            <div className="pay-option active">
              <div className="pay-icon">MoMo</div>
              <span>
                <strong>MTN Mobile Money / Telecel Cash</strong>
                <small>Instant prompt sent to +233 24 456 7890</small>
              </span>
              <i />
            </div>
          </section>

          <section>
            <h2>Price Summary</h2>
            <div className="fee-row">
              <span>Rental ({totalDays} days × GH₵{selectedCar.pricePerDay})</span>
              <strong>GH₵{rentalFee}</strong>
            </div>
            {bookingDraft.deliverySelected && (
              <div className="fee-row">
                <span>Accra Doorstep Delivery</span>
                <strong>GH₵100</strong>
              </div>
            )}
            <div className="fee-row">
              <span>Refundable Security Deposit</span>
              <strong>GH₵{selectedCar.depositGh}</strong>
            </div>
            <div className="fee-row total">
              <strong>Total Payable</strong>
              <strong style={{ color: "var(--forest)" }}>GH₵{totalCost}</strong>
            </div>
          </section>

          <Button onClick={handleConfirmBooking}>
            Pay GH₵{totalCost} via Mobile Money
          </Button>
        </section>

        {showMomoModal && (
          <div className="momo-modal-overlay">
            <div className="momo-modal">
              <div className="spinner" />
              <h3>Processing MoMo Payment</h3>
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0" }}>
                Simulating Ghana Mobile Money PIN prompt on +233 24 456 7890…
              </p>
            </div>
          </div>
        )}
      </Page>
    );
  }

  // 8. CONFIRMED
  if (screen === "confirmed") {
    return (
      <Page className="confirmed plain-page">
        <section className="confirmation">
          <div className="success-ring">
            <Icon name="check" size={32} />
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your vehicle reservation is active. Host {selectedCar.host.name} has been notified.</p>

          <div className="reference">
            <div>
              <small>BOOKING REFERENCE</small>
              <strong>{bookingRef}</strong>
            </div>
            <button onClick={() => showToast("Reference code copied!")}>Copy</button>
          </div>

          <div className="confirm-card">
            <img src={selectedCar.images[0]} alt={selectedCar.name} />
            <div>
              <strong>{selectedCar.name} ({selectedCar.modelYear})</strong>
              <span>Pickup: {bookingDraft.pickupDate} • 10:00</span>
              <span>Location: {bookingDraft.deliverySelected ? bookingDraft.deliveryAddress : selectedCar.neighborhood}</span>
            </div>
          </div>

          <div className="action-grid">
            <button onClick={() => go("delivery-tracking")}>
              <Icon name="map" size={20} />
              <strong>Track Delivery</strong>
              <small>View live driver progress</small>
            </button>
            <button onClick={() => go("trips")}>
              <Icon name="trips" size={20} />
              <strong>My Trips</strong>
              <small>View booking details</small>
            </button>
          </div>
        </section>
      </Page>
    );
  }

  // 9. TRIPS
  if (screen === "trips") {
    return (
      <Page nav="trips" go={go}>
        <Header title="My Rental Trips" action={<button className="icon-btn" onClick={() => go("support")}><Icon name="phone" /></button>} />
        <section className="content-section trips-page">
          <div className="tabs">
            <button className={tripTab === "upcoming" ? "active" : ""} onClick={() => setTripTab("upcoming")}>Upcoming (1)</button>
            <button className={tripTab === "active" ? "active" : ""} onClick={() => setTripTab("active")}>Active (0)</button>
            <button className={tripTab === "past" ? "active" : ""} onClick={() => setTripTab("past")}>Past (0)</button>
          </div>

          {tripTab === "upcoming" && (
            <div className="active-card">
              <div className="active-image">
                <img src={selectedCar.images[0]} alt={selectedCar.name} />
                <span>CONFIRMED BOOKING</span>
              </div>
              <div className="active-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <small style={{ fontWeight: 800, color: "var(--muted)", fontSize: 10 }}>REF: {bookingRef}</small>
                  <Badge gold>Delivery Requested</Badge>
                </div>
                <h2>{selectedCar.name} ({selectedCar.modelYear})</h2>
                <p>Host: {selectedCar.host.name} • Cantonments, Accra</p>

                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0", padding: "8px 10px", borderRadius: 8, background: "#edf6f3" }}>
                  <Icon name="home" size={18} />
                  <div style={{ fontSize: 11 }}>
                    <strong>Delivery Status: Driver En Route</strong>
                    <span style={{ display: "block", color: "var(--muted)", fontSize: 10 }}>ETA ~{deliveryEta} mins to {bookingDraft.deliveryAddress}</span>
                  </div>
                </div>

                <div className="trip-actions">
                  <Button variant="primary" onClick={() => go("delivery-tracking")}>
                    Track Delivery
                  </Button>
                  <Button variant="secondary" onClick={() => go("inspection")}>
                    Vehicle Inspection
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tripTab !== "upcoming" && (
            <div className="empty-state">
              <div className="empty-state-icon"><Icon name="trips" size={24} /></div>
              <h3>No {tripTab} trips found</h3>
              <p>You have no {tripTab} rentals in Greater Accra.</p>
              <Button onClick={() => go("home")}>Explore Fleet</Button>
            </div>
          )}
        </section>
      </Page>
    );
  }

  // 10. DELIVERY TRACKING
  if (screen === "delivery-tracking") {
    return (
      <Page className="plain-page">
        <Header title="Delivery Tracking" back={() => go("trips")} action={<button className="text-link" onClick={() => go("support")}>Support</button>} />
        
        {/* Map Placeholder */}
        <div style={{ position: "relative", height: 220, background: "#1a2e1a", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
            <line x1="30%" y1="20%" x2="50%" y2="80%" stroke="#34d399" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Driver Marker */}
          <div style={{ position: "absolute", top: "25%", left: "32%", transform: "translate(-50%, -50%)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2563eb", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Icon name="home" size={18} />
            </div>
            {deliveryDriver && (
              <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", background: "#1e40af", color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 800 }}>
                {deliveryDriver.plateNumber}
              </div>
            )}
          </div>

          {/* You Pin */}
          <div style={{ position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#10b981", border: "3px solid #fff" }} />
            <div style={{ background: "#064e3b", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 4, padding: "2px 6px", marginTop: 4 }}>YOU</div>
          </div>
        </div>

        <section style={{ padding: "0 16px 100px" }}>
          <div style={{ background: "#edf6f3", borderRadius: 12, padding: "12px 14px", margin: "14px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="clock" size={20} />
            <div>
              <strong style={{ fontSize: 13, color: "var(--forest)", display: "block" }}>Driver En Route to Renter Location</strong>
              <span style={{ fontSize: 11, color: "var(--forest)", fontWeight: 700 }}>ETA: ~{deliveryEta} min</span>
            </div>
          </div>

          {deliveryDriver && (
            <div style={{ border: "1.5px solid var(--line)", borderRadius: 14, padding: "14px 16px", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: deliveryDriver.avatarBg, color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {deliveryDriver.initials}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14 }}>{deliveryDriver.name}</strong>
                <div style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0" }}>
                  {deliveryDriver.plateNumber} • ★ {deliveryDriver.rating}
                </div>
                <Badge>Verified KasaRide Driver</Badge>
              </div>
              <button className="icon-btn" onClick={() => go("chat")} style={{ background: "#edf6f3" }}>
                <Icon name="chat" size={18} />
              </button>
            </div>
          )}

          {deliveryStatus === "arrived" && (
            <div style={{ margin: "0 0 16px", background: "#d1fae5", borderRadius: 14, padding: "16px" }}>
              <strong style={{ fontSize: 14, color: "#065f46", display: "block", marginBottom: 6 }}>
                Driver is at your location
              </strong>
              <p style={{ fontSize: 12, color: "#047857", margin: "0 0 12px" }}>
                Confirm you have received the keys and inspected the vehicle with the driver.
              </p>
              <Button onClick={() => {
                setDeliveryStatus("handover_complete");
                showToast("Handover complete! Rental is now active.");
                go("trips");
              }}>
                Confirm handover — activate rental
              </Button>
            </div>
          )}

          <div style={{ background: "#f8f9f8", borderRadius: 12, padding: "14px 16px", border: "1px dashed var(--line)", marginTop: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, display: "block", marginBottom: 8 }}>Renter Prototype Simulation Control:</span>
            <button className="inline-link" style={{ fontSize: 11, padding: "5px 10px", background: "#edf6f3", borderRadius: 6 }} onClick={advanceDeliveryStatus}>
              Advance delivery status
            </button>
          </div>
        </section>
      </Page>
    );
  }

  // 11. INSPECTION
  if (screen === "inspection") {
    const handleToggleAngle = (angle: string) => {
      if (pickupInspections.includes(angle)) {
        setPickupInspections(pickupInspections.filter((a) => a !== angle));
      } else {
        setPickupInspections([...pickupInspections, angle]);
        showToast(`${angle} photo recorded`);
      }
    };

    return (
      <Page className="plain-page">
        <Header title="Pre-trip Inspection" back={() => go("trips")} />
        <section className="form-page">
          <h1>Record Vehicle Condition</h1>
          <p>Tap each angle to simulate taking pre-trip inspection photos before driving.</p>

          <div className="inspection-grid">
            {INSPECTION_ANGLES.map((angle) => {
              const isCaptured = pickupInspections.includes(angle);
              return (
                <button
                  key={angle}
                  className={isCaptured ? "done" : ""}
                  onClick={() => handleToggleAngle(angle)}
                >
                  <div>
                    <Icon name="camera" size={24} />
                  </div>
                  <strong>{angle}</strong>
                  <small>{isCaptured ? "Captured ✓" : "Required — tap to capture"}</small>
                </button>
              );
            })}
          </div>

          <div className="notice">
            <Icon name="shield" />
            <div>
              <strong>Pre-trip Inspection Status</strong>
              <p>{pickupInspections.length} of 8 photos recorded. Completing photo inspection protects your deposit.</p>
            </div>
          </div>

          <Button disabled={pickupInspections.length < 8} onClick={() => { showToast("Inspection checklist saved!"); go("trips"); }}>
            Submit Pre-trip Inspection ({pickupInspections.length}/8)
          </Button>
        </section>
      </Page>
    );
  }

  // 12. CHAT
  if (screen === "chat") {
    const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      const newMsg: Message = {
        id: "m-" + Date.now(),
        sender: "renter",
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      setMessages([...messages, newMsg]);
      setChatInput("");
    };

    return (
      <Page className="plain-page chat-page">
        <Header title="Messages" back={() => go("home")} />
        <div className="chat-context">
          <img src={selectedCar.images[0]} alt={selectedCar.name} />
          <span>
            <strong>{selectedCar.host.name} (Host)</strong>
            <small>Booking Ref: {bookingRef}</small>
          </span>
        </div>

        <main className="messages">
          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.sender === "renter" ? "me" : "host"}`}>
              {m.text}
              <small>{m.time}</small>
            </div>
          ))}
        </main>

        <div className="composer">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Write message to host..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className="send" onClick={handleSendMessage}>
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </Page>
    );
  }

  // 13. SUPPORT
  if (screen === "support") {
    return (
      <Page className="plain-page">
        <Header title="KasaRide Support" back={() => go("home")} />
        <section className="form-page">
          <div className="auth-icon">
            <Icon name="phone" size={28} />
          </div>
          <h1>How can we help?</h1>
          <p>KasaRide Support is active 24/7 across Greater Accra.</p>

          <div className="option-list">
            <button onClick={() => showToast("Emergency helpline: +233 30 200 0000")}>
              <span>Call Emergency Helpline (+233 30 200 0000)</span>
              <Icon name="chevron" size={16} />
            </button>
            <button onClick={() => go("dispute")}>
              <span>File a Damage or Delivery Dispute</span>
              <Icon name="chevron" size={16} />
            </button>
            <button onClick={() => showToast("FAQ: Insurance covers comprehensive damage in Ghana.")}>
              <span>Insurance &amp; Deposit Policy FAQ</span>
              <Icon name="chevron" size={16} />
            </button>
          </div>
        </section>
      </Page>
    );
  }

  // 14. DISPUTE
  if (screen === "dispute") {
    return (
      <Page className="plain-page">
        <Header title="Report an Issue" back={() => go("support")} />
        <section className="form-page">
          <h1>File a Dispute</h1>
          <p>Report vehicle defects, delivery delays, or billing discrepancies.</p>

          <label className="field" style={{ marginBottom: 12 }}>
            <span>Booking Reference</span>
            <div>
              <input value={bookingRef} readOnly />
            </div>
          </label>

          <label className="field" style={{ marginBottom: 16 }}>
            <span>Describe the issue</span>
            <textarea placeholder="Provide details about the issue..." />
          </label>

          <Button onClick={() => { showToast("Dispute ticket filed successfully!"); go("home"); }}>
            Submit Dispute Ticket
          </Button>
        </section>
      </Page>
    );
  }

  // 15. PROFILE
  if (screen === "profile") {
    return (
      <Page nav="profile" go={go}>
        <Header title="Renter Profile" />
        <section className="content-section profile-page">
          <div className="profile-head">
            <div className="profile-avatar">AB</div>
            <div>
              <h1>Ama Bonsu</h1>
              <p>+233 24 456 7890 • Accra Renter</p>
              <Badge>Verified Driver</Badge>
            </div>
          </div>

          <div className="status-card">
            <div>
              <Icon name="shield" size={20} />
              <div>
                <strong>Ghana Card &amp; License Verified</strong>
                <small>NIA ID: GHA-72910481-9</small>
              </div>
            </div>
            <span>VERIFIED</span>
          </div>

          <h2>Account Settings</h2>
          <div className="option-list">
            <button onClick={() => showToast("Personal details updated")}>
              <span>Personal Information</span>
              <Icon name="chevron" size={16} />
            </button>
            <button onClick={() => showToast("Payment methods: MTN MoMo linked")}>
              <span>Payment Methods (MTN MoMo)</span>
              <Icon name="chevron" size={16} />
            </button>
            <button onClick={() => go("support")}>
              <span>Support &amp; Help Center</span>
              <Icon name="chevron" size={16} />
            </button>
          </div>

          <button className="signout" onClick={() => go("welcome")}>
            Sign Out
          </button>
        </section>
      </Page>
    );
  }

  // Toast renderer
  return (
    <>
      {toast && (
        <div className="toast">
          <Icon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
