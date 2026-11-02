# @kasaride/types

> **Status**: Inactive / Planned (Phase 0 Monorepo Foundation)

## Responsibility
Central TypeScript type definitions and domain interface contracts shared across all KasaRide apps and packages.

## Exported Domain Types
- `Car`, `Host`: Fleet car specifications and vehicle owner profiles
- `BookingDraft`: Booking reservation parameters and delivery options
- `TripRecord`: Trip history records and active rental state
- `DeliveryStatus`: Core delivery state machine enum (`pending_assignment`, `driver_assigned`, `en_route`, `arrived`, `handover_complete`, `no_driver_available`, `delayed`, `location_unavailable`, `cancelled`)
- `DeliveryDriver`, `DeliveryJob`: Dispatch driver profiles, job queues, audit logs, and support tickets

## Note
This shared package is not yet active. TypeScript types are currently defined in `src/types/index.ts`.
