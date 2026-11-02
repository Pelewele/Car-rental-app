# KasaRide Vehicle Delivery System — Production Backend Architecture Plan

> **DISCLAIMER & NOTICE**: This document represents a technical architecture and design specification for a future production backend. It describes the backend requirements, data models, state machines, API surfaces, and integration interfaces necessary to convert the current local-demo prototype into a scalable production platform. **No third-party APIs, real-time GPS connections, or external backend services are currently integrated into the existing prototype codebase.**

---

## 1. User Roles & RBAC (Role-Based Access Control)

The backend enforces strict Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) across four primary user personas:

| Role | Core Responsibilities | Key Data & API Scopes |
| :--- | :--- | :--- |
| **Renter** | Books vehicles, selects delivery option, tracks driver location, completes inspection, communicates via masked chat. | `delivery:read_assigned`, `location:subscribe`, `chat:read_write`, `support:create` |
| **Owner** | Lists vehicles, approves bookings, handovers vehicle to driver, monitors delivery jobs for listed fleet. | `delivery:read_owned_fleet`, `checklist:read_pickup`, `support:create` |
| **Delivery Driver** | Accepts jobs, updates status, completes pickup checklist, navigates, records proof of delivery (POD), completes handover checklist. | `delivery:read_available`, `delivery:accept_decline`, `checklist:write`, `pod:upload`, `location:publish` |
| **Admin / Dispatcher** | Monitors system-wide queue, manually assigns/reassigns drivers, resolves disputes, overrides state transitions, inspects audit logs. | `delivery:*`, `driver:assign`, `state:override`, `audit:read`, `privacy:unmask_contact` (audited) |

---

## 2. Core Data Domain & Entity Schemas

### 2.1 Entities & Relational Schema Summary

1. **`DeliveryJob`**
   - `id`: UUID (Primary Key)
   - `booking_id`: Foreign Key (`Booking`)
   - `renter_id`: Foreign Key (`User`)
   - `owner_id`: Foreign Key (`User`)
   - `driver_id`: Nullable Foreign Key (`User`)
   - `status`: Enum (`pending_assignment`, `driver_assigned`, `en_route`, `arrived`, `handover_complete`, `no_driver_available`, `delayed`, `location_unavailable`, `cancelled`)
   - `pickup_address`, `pickup_lat_lng`: GeoJSON / Geometry
   - `delivery_address`, `delivery_lat_lng`: GeoJSON / Geometry
   - `delivery_window_start`, `delivery_window_end`: Timestamp
   - `delivery_fee_ghc`: Decimal(10, 2)
   - `created_at`, `updated_at`: Timestamp

2. **`DriverAssignment`**
   - `id`: UUID
   - `job_id`: Foreign Key (`DeliveryJob`)
   - `driver_id`: Foreign Key (`User`)
   - `status`: Enum (`offered`, `accepted`, `declined`, `unassigned`, `reassigned`)
   - `offered_at`, `responded_at`: Timestamp

3. **`DeliveryStatusHistory`**
   - `id`: UUID
   - `job_id`: Foreign Key (`DeliveryJob`)
   - `previous_status`, `new_status`: Enum
   - `actor_id`: Foreign Key (`User`)
   - `actor_role`: Enum
   - `reason`: String (Optional)
   - `timestamp`: Timestamp

4. **`ChecklistSubmission`**
   - `id`: UUID
   - `job_id`: Foreign Key (`DeliveryJob`)
   - `type`: Enum (`pickup`, `handover`)
   - `submitted_by`: Foreign Key (`User`)
   - `items`: JSONB (`[ { item_key: string, checked: boolean, notes: string } ]`)
   - `signature_url`: String (Encrypted Object Storage URI)
   - `completed_at`: Timestamp

5. **`ProofOfDelivery` (POD)**
   - `id`: UUID
   - `job_id`: Foreign Key (`DeliveryJob`)
   - `photo_urls`: Array of Strings (Object Storage URIs)
   - `lat_lng_watermark`: Geometry Point
   - `odometer_reading`: Integer
   - `fuel_level_percent`: Integer
   - `captured_at`: Timestamp

