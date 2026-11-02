import { useState } from "react";
import type { Screen } from "../types";
import { FLEET } from "../data/fleet";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";
import { Icon } from "../components/ui/Icon";

interface WelcomeScreenProps {
  go: (s: Screen) => void;
  onSelectRole?: (role: "renter" | "owner" | "admin" | "driver") => void;
}

export function WelcomeScreen({ go, onSelectRole }: WelcomeScreenProps) {
  const [selectedRole, setSelectedRole] = useState<"renter" | "owner" | "admin" | "driver">("renter");
  const [credential, setCredential] = useState("+233 24 456 7890");

  const handleSignIn = (role: "renter" | "owner" | "admin" | "driver") => {
    if (onSelectRole) onSelectRole(role);
    if (role === "renter") go("home");
    else if (role === "owner") go("owner-deliveries");
    else if (role === "driver") go("driver-workspace");
    else go("admin-deliveries");
  };

  return (
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
      <div className="welcome-panel">
        <h2>Sign in to KasaRide</h2>
        <p style={{ fontSize: 11, color: "var(--muted)", margin: "-6px 0 10px" }}>
          Select your demo workspace account type to continue:
        </p>

        <div className="role-selector-grid">
          <button
            type="button"
            className={`role-card-item ${selectedRole === "renter" ? "selected" : ""}`}
            onClick={() => { setSelectedRole("renter"); setCredential("+233 24 456 7890"); }}
          >
            <div className="role-card-icon"><Icon name="home" size={22} /></div>
            <span className="role-card-title">Renter</span>
            <span className="role-card-desc">Book cars &amp; track deliveries</span>
          </button>

          <button
            type="button"
            className={`role-card-item ${selectedRole === "owner" ? "selected" : ""}`}
            onClick={() => { setSelectedRole("owner"); setCredential("+233 20 890 1234"); }}
          >
            <div className="role-card-icon"><Icon name="key" size={22} /></div>
            <span className="role-card-title">Vehicle Owner</span>
            <span className="role-card-desc">List fleet &amp; delivery jobs</span>
          </button>

          <button
            type="button"
            className={`role-card-item ${selectedRole === "driver" ? "selected" : ""}`}
            onClick={() => { setSelectedRole("driver"); setCredential("+233 27 654 3210"); }}
          >
            <div className="role-card-icon"><Icon name="map" size={22} /></div>
            <span className="role-card-title">Delivery Driver</span>
            <span className="role-card-desc">Accept jobs &amp; handovers</span>
          </button>

          <button
            type="button"
            className={`role-card-item ${selectedRole === "admin" ? "selected" : ""}`}
            onClick={() => { setSelectedRole("admin"); setCredential("dispatch@kasaride.gh"); }}
          >
            <div className="role-card-icon"><Icon name="shield" size={22} /></div>
            <span className="role-card-title">Admin Dispatch</span>
            <span className="role-card-desc">System dispatch console</span>
          </button>
        </div>

        <label className="field">
          <span>{selectedRole === "admin" ? "Staff Email" : "Ghana mobile number or email"}</span>
          <div>
            <Icon name={selectedRole === "admin" ? "shield" : "phone"} size={18} />
            <input
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="+233 24 000 0000"
            />
          </div>
        </label>

        <Button onClick={() => handleSignIn(selectedRole)}>
          Sign in as {selectedRole === "renter" ? "Renter" : selectedRole === "owner" ? "Vehicle Owner" : selectedRole === "driver" ? "Delivery Driver" : "Admin Dispatcher"}
        </Button>
        <small style={{ marginTop: 10, display: "block" }}>
          By continuing, you acknowledge that this is a local Ghana peer-to-peer car rental prototype.
        </small>
      </div>
    </div>
  );
}
