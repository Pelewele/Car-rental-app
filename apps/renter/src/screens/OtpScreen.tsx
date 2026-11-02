import type { Screen } from "../types";
import { Page } from "../components/layout/Page";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

interface OtpScreenProps {
  go: (s: Screen) => void;
  showToast: (msg: string) => void;
}

export function OtpScreen({ go, showToast }: OtpScreenProps) {
  return (
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
          {"Didn't receive it? "}<button className="inline-link" onClick={() => showToast("Demo code resent: 284196")}>Resend demo code</button>
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
  );
}