6. **`SupportTicket & Dispute`**
   - `id`: UUID
   - `job_id`: Foreign Key (`DeliveryJob`)
   - `reporter_id`: Foreign Key (`User`)
   - `category`: Enum (`delay`, `vehicle_damage`, `location_unavailable`, `no_show`, `handover_dispute`)
   - `status`: Enum (`open`, `under_review`, `resolved`, `escalated`)
   - `resolution_notes`: String

---

## 3. Booking & Delivery State Machine

### 3.1 Allowed State Transitions

```
[ pending_assignment ] ──(Driver Accepts / Admin Assigns)──> [ driver_assigned ]
        │                                                           │
   (No Driver)                                              (Driver Handoff Start)
        ▼                                                           ▼
[ no_driver_available ]                                        [ en_route ]
        │                                                           │
   (Reassigned)                                              (Driver Arrives)
        └───────────────────────────┐                               │
                                    ▼                               ▼
                              [ driver_assigned ]             [ arrived ]
                                                                    │
                                                           (Handover Completed)
                                                                    ▼
                                                          [ handover_complete ]
                                                                    │
                                                            (Activates Trip)
                                                                    ▼
                                                            [ Renter Rental ACTIVE ]
```

### 3.2 Exception & Terminal States
- **`delayed`**: Can be flagged from `driver_assigned` or `en_route` when estimated arrival exceeds window limit.
- **`location_unavailable`**: Flagged from `en_route` or `arrived` if destination cannot be reached.
- **`cancelled`**: Transitionable from `pending_assignment`, `driver_assigned`, or `en_route` (requires admin/system authorization).

### 3.3 Strict Transition Rules & Admin Overrides
- **Pickup Gate**: `en_route` state transition **requires** a validated `ChecklistSubmission` of type `pickup` with all items marked `checked: true`.
- **Handover Gate**: `handover_complete` state transition **requires** a validated `ChecklistSubmission` of type `handover` AND at least 1 valid `ProofOfDelivery` photo upload.
- **Rental Auto-Activation**: Successful entry into `handover_complete` atomically updates the linked `Booking.status` to `ACTIVE`.
- **Admin Override**: Admin accounts possess `FORCE_TRANSITION` capability, requiring a mandatory `audit_reason` string that is permanently logged to `DeliveryStatusHistory`.

---

## 4. Privacy, Security & Data Protection

1. **Consent-Based Live Location Tracking**:
   - Location streaming from the driver device is strictly opt-in and bound to active delivery windows (`driver_assigned` through `handover_complete`).
   - Location broadcasts automatically terminate upon entering `handover_complete` or `cancelled`.
2. **Location Data Retention & Ephemerality**:
   - High-frequency GPS telemetry streams (breadcrumbs) are retained for 30 days for safety auditing before automated deletion.
   - Only static, anonymised start/end points and final POD watermarks are stored permanently.
3. **Masked Contact & Relay System**:
   - Direct phone numbers are never exposed between Renter, Host, or Driver.
   - Communications route through a Telephony Relay (WebRTC / Proxy VoIP) or in-app encrypted WebSocket messaging using temporary session tokens.
4. **Audit Logging**:
   - Immutable write-only audit trail captures all status changes, admin interventions, contact unmasking requests, and checklist submissions.
5. **Restricted Access to Verification Artifacts**:
   - Identity verification documents, driver's licenses, and signatures are encrypted at rest (AES-256) and accessible strictly by authorized risk/compliance admins.

---

## 5. API Outline & Real-Time Events

### 5.1 REST / GraphQL API Endpoints

#### Driver Workspace
- `GET /api/v1/driver/jobs?status={tab}` — List assigned, available, completed, or exception jobs.
- `POST /api/v1/driver/jobs/:jobId/accept` — Accept an offered job.
- `POST /api/v1/driver/jobs/:jobId/decline` — Decline an offered job.
- `POST /api/v1/driver/jobs/:jobId/pickup-checklist` — Submit vehicle pickup checklist.
- `POST /api/v1/driver/jobs/:jobId/start-delivery` — Transition job to `en_route`.
- `POST /api/v1/driver/jobs/:jobId/mark-arrived` — Transition job to `arrived`.
- `POST /api/v1/driver/jobs/:jobId/handover-checklist` — Submit handover checklist & POD.
- `POST /api/v1/driver/jobs/:jobId/complete` — Finalize handover and activate rental.
- `POST /api/v1/driver/jobs/:jobId/report-issue` — Report delay, location unavailable, or cancellation.

