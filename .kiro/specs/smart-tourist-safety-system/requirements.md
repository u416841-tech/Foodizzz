# Requirements Document

## Introduction

The Smart Tourist Safety Monitoring & Incident Response System expands the existing Foodizzz restaurant ordering platform into a unified tourist services ecosystem. The current Foodizzz application — a dark-premium React/TypeScript frontend with a Node.js/Express + MongoDB backend — serves as the "Local Services" module within this larger platform. The system adds a Safety Monitoring layer that ingests tourist location data (already captured via the GPS/address picker on the Menu page) and routes it to an Incident Response engine, while keeping the restaurant ordering experience intact as a first-class citizen.

The platform targets tourists visiting a destination who need both local service discovery (food, transport, accommodation) and a safety net (emergency alerts, incident reporting, real-time hazard maps).

---

## Glossary

- **System**: The Smart Tourist Safety Monitoring & Incident Response System as a whole.
- **Safety_Module**: The backend subsystem responsible for incident ingestion, alert dispatch, and hazard tracking.
- **Services_Module**: The existing Foodizzz ordering subsystem (menu, cart, checkout, order tracking).
- **Location_Service**: The component that resolves GPS coordinates or typed addresses into a canonical GeoJSON point.
- **Incident**: A safety event (crime, medical emergency, natural hazard, traffic accident) reported by a tourist or ingested from an external feed.
- **Alert**: A push notification or in-app message dispatched to tourists within a configurable radius of an Incident.
- **Tourist**: An authenticated or anonymous end-user of the platform who is visiting the destination.
- **Admin**: An authenticated operator who manages menu items, orders, incidents, and broadcast messages via the Admin Dashboard.
- **Hazard_Map**: An interactive map layer that visualises active Incidents as geo-tagged markers.
- **Skeleton_Loader**: A placeholder UI component rendered while asynchronous data is in flight, preventing blank screens.
- **WhatsApp_Bot**: The existing Twilio/WhatsApp Cloud API integration used for order notifications, extended to deliver safety alerts.
- **Razorpay**: The payment gateway used for order checkout.
- **Broadcast_Service**: The existing admin broadcast feature, extended to support geo-targeted safety broadcasts.

---

## Requirements

### Requirement 1: Location Capture & Resolution

**User Story:** As a tourist, I want to enter my address or share my GPS location so that the system knows where I am for both food delivery and safety monitoring.

#### Acceptance Criteria

1. WHEN a tourist types an address and presses Enter or clicks "Confirm Location", THE Location_Service SHALL resolve the input into a GeoJSON point (latitude, longitude) and persist it to `sessionStorage` under the key `deliveryAddress`.
2. WHEN a tourist clicks "Use Current Location", THE Location_Service SHALL invoke the browser Geolocation API and reverse-geocode the coordinates using the Nominatim API, then populate the address input field with the resolved human-readable label.
3. IF the Geolocation API returns an error or is unavailable, THEN THE Location_Service SHALL display an inline error message and leave the address field unchanged.
4. IF the Nominatim reverse-geocode request fails, THEN THE Location_Service SHALL fall back to displaying raw decimal coordinates (`lat, lon`) in the address field.
5. WHEN a location is confirmed, THE System SHALL make the resolved GeoJSON point available to both the Services_Module (for delivery) and the Safety_Module (for proximity-based alert subscription).
6. THE Location_Service SHALL validate that a confirmed address is non-empty and contains at least one non-whitespace character before persisting it.

---

### Requirement 2: Incident Reporting

**User Story:** As a tourist, I want to report a safety incident so that other tourists and responders are notified quickly.

#### Acceptance Criteria

1. WHEN a tourist submits an incident report with a type, description, and location, THE Safety_Module SHALL create an Incident document in MongoDB with fields: `type`, `description`, `location` (GeoJSON Point), `reportedBy` (anonymous ID or user ID), `status` (`open`), and `createdAt`.
2. WHEN an Incident is created, THE Safety_Module SHALL immediately dispatch Alerts to all tourists whose last-known location is within the configured alert radius (default 2 km).
3. IF an incident report is submitted without a location, THEN THE Safety_Module SHALL reject the request and return HTTP 422 with a descriptive error message.
4. IF an incident report is submitted with an invalid `type` (not in the allowed enum), THEN THE Safety_Module SHALL reject the request and return HTTP 422.
5. THE Safety_Module SHALL support the following incident types: `crime`, `medical`, `fire`, `flood`, `traffic`, `other`.
6. WHEN an Admin marks an Incident as `resolved`, THE Safety_Module SHALL update the Incident `status` to `resolved` and stop dispatching new Alerts for that Incident.

---

### Requirement 3: Real-Time Safety Alerts

**User Story:** As a tourist, I want to receive real-time safety alerts near my location so that I can avoid danger.

#### Acceptance Criteria

1. WHEN an Incident is created within 2 km of a tourist's confirmed location, THE System SHALL deliver an in-app Alert to that tourist within 10 seconds of incident creation.
2. WHEN an Alert is delivered, THE System SHALL display the incident type, a short description (max 140 characters), distance from the tourist's location, and a timestamp.
3. WHILE a tourist has an active session with a confirmed location, THE System SHALL maintain a WebSocket or Server-Sent Events connection to push new Alerts without requiring a page refresh.
4. WHERE the WhatsApp_Bot integration is enabled for a tourist's phone number, THE System SHALL also send the Alert as a WhatsApp message using the existing WhatsApp Cloud API integration.
5. IF the real-time connection drops, THEN THE System SHALL attempt reconnection with exponential back-off (initial delay 1 s, max delay 30 s, max 5 retries).

