# Implementation Plan: Smart Tourist Safety Monitoring & Incident Response System

## Overview

Extend the existing Foodizzz codebase incrementally: first extract shared location logic, then add backend safety models/routes, then build frontend safety UI, and finally wire everything together. No existing functionality is removed.

## Tasks

- [ ] 1. Extract shared location logic into a reusable hook
  - [ ] 1.1 Create `frontend/src/hooks/use-location.ts`
    - Move GPS detection, Nominatim reverse-geocode, address confirmation, and sessionStorage persistence out of `Menu.tsx` into this hook
    - Export: `address`, `setAddress`, `locating`, `addressConfirmed`, `handleGPS`, `handleConfirmAddress`, `handleResetAddress`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_
  - [ ]* 1.2 Write property tests for `use-location` hook
    - **Property 1: Location round-trip consistency** — for any valid address string, confirm → read sessionStorage → assert equality
    - **Property 2: GPS fallback on reverse-geocode failure** — mock Nominatim to fail, generate random coords, assert field = `"lat, lon"`
    - **Validates: Requirements 1.1, 1.4**
  - [ ] 1.3 Refactor `Menu.tsx` to consume `use-location` hook
    - Replace inline location state with the hook; behaviour must be identical
    - _Requirements: 1.1, 1.2_

- [ ] 2. Add Safety data models to the backend
  - [ ] 2.1 Create `backend/src/models/Incident.js`
    - Fields: `type` (enum), `description`, `location` (GeoJSON Point), `reportedBy`, `status`, `alertRadius`
    - Add `{ location: '2dsphere' }` index
    - _Requirements: 2.1, 2.5_
  - [ ] 2.2 Create `backend/src/models/Alert.js`
    - Fields: `incident` (ref), `recipientLocation` (GeoJSON Point), `recipientPhone`, `channel`, `status`
    - _Requirements: 3.1, 3.4_
  - [ ]* 2.3 Write property tests for Incident model validation
    - **Property 3: Incident creation persists all required fields** — generate valid payloads, POST → GET → assert field equality
    - **Property 4: Invalid incident payloads are rejected** — generate payloads with invalid type or missing location, assert HTTP 422 and no DB write
    - **Validates: Requirements 2.1, 2.3, 2.4, 2.5**

- [ ] 3. Implement Incident CRUD API routes
  - [ ] 3.1 Create `backend/src/controllers/incidentController.js`
    - `createIncident`: validate type enum + location presence, save, trigger alert dispatch
    - `listIncidents`: return all incidents sorted by `createdAt` desc
    - `updateIncidentStatus`: PATCH status, stop alert dispatch if `resolved`
    - `deleteIncident`: check for unresolved alerts, return 409 if present
    - _Requirements: 2.1, 2.3, 2.4, 2.6, 6.2, 6.3, 6.5_
  - [ ] 3.2 Create `backend/src/routes/incidentRoutes.js`
    - `POST /api/incidents`, `GET /api/incidents`, `PATCH /api/incidents/:id/status`, `DELETE /api/incidents/:id`
    - Mount in `server.js`
    - _Requirements: 2.1, 6.3_
  - [ ]* 3.3 Write property tests for incident controller
    - **Property 6: Resolved incidents stop generating alerts** — resolve an incident, attempt dispatch, assert no new Alert documents
    - **Validates: Requirements 2.6, 6.3**

- [ ] 4. Implement Alert dispatch and SSE streaming
  - [ ] 4.1 Create `backend/src/controllers/alertController.js`
    - `dispatchAlerts(incident)`: query tourists within `incident.alertRadius` metres using `$geoNear`, create Alert docs, push to SSE clients
    - `registerSSEClient(res, location)`: add client to in-memory registry
    - `deregisterSSEClient(res)`: remove on connection close
    - _Requirements: 2.2, 3.1, 3.2, 3.5_
  - [ ] 4.2 Create `backend/src/routes/alertRoutes.js`
    - `GET /api/alerts/stream`: SSE endpoint — sets `Content-Type: text/event-stream`, registers client, deregisters on close
    - Mount in `server.js`
    - _Requirements: 3.1, 3.3_
  - [ ]* 4.3 Write property tests for alert proximity logic
    - **Property 5: Alert proximity invariant** — generate incident + tourist location pairs, assert alert dispatched iff distance ≤ alertRadius
    - **Property 7: Alert content completeness** — generate alerts, assert payload contains `incidentType`, `description` (≤ 140 chars), `distanceMetres`, `createdAt`
    - **Validates: Requirements 2.2, 3.1, 3.2**