#### Admin Dispatch & Fleet Operations
- `GET /api/v1/admin/deliveries/queue` — Query all delivery jobs with filters.
- `POST /api/v1/admin/deliveries/:jobId/assign-driver` — Assign or reassign driver.
- `POST /api/v1/admin/deliveries/:jobId/override-status` — Admin force status update.

### 5.2 Real-Time Event Architecture (WebSocket / Server-Sent Events)

- **Channel**: `delivery:job:{job_id}`
- **Subscribed Clients**: Renter client, Owner workspace, Admin console, Driver app.
- **Event Catalog**:
  - `delivery.status_changed` (`{ jobId, status, driverName, etaMinutes, timestamp }`)
  - `delivery.location_updated` (`{ jobId, lat, lng, heading, speed, timestamp }`)
  - `delivery.checklist_completed` (`{ jobId, type, completedAt }`)
  - `delivery.exception_raised` (`{ jobId, type, reason }`)

---

## 6. Integration Adapter Interfaces (Pluggable Design)

To maintain vendor independence, all third-party services are wrapped behind loose, configurable adapter interfaces:

```typescript
// Maps & Routing Adapter
interface IMapRoutingAdapter {
  calculateEta(origin: LatLng, destination: LatLng): Promise<EtaResult>;
  generateStaticMapUrl(origin: LatLng, destination: LatLng): string;
}

// Payment & Settlement Adapter
interface IPaymentAdapter {
  authorizeDeliveryFee(renterId: string, amountGhc: number): Promise<PaymentAuthToken>;
  releaseDriverPayout(driverId: string, amountGhc: number): Promise<PayoutReceipt>;
}

// Communication & Relay Adapter
interface ICommunicationAdapter {
  createMaskedSession(partyA: string, partyB: string): Promise<MaskedChannelInfo>;
  sendPushNotification(userId: string, payload: NotificationPayload): Promise<void>;
}

// Object Storage Adapter (Proof of Delivery & Signatures)
interface IStorageAdapter {
  uploadFile(buffer: Buffer, path: string, acl: 'private' | 'public-read'): Promise<StorageUri>;
  getPresignedUrl(uri: StorageUri, expiresSeconds: number): Promise<string>;
}

// Identity & License Verification Adapter
interface IVerificationAdapter {
  verifyDriverLicense(licenseNumber: string, userDob: string): Promise<VerificationResult>;
}
```

---

## 7. Resiliency & Failure Mode Handling

| Failure Scenario | Backend Detection / Trigger | Automatic & Manual Mitigation Strategy |
| :--- | :--- | :--- |
| **No Driver Available** | Timer expires on `pending_assignment` (e.g. 15 mins before window). | Triggers system alert in Admin Dispatch queue; triggers optional host pick-up fallback prompt to renter; logs `no_driver_available`. |
| **Delivery Delay** | Driver static position or low speed pushes calculated ETA beyond window. | Auto-transitions job to `delayed`; dispatches notification to Renter & Admin with revised ETA; prompts driver for delay reason. |
| **Driver Connection / GPS Loss** | No location ping received for > 5 minutes during `en_route`. | Status switches to `location_unavailable`; notifies Admin Dispatch; switches renter tracking view to "Last Known Location". |
| **Failed POD Media Upload** | Device offline during handover signature or photo capture. | App queues offline upload via IndexedDB/Service Worker; flags job as "Handover Pending Verification" until sync finishes. |
| **Driver Reassignment** | Driver declines, drops job, or experiences emergency. | System resets job to `pending_assignment`; publishes re-broadcast alert to available pool; logs driver response metric. |
| **Disputed Handover** | Renter or Host rejects vehicle condition upon arrival. | Freezes automatic rental activation; creates high-priority `SupportTicket`; notifies Admin Dispute desk with recorded checklists. |

---
