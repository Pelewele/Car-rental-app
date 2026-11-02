import { useState } from "react";
import type { Screen } from "../types";
import { FLEET } from "../data/fleet";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Logo";
import { Icon } from "../components/ui/Icon";

interface WelcomeScreenProps {
  go: (s: Screen) => void;
}

export function WelcomeScreen({ go }: WelcomeScreenProps) {
  const [credential, setCredential] = useState("+233 24 456 7890");

  const handleSignIn = () => {
    go("home");
  };

  return (
    <div className="welcome">
      <div className="welcome-art">
        <img src={FLEET[1].images[0]} alt="BMW X3 parked in Airport Residential, Accra" />
        <div className="welcome-shade" />
        <div className="welcome-brand">
          <Logo inverse />
          <span className="demo-pill">RENTER APP</span>
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
          Enter your phone number to sign in to your Renter account:
        </p>

        <label className="field">
          <span>Ghana mobile number or email</span>
          <div>
            <Icon name="phone" size={18} />
            <input
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="+233 24 000 0000"
            />
          </div>
        </label>

        <Button onClick={handleSignIn}>
          Sign in as Renter
        </Button>
        <small style={{ marginTop: 10, display: "block" }}>
          By continuing, you acknowledge that this is a local Ghana peer-to-peer car rental prototype.
        </small>
      </div>
    </div>
  );
}