- [ ] 5. Checkpoint — Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Add TypeScript types for Safety domain
  - [ ] 6.1 Extend `frontend/src/types/index.ts`
    - Add `IncidentType`, `IncidentStatus`, `Incident`, `SafetyAlert` interfaces as defined in the design document
    - _Requirements: 2.1, 3.2_

- [ ] 7. Build `SafetyBadge` navbar component
  - [ ] 7.1 Create `frontend/src/components/ui/safety-badge.tsx`
    - Fetches `GET /api/incidents?status=open&near=<lat,lon>&radius=5000` on mount
    - Displays count badge with Burnt Sienna accent; shows nothing if count is 0
    - _Requirements: 5.4_
  - [ ] 7.2 Import and render `SafetyBadge` in `frontend/src/components/ui/navbar.tsx`
    - Pass confirmed location from `useLocation` hook
    - _Requirements: 5.4_
  - [ ]* 7.3 Write property test for `SafetyBadge`
    - **Property 10 (partial): Badge count matches open incidents within radius** — generate incident sets and tourist locations, assert badge count equals filtered count
    - **Validates: Requirements 5.4**

- [ ] 8. Build `IncidentReportForm` component
  - [ ] 8.1 Create `frontend/src/components/IncidentReportForm.tsx`
    - Fields: `type` (select from enum), `description` (textarea, max 500 chars), location (pre-filled from `useLocation`)
    - On submit: `POST /api/incidents`; show success toast or inline error
    - Skeleton loader while submitting
    - _Requirements: 2.1, 2.3, 2.4, 7.1_
  - [ ]* 8.2 Write unit tests for `IncidentReportForm`
    - Test: valid submission calls POST, invalid type is blocked by select, missing location shows error
    - _Requirements: 2.3, 2.4_

- [ ] 9. Build `AlertFeed` component
  - [ ] 9.1 Create `frontend/src/components/AlertFeed.tsx`
    - Opens `EventSource` to `GET /api/alerts/stream?lat=&lon=`
    - On new event: prepend alert to list, show `IncidentCard` for each
    - Implements exponential back-off reconnect (1 s → 30 s, max 5 retries) on `EventSource` error
    - _Requirements: 3.1, 3.2, 3.5_
  - [ ]* 9.2 Write property test for `AlertFeed` content
    - **Property 7: Alert content completeness** — mock SSE events with generated alert payloads, assert rendered cards contain all required fields
    - **Validates: Requirements 3.2**

- [ ] 10. Build `HazardMap` page
  - [ ] 10.1 Install `leaflet` and `react-leaflet` packages
    - Add to `frontend/package.json`; add Leaflet CSS import to `index.css`
    - _Requirements: 4.1_
  - [ ] 10.2 Create `frontend/src/pages/HazardMap.tsx`
    - Renders `MapContainer` centred on confirmed location
    - Fetches `GET /api/incidents?status=open` on mount and every 30 s (use `setInterval`)
    - Renders colour-coded `CircleMarker` per incident type (red=crime, orange=fire, blue=flood, yellow=traffic, grey=other, purple=medical)
    - On marker click: show `IncidentCard` detail panel
    - If no confirmed location: render location prompt instead of map
    - Skeleton loader while initial fetch is in-flight
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.1_
  - [ ]* 10.3 Write property test for marker colour mapping
    - **Property (4.4): Colour-code invariant** — for any incident type value in the enum, the marker colour should match the defined mapping; no incident type maps to undefined
    - **Validates: Requirements 4.4**

