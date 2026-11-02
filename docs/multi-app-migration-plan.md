# KasaRide Multi-App Monorepo Migration Plan

> **NOTICE**: This document is a strategic architecture and migration specification only. No code, configuration, or files in the existing working prototype will be modified, moved, or deleted as part of generating this plan.

---

## Executive Summary

KasaRide is currently structured as a monolithic React + Vite prototype containing four distinct user personas and operational roles in a single frontend bundle:
1. **Renter**: Car discovery, reservation, identity verification, payment, trip management, vehicle inspection, and live delivery tracking.
2. **Vehicle Owner (Host)**: Fleet management, host approval compliance, delivery job oversight, status overrides, and host support.
3. **Delivery Driver**: Driver onboarding/verification, dispatch job offer acceptance, 4-step pickup checklist, live destination navigation, and 4-step renter handover with proof of delivery.
4. **Admin Dispatch & Operations**: Central fleet logistics monitor, real-time telematics dashboard, KPI analytics, dispatch driver reassignment, error simulation, and dispute resolution.

This migration plan defines a safe, phased transition to a modern **pnpm Monorepo** architecture separating the single codebase into four dedicated web applications while maintaining a single shared design system, central domain types, and local demo data state.

---

## Monorepo Architecture & Directory Structure

```
c:\Users\USER\Desktop\Car rental app\
├── apps/
│   ├── renter/                  # Renter Web Application (Port 3000)
│   │   ├── src/
│   │   │   ├── components/      # Renter-specific UI modules
│   │   │   ├── screens/         # Renter screens (Search, Detail, Checkout, Trips...)
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── owner/                   # Vehicle Owner / Host Web Application (Port 3001)
│   │   ├── src/
│   │   │   ├── screens/         # Host Approval Status, Vehicle Delivery Jobs
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── driver/                  # Delivery Driver Web Application (Port 3002)
│   │   ├── src/
│   │   │   ├── screens/         # Driver Verification Status, Driver Workspace
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── admin/                   # Admin Dispatch & Operations Dashboard (Port 3003)
│       ├── src/
│       │   ├── screens/         # Admin Dispatch Monitor, Telematics Inspector
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
│
├── packages/
│   ├── ui/                      # Shared UI Design System & Component Library
│   │   ├── src/
│   │   │   ├── components/      # Button, Badge, CarCard, Icon, Logo, Header, Page, BottomNav
│   │   │   ├── styles/          # Global index.css, Tailwind CSS v4 theme variables
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── types/                   # Shared TypeScript Domain Types & Interfaces
│   │   ├── src/
│   │   │   └── index.ts         # Car, Host, BookingDraft, TripRecord, DeliveryJob, etc.
│   │   └── package.json
│   │
│   └── demo-data/               # Shared Mock Data & Local State Management
│       ├── src/
│       │   ├── fleet.ts         # FLEET array, DEMO_HOST, DEMO_DRIVER definitions
│       │   ├── inspection.ts    # Vehicle photo checklists, angle definitions
│       │   ├── store.ts         # Centralized demo reactive store / BroadcastChannel sync
│       │   └── index.ts
│       └── package.json
│
├── docs/
│   └── multi-app-migration-plan.md  # This migration document
│
├── pnpm-workspace.yaml          # Monorepo workspace configuration
├── package.json                 # Root monorepo scripts & dependencies
└── vite.config.ts               # Standalone legacy backup configuration
```

---

## App Specifications & Boundaries

### 1. `apps/renter` (Renter Web App)

- **Target Persona**: Vehicle renters in Greater Accra.
- **Screen Inventory**:
  - `WelcomeScreen`: Landing screen, value proposition, identity verification callout.
  - `OtpScreen`: Phone number entry and SMS OTP verification.
  - `HomeScreen`: Vehicle search, location picker, rental dates, fuel/transmission filter pills, popular Accra neighborhoods, featured fleet cards.
  - `ResultsScreen`: Filtered car listings grid with neighborhood filter tabs and daily rates.
  - `DetailScreen`: Detailed vehicle specs, host info, trip policies, delivery add-on option (`GH₵100`), price breakdown, and booking trigger.
  - `VerifyScreen`: License & Ghana Card verification workflow.
  - `CheckoutScreen`: Delivery vs. Self-Pickup selection, delivery address entry, mobile money / payment method selection.
  - `ConfirmedScreen`: Booking confirmation summary, booking reference code, delivery status overview link.
  - `TripsScreen`: Active, upcoming, and past rental trips list with status indicators.
  - `DeliveryTrackingScreen`: Interactive live delivery map placeholder, driver ETA banner, driver contact buttons, progress timeline, and renter handover confirmation button.
  - `InspectionScreen`: Interactive 8-angle vehicle damage/condition photo recorder, fuel level selector, and pre-trip inspection acknowledgement.
  - `ReturnScreen`: Post-trip vehicle return inspection, photo upload, and mileage check.
  - `ReviewScreen`: Star rating and written feedback submission for host & vehicle.
  - `ChatScreen`: In-app messaging with vehicle host or assigned driver.
  - `SupportScreen`: FAQ accordion, ticket submission, and KasaRide support phone callout.
  - `DisputeScreen`: Dispute filing screen for damage or delivery issues.
  - `ProfileScreen`: User profile details, document status badges, rental history summary.