---

### Requirement 4: Hazard Map

**User Story:** As a tourist, I want to see active incidents on an interactive map so that I can plan safe routes.

#### Acceptance Criteria

1. WHEN a tourist opens the Hazard Map view, THE System SHALL render an interactive map centred on the tourist's confirmed location with all `open` Incidents displayed as geo-tagged markers.
2. WHEN a tourist clicks an Incident marker, THE System SHALL display a detail panel showing incident type, description, reported time, and distance from the tourist's location.
3. WHILE the Hazard Map is open, THE System SHALL refresh the Incident markers every 30 seconds without a full page reload.
4. THE System SHALL colour-code markers by incident type (e.g., red for `crime`, orange for `fire`, blue for `flood`, yellow for `traffic`, grey for `other`).
5. IF no confirmed location exists when the tourist opens the Hazard Map, THEN THE System SHALL prompt the tourist to confirm a location before rendering the map.

---

### Requirement 5: Services Module Integration (Restaurant/Menu)

**User Story:** As a tourist, I want to browse and order food from the existing Foodizzz menu so that I can access local services within the same platform.

#### Acceptance Criteria

1. THE Services_Module SHALL retain all existing Foodizzz functionality: menu browsing, cart management, Razorpay checkout, order tracking, and WhatsApp order notifications.
2. WHEN a tourist confirms a location in the Services_Module, THE System SHALL share that location with the Safety_Module so the tourist is automatically enrolled in proximity-based Alert delivery.
3. WHEN the backend is unreachable, THE Services_Module SHALL render Skeleton_Loaders during the loading state and fall back to the hard-coded `FALLBACK_DISHES` list, preventing a blank screen.
4. THE Services_Module SHALL display a non-blocking safety status indicator (e.g., a coloured badge) in the navigation bar showing the count of active Incidents within 5 km of the tourist's location.
5. WHEN a tourist navigates from the Services_Module to the Safety_Module, THE System SHALL preserve the confirmed location without requiring re-entry.

---

### Requirement 6: Admin Incident Management

**User Story:** As an Admin, I want to manage reported incidents from the dashboard so that I can coordinate responses and keep tourists informed.

#### Acceptance Criteria

1. WHEN an Admin logs into the Admin Dashboard, THE System SHALL display a dedicated "Safety" tab alongside the existing "Orders", "Analytics", "Menu", and "Broadcast" tabs.
2. WHEN the Safety tab is active, THE System SHALL list all Incidents ordered by `createdAt` descending, showing type, description, location label, status, and reporter.
3. WHEN an Admin updates an Incident's status, THE Safety_Module SHALL persist the change and, if the new status is `resolved`, stop dispatching Alerts for that Incident.
4. WHEN an Admin sends a geo-targeted broadcast, THE Broadcast_Service SHALL deliver the message to all tourists within the specified radius using the existing WhatsApp_Bot integration.
5. IF an Admin attempts to delete an Incident that has associated unresolved Alerts, THEN THE System SHALL require confirmation before deletion and mark all associated Alerts as `cancelled`.

---

### Requirement 7: Data Persistence & Resilience

**User Story:** As a developer, I want the system to handle backend unavailability gracefully so that tourists always see a usable UI.

#### Acceptance Criteria

1. WHEN the backend API is unreachable, THE System SHALL render Skeleton_Loaders for all data-dependent sections and display a non-blocking status banner.
2. WHEN the backend recovers, THE System SHALL automatically re-fetch data and replace Skeleton_Loaders with real content without requiring a manual page refresh.
3. THE System SHALL persist the tourist's confirmed location in `sessionStorage` so that a page refresh does not require re-entry of the address.
4. THE System SHALL persist the tourist's cart state in `localStorage` so that items are not lost on page refresh.
5. IF a fetch request to the backend times out after 10 seconds, THEN THE System SHALL surface a user-visible error toast and log the error to the browser console.

---

### Requirement 8: UI Architecture & Design System

**User Story:** As a developer, I want a consistent design system across both the Services and Safety modules so that the platform feels cohesive.

#### Acceptance Criteria

1. THE System SHALL use the existing dark-premium design language: background `hsl(220 13% 9%)`, Burnt Sienna accent `#C1622F`, Glassmorphism card surfaces (`backdrop-blur`, `bg-white/4`), and the Bento Grid layout for content cards.
2. THE System SHALL use Skeleton_Loaders (animated `bg-white/6 animate-pulse` placeholders) for every section that fetches asynchronous data.
3. THE System SHALL be fully responsive, adapting layouts from a single-column mobile view to a multi-column desktop Bento Grid.
4. WHEN a new UI section is added to the Safety_Module, THE System SHALL reuse existing Tailwind CSS utility classes and shadcn/ui components rather than introducing new styling primitives.
5. THE System SHALL maintain WCAG 2.1 AA colour contrast ratios for all text elements against their backgrounds.