- [ ] 11. Build Admin Safety tab
  - [ ] 11.1 Create `frontend/src/components/admin/SafetyTab.tsx`
    - Fetches `GET /api/incidents` on mount
    - Renders incident list ordered by `createdAt` desc using `IncidentCard`
    - Provides status update dropdown (open → resolved) calling `PATCH /api/incidents/:id/status`
    - Provides delete button with confirmation dialog (using existing `alert-dialog.tsx`)
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  - [ ] 11.2 Add "Safety" tab to `frontend/src/pages/AdminDashboard.tsx`
    - Import `SafetyTab`; add `<TabsTrigger value="safety">Safety</TabsTrigger>` and corresponding `<TabsContent>`
    - _Requirements: 6.1_
  - [ ]* 11.3 Write unit tests for `SafetyTab`
    - Test: incidents rendered in descending order, status update calls PATCH, delete with unresolved alerts shows confirmation
    - _Requirements: 6.2, 6.3, 6.5_

- [ ] 12. Add frontend routes and wire location sharing
  - [ ] 12.1 Add Safety routes to `frontend/src/App.tsx`
    - `/safety` → `AlertFeed` page wrapper
    - `/safety/report` → `IncidentReportForm` page wrapper
    - `/safety/map` → `HazardMap`
    - _Requirements: 4.1, 3.1_
  - [ ] 12.2 Update `Menu.tsx` to call `shareLocationWithSafety()` after `handleConfirmAddress`
    - `shareLocationWithSafety` writes the GeoJSON point to a shared context or `sessionStorage` key `safetyLocation`
    - _Requirements: 1.5, 5.2_
  - [ ]* 12.3 Write property test for location sharing
    - **Property 1 (extended): Location shared with Safety_Module** — confirm location in Services_Module, assert `safetyLocation` in sessionStorage equals confirmed GeoJSON point
    - **Validates: Requirements 1.5, 5.2**

- [ ] 13. Implement cart and location persistence
  - [ ] 13.1 Verify `CartContext.tsx` persists to `localStorage` and rehydrates on mount
    - If not already implemented: add `useEffect` to write cart to `localStorage` on change and read on init
    - _Requirements: 7.4_
  - [ ]* 13.2 Write property test for cart persistence
    - **Property 9: Cart persistence across page refresh** — generate random cart states, serialise to localStorage, deserialise, assert deep equality
    - **Validates: Requirements 7.4**

- [ ] 14. Implement fetch timeout and error handling
  - [ ] 14.1 Create `frontend/src/lib/fetchWithTimeout.ts`
    - Wraps `fetch` with an `AbortController` timeout (default 10 s)
    - On timeout: throws a typed `TimeoutError`; callers show error toast and `console.error`
    - _Requirements: 7.5_
  - [ ] 14.2 Replace bare `fetch` calls in `Menu.tsx`, `HazardMap.tsx`, `AlertFeed.tsx`, and `SafetyTab.tsx` with `fetchWithTimeout`
    - _Requirements: 7.5_
  - [ ]* 14.3 Write property test for fetch timeout
    - **Property (7.5 edge-case): Timeout triggers error toast** — mock fetch to delay > 10 s, assert toast is shown and no content is rendered
    - **Validates: Requirements 7.5**

- [ ] 15. Extend geo-targeted broadcast to Safety alerts
  - [ ] 15.1 Update `backend/src/routes/broadcastRoutes.js` to accept optional `lat`, `lon`, `radius` params
    - When provided: filter recipient phone numbers to tourists within radius using `$geoNear` on the Incident collection's tourist location index
    - _Requirements: 6.4_
  - [ ]* 15.2 Write property test for geo-targeted broadcast
    - **Property 10: Geo-targeted broadcast reaches correct recipients** — generate broadcast params + tourist location sets, assert recipient list matches radius filter exactly
    - **Validates: Requirements 6.4**

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use **fast-check** with Vitest; minimum 100 iterations per property
- Unit tests use **Vitest** + **React Testing Library**
- No existing Foodizzz functionality (orders, menu, Razorpay, WhatsApp bot) is modified — only extended