- **Role-Specific Navigation**:
  - Bottom Navigation Bar with 4 tabs: `Explore` (Home), `Trips`, `Messages` (Chat), `Profile`.
- **Data Read/Written**:
  - *Reads*: `FLEET`, car details, host profiles, delivery tracking status, active trip records.
  - *Writes*: `bookingDraft`, renter profile details, inspection photos, support tickets, dispute logs, review ratings.
- **Shared Package Dependencies**:
  - `@kasaride/ui`: `Page`, `Header`, `BottomNav`, `Button`, `Badge`, `CarCard`, `Icon`, `Logo`.
  - `@kasaride/types`: `Car`, `BookingDraft`, `TripRecord`, `SupportTicket`, `Message`.
  - `@kasaride/demo-data`: `FLEET`, demo trip records.

---

### 2. `apps/owner` (Host / Vehicle Owner App)

- **Target Persona**: Vehicle hosts listing cars on KasaRide in Accra.
- **Screen Inventory**:
  - `HostApprovalScreen`: Pending compliance review status card, host application file summary, and demo approval override button.
  - `OwnerDeliveryJobsScreen`: Accra Delivery Operations dashboard with filter tabs (`All`, `Active`, `Exceptions`, `Completed`), active job counter, delivery exception alerts, 5-step delivery timeline, vehicle availability status badge (`Vehicle Available` / `Vehicle Unavailable`), host action buttons (`View Delivery`, `Chat with Partner`, `Contact Support`, `Report Issue`), and host demo status override controls.
  - `DeliveryTrackingScreen` (Host View): Host view of live driver delivery progress to renter.
  - `HostChatScreen`: Direct communication with renter or assigned delivery driver.
  - `HostSupportScreen`: Host compliance, insurance coverage, and payout support tickets.
- **Role-Specific Navigation**:
  - Navigation Tabs: `Jobs` (Deliveries), `Fleet` (Vehicles), `Earnings`, `Support`.
- **Data Read/Written**:
  - *Reads*: Host assigned fleet (`FLEET`), active renter bookings, delivery status (`deliveryStatus`), driver details.
  - *Writes*: `ownerApprovalStatus` (`pending_review` | `approved` | `rejected`), delivery status overrides (`pending_assignment`, `delayed`, `cancelled`, etc.), vehicle availability status.
- **Shared Package Dependencies**:
  - `@kasaride/ui`: `Page`, `Header`, `Button`, `Badge`, `Icon`, `Logo`.
  - `@kasaride/types`: `Car`, `Host`, `DeliveryStatus`, `TripRecord`.
  - `@kasaride/demo-data`: `FLEET`, `DEMO_HOST`.

---

### 3. `apps/driver` (Delivery Driver App)

- **Target Persona**: KasaRide Accra dispatch and delivery drivers.
- **Screen Inventory**:
  - `DriverVerificationScreen`: Driver onboarding pending approval card, DVLA commercial license file summary, demo approval override button.
  - `DriverWorkspaceScreen`:
    - *Header Card*: Driver profile, station hub (Cantonments), rating (`★ 4.95`), per-job payout (`GH₵100`).
    - *Tabs*: `Available Offers`, `Active Delivery`, `Completed`, `Exceptions`.
    - *Phase 1 (Pickup)*: Mandatory 4-item pickup inspection checklist (body condition, fuel level, 4-angle photos, plate & key matched).
    - *Phase 2 (En Route)*: Live destination navigation map placeholder, ETA countdown, "Mark Arrived" action, delay/signal loss report buttons.
    - *Phase 3 (Handover)*: Mandatory 4-item renter handover checklist (renter ID, walkthrough, key handover, signature capture), digital proof of delivery watermark with GPS coordinates.
  - `DriverChatScreen`: In-app chat with renter or dispatch operations.
  - `DriverSupportScreen`: Emergency road assistance & dispatch helpline.
