# @kasaride/demo-data

> **Status**: Inactive / Planned (Phase 0 Monorepo Foundation)

## Responsibility
Shared local mock datasets, inspection photo definitions, and local demo reactive state store.

## Architecture & Synchronization Note
> **CRITICAL CONFIGURATION / ARCHITECTURE NOTE**:
> The `BroadcastChannel` ("kasaride_demo_sync") and `localStorage` state synchronization mechanisms defined in this package are strictly intended for **local prototype demonstration** across multiple browser tabs.
> 
> **Production Synchronization Requirement**:
> In a production deployment, cross-app state synchronization MUST NOT rely on `BroadcastChannel` or `localStorage`. Production state synchronization MUST be handled by backend API REST endpoints, WebSocket telematics channels, and real-time server events (e.g. Node.js WebSocket gateway or Firebase Realtime DB).

## Contained Mock Data
- `FLEET`: Accra vehicle fleet catalog (Toyota RAV4, Hyundai Elantra, Honda CR-V, etc.)
- `DEMO_HOST`, `DEMO_DRIVER`, `DEMO_ALT_DRIVER`: Pre-configured user persona profiles
- `INSPECTION_ANGLES`: 8-angle vehicle condition photo checklists