- **Role-Specific Navigation**:
  - Navigation Tabs: `Workspace` (Jobs), `Earnings`, `History`, `Support`.
- **Data Read/Written**:
  - *Reads*: Assigned delivery jobs, pickup date/time, delivery address, renter contact details, checklist status.
  - *Writes*: `driverApprovalStatus`, job acceptance (`deliveryDriver`), `pickupChecklist`, `handoverChecklist`, `deliveryStatus` transition steps (`driver_assigned` → `en_route` → `arrived` → `handover_complete`), proof of delivery signature & timestamp.
- **Shared Package Dependencies**:
  - `@kasaride/ui`: `Page`, `Header`, `Button`, `Badge`, `Icon`.
  - `@kasaride/types`: `DeliveryStatus`, `DeliveryDriver`, `Car`.
  - `@kasaride/demo-data`: `DEMO_DRIVER`, `DEMO_ALT_DRIVER`.

---

### 4. `apps/admin` (Central Dispatch & Operations App)

- **Target Persona**: KasaRide logistics operations team & dispatch admins.
- **Screen Inventory**:
  - `AdminDispatchDashboard`:
    - *KPI Cards Grid*: Total Jobs, Active, Attention Required, Completed, Total Revenue (`GH₵`).
    - *Filter Bar*: `All`, `Unassigned`, `Active`, `Delayed`, `No Driver`, `No Signal`, `Cancelled`, `Completed`.
    - *Queue View (Desktop Table & Mobile Cards)*: Booking Ref, Vehicle Name, Plate Number, Masked Renter Contact, Delivery Window, Assigned Driver, Delivery Fee, Status Badge, Last Updated.
    - *Job Inspector Panel*: Complete job breakdown, 5-step progress stepper, live map telematics tracker, audit log history, support dispute tickets.
    - *Admin Operations & Overrides*: Reassign driver, mark delayed in traffic, cancel delivery & return vehicle to fleet, resolve issue & restore route, simulate network error mode.
- **Role-Specific Navigation**:
  - Sidebar Navigation: `Dispatch Monitor`, `Fleet Inventory`, `Driver Management`, `Financials`, `System Telematics`.
- **Data Read/Written**:
  - *Reads*: All system delivery jobs, telematics signals, driver locations, host statuses, audit logs.
  - *Writes*: `selectedJobId`, `adminFilter`, `simulateError` flag, driver reassignment overrides, manual delivery status mutations (`delayed`, `cancelled`, `en_route`, `handover_complete`).
- **Shared Package Dependencies**:
  - `@kasaride/ui`: `Page`, `Header`, `Button`, `Badge`, `Icon`, `Logo`.
  - `@kasaride/types`: `DeliveryJob`, `DeliveryStatus`, `SupportTicket`.
  - `@kasaride/demo-data`: `DEMO_JOBS_LIST`, `FLEET`.

---

## Phased Migration Strategy

To guarantee zero downtime or breakage of the current prototype, the migration is structured into **5 sequential phases**. The existing `src/App.tsx` monolith will remain untouched as a fallback until all individual apps are verified.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASED MIGRATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘
  Phase 0: Monorepo Foundation & Shared Packages Setup
    │
    ▼
  Phase 1: Extract & Validate Renter App (`apps/renter`)
    │
    ▼
  Phase 2: Extract & Validate Host App (`apps/owner`)
    │
    ▼
  Phase 3: Extract & Validate Driver App (`apps/driver`)
    │
    ▼
  Phase 4: Extract & Validate Admin App (`apps/admin`)
    │
    ▼
  Phase 5: Inter-App State Sync (BroadcastChannel) & Verification
```

---

### Phase 0: Workspace Setup & Package Extraction

1. **Initialize Monorepo Configuration**:
   Create `pnpm-workspace.yaml` in project root:
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```

2. **Create Shared `packages/types`**:
   - Extract domain definitions from `src/types/index.ts` to `packages/types/src/index.ts`.
   - Export standard types: `Car`, `Host`, `BookingDraft`, `TripRecord`, `DeliveryStatus`, `SupportTicket`, `Message`, `DeliveryDriver`, `DeliveryJob`.

3. **Create Shared `packages/demo-data`**:
   - Move mock datasets from `src/data/fleet.ts` and `src/data/inspection.ts` into `packages/demo-data/src/`.
   - Implement a shared reactive store helper using `window.localStorage` and `BroadcastChannel("kasaride_demo_sync")` so all running apps synchronize state changes in real time.

4. **Create Shared `packages/ui`**:
   - Move UI components from `src/components/ui/` (`Button`, `Badge`, `CarCard`, `Icon`, `Logo`) and `src/components/layout/` (`Page`, `Header`, `BottomNav`) into `packages/ui/src/`.
   - Move global styling tokens from `src/index.css` into `packages/ui/src/styles/index.css`.

---

### Phase 1: Build & Verify `apps/renter`

1. Create directory `apps/renter` initialized with Vite + React + TypeScript.
2. Link dependencies in `apps/renter/package.json`:
   ```json
   {
     "name": "@kasaride/renter",
     "private": true,
     "dependencies": {
       "@kasaride/ui": "workspace:*",
       "@kasaride/types": "workspace:*",
       "@kasaride/demo-data": "workspace:*",
       "react": "^19.0.0",
       "react-dom": "^19.0.0"
     }
   }
   ```
3. Copy renter-specific screens from `src/screens/` and `src/App.tsx`.
4. Configure local dev server on port `3000`.
5. Perform standalone verification of renter search, booking, checkout, and trip tracking workflows.

---

### Phase 2: Build & Verify `apps/owner`

1. Create directory `apps/owner` initialized with Vite + React + TypeScript.
2. Link workspace packages (`@kasaride/ui`, `@kasaride/types`, `@kasaride/demo-data`).
3. Migrate `OwnerDeliveryJobsScreen` and host approval flow into `apps/owner`.
4. Configure local dev server on port `3001`.
5. Perform standalone verification of host approval compliance, delivery job queue filtering, status overrides, and fleet availability indicators.

---

### Phase 3: Build & Verify `apps/driver`

1. Create directory `apps/driver` initialized with Vite + React + TypeScript.
2. Link workspace packages (`@kasaride/ui`, `@kasaride/types`, `@kasaride/demo-data`).
3. Migrate `DriverWorkspaceScreen` and driver onboarding verification flow into `apps/driver`.
4. Configure local dev server on port `3002`.
5. Perform standalone verification of driver offer acceptance, 4-step pickup checklist, en route navigation, 4-step handover checklist, and digital signature proof of delivery.

---

### Phase 4: Build & Verify `apps/admin`

1. Create directory `apps/admin` initialized with Vite + React + TypeScript.
2. Link workspace packages (`@kasaride/ui`, `@kasaride/types`, `@kasaride/demo-data`).
3. Migrate `AdminDispatchDashboardScreen` into `apps/admin`.
4. Configure local dev server on port `3003`.
5. Perform standalone verification of dispatch queue filtering, desktop table view, mobile card queue, telematics error simulation, driver reassignment, and job inspection.

---

### Phase 5: Cross-App State Synchronization & Final Audit

1. **BroadcastChannel Demo State Sync**:
   Configure `@kasaride/demo-data` store to listen on `BroadcastChannel("kasaride_demo_sync")`.
   When the driver app advances status to `arrived` or completes handover, a broadcast message notifies the renter app (`DeliveryTrackingScreen`), host app (`OwnerDeliveryJobsScreen`), and admin app (`AdminDispatchDashboard`) to update their UI reactively without page reloads.
2. **Regression Testing**:
   Run full end-to-end verification across all 4 ports simultaneously.

---

## Local Development Commands & Monorepo Tooling

### Package Manager
Use **pnpm** (version 9+) with Node.js 22.

### Root `package.json` Commands

```json
{
  "name": "kasaride-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"./apps/*\" dev",
    "dev:renter": "pnpm --filter @kasaride/renter dev",
    "dev:owner": "pnpm --filter @kasaride/owner dev",
    "dev:driver": "pnpm --filter @kasaride/driver dev",
    "dev:admin": "pnpm --filter @kasaride/admin dev",
    "build": "pnpm --recursive run build",
    "build:renter": "pnpm --filter @kasaride/renter build",
    "build:owner": "pnpm --filter @kasaride/owner build",
    "build:driver": "pnpm --filter @kasaride/driver build",
    "build:admin": "pnpm --filter @kasaride/admin build",
    "typecheck": "pnpm --recursive run typecheck",
    "lint": "oxfmt --check src apps packages"
  }
}
```

### Local Dev Port Allocation
- `http://localhost:3000` -> **Renter App** (`apps/renter`)
- `http://localhost:3001` -> **Vehicle Owner App** (`apps/owner`)
- `http://localhost:3002` -> **Delivery Driver App** (`apps/driver`)
- `http://localhost:3003` -> **Admin Dispatch App** (`apps/admin`)

---

## Build & Shared Component Strategy

### 1. Build Strategy
- **Bundler**: Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite` in each app.
- **CSS Architecture**: Tailwind CSS v4 configured via `@import 'tailwindcss';` in `@kasaride/ui/src/styles/index.css`.
- **Theme Tokens**: Forest green (`#0d4739`), Emerald (`#10b981`), Gold (`#d97706`), Cream (`#f8faf8`), and Neutral (`#1e293b`) tokens defined centrally in `@kasaride/ui`.

### 2. Component Design & Decoupling Rules
- **Pure Presentation**: Components in `@kasaride/ui` (`Button`, `Badge`, `CarCard`, `Icon`, `Logo`) must remain pure presentation components accepting props, with no internal router dependencies.
- **Layout Containers**: `Page` and `Header` components accept navigation callback handlers (`go: (screen: string) => void`) or React Nodes for action buttons, allowing each app to plug in its own router (e.g. standard React state navigation or React Router v7).

---

## Future Backend & API Boundaries

When transitioning from the local demo state to a production cloud backend (e.g. Node.js/Express, Go, or Firebase), the monorepo architecture establishes clean boundaries:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND APPS                                    │
│   apps/renter     apps/owner        apps/driver       apps/admin            │
└──────┬─────────────────┬─────────────────┬─────────────────┬────────────────┘
       │                 │                 │                 │
       └─────────────────┼─────────────────┼─────────────────┘
                         ▼                 ▼
          ┌────────────────────────────────────────────────┐
          │     @kasaride/api-client (Shared SDK)         │
          │  - Auth Interceptors (JWT Bearer tokens)       │
          │  - REST API & WebSocket Telematics Client      │
          └──────────────────────┬─────────────────────────┘
                                 │
                                 ▼
          ┌────────────────────────────────────────────────┐
          │          KasaRide Backend Services             │
          │  - Auth Service (OTP / OAuth2 Role Gating)    │
          │  - Fleet & Booking Service                     │
          │  - Dispatch & Telematics Engine                │
          └────────────────────────────────────────────────┘
```

### API Endpoint Mapping:
- **Auth Service**: `/api/v1/auth/otp/send`, `/api/v1/auth/otp/verify`, `/api/v1/auth/me`
- **Fleet Service**: `/api/v1/cars`, `/api/v1/cars/:id`, `/api/v1/hosts/:id/fleet`
- **Booking Service**: `/api/v1/bookings`, `/api/v1/trips`, `/api/v1/inspections`
- **Dispatch & Telematics**: `/api/v1/dispatch/jobs`, `/api/v1/dispatch/telematics/stream` (WebSocket)

---

## Verification & Audit Checklist

Before declaring the migration complete in any phase, execute the following audit steps:

- [ ] **Type Integrity**: Run `pnpm typecheck` across all apps and packages; verify zero TypeScript errors.
- [ ] **Build Validation**: Run `pnpm build` across all apps; verify clean Vite bundle output.
- [ ] **Renter Flow Verification**:
  - [ ] Search fleet in Accra, select dates, view car details.
  - [ ] Add delivery option (`GH₵100`), complete verification & checkout.
  - [ ] Track delivery progress & complete handover walkthrough.
- [ ] **Owner Flow Verification**:
  - [ ] Verify host approval status gating card and prototype override button.
  - [ ] Filter delivery jobs by status (`All`, `Active`, `Exceptions`, `Completed`).
  - [ ] Test status override controls and verify vehicle availability badge updates.
- [ ] **Driver Flow Verification**:
  - [ ] Verify driver onboarding status gating card.
  - [ ] Accept delivery offer in Cantonments sector.
  - [ ] Complete 4-item pickup inspection checklist to unlock "Start Delivery".
  - [ ] Complete 4-item renter handover checklist to generate digital proof of delivery.
- [ ] **Admin Flow Verification**:
  - [ ] Check KPI counter cards and revenue sum calculations.
  - [ ] Inspect delivery queue in desktop table view and mobile card view.
  - [ ] Test telematics error mode toggle and driver reassignment controls.
- [ ] **State Synchronization**:
  - [ ] Open Renter app, Host app, Driver app, and Admin app in separate browser tabs.
  - [ ] Advance delivery state in Driver app and verify instant UI updates across Renter, Host, and Admin screens.

---
*Document generated on 2026-09-29. Ready for phased monorepo execution when authorized.*
