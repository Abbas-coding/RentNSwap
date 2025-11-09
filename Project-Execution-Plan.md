# ⚙️ Project Execution Plan — (Frontend + Backend + Database)

The goal is to deliver a working vertical slice covering rentals and swaps with fully wired frontend, backend, and MongoDB data layer.

---

## 1. Scope & Deliverables
- **Frontend:** React/Tailwind app with routed flows for browsing, viewing, booking, and swapping items, plus auth guard and messaging previews.
- **Backend:** Node/Express API implementing auth, items, bookings, swaps, reviews, and messaging endpoints with validation and business rules.
- **Database:** MongoDB collections (Users, Items, Bookings, Swaps, Messages, Reviews) with indexes, references, and seed data.
- **Integration:** End-to-end booking + swap flow (list item → browse → view details → request booking or propose swap → owner response) demonstrable via UI against the live API.

---

## 2. Workstream Overview
| Workstream | Goal | Key Outputs |
|------------|------|-------------|
| **Frontend Pages & Components** | Implement screens and reusable UI aligned with the design guide. | Routed pages, component library, React Query hooks, state management. |
| **API & Services** | Expose secure REST endpoints enforcing workflows. | Express routes/controllers, business services, validation middleware. |
| **Database & Data Access** | Persist domain entities with relations + seed data. | Mongoose schemas/models, indexes, seed scripts. |
| **Integration & Testing** | Wire UI ↔ API ↔ DB, ensure critical scenarios pass. | API client hooks, e2e test script, manual test checklist. |

---

## 3. Detailed Plan

### 3.1 Frontend Implementation
1. **Routing & Layout**
   - Pages: `Landing`, `Browse`, `ItemDetails/:itemId`, `CreateListing`, `Inbox`, `Dashboard`, `Auth` (login/register modal or page).
   - Shared layout with sticky header (search, profile menu) and contextual footer per design guide.
   - Protect `CreateListing`, `Inbox`, `Dashboard` behind auth guard (JWT stored in httpOnly cookie; use `/auth/me` to hydrate user).

2. **State & Data Hooks**
   - Use React Query to wrap API endpoints: `useItems`, `useItem(itemId)`, `useBookings`, `useSwaps`, `useMessages`.
   - Central `useAuth()` hook handles login/logout, token refresh, and exposes user roles for conditional UI.

3. **Core Components**
   - **ListingCard:** image, tags (`Swap Available`), price/day, CTA.
   - **FiltersBar:** category select, location input, price slider, availability picker (hooked to query params).
   - **ItemGallery + DetailsPanel:** show full description, owner info, availability calendar, action buttons (Book, Propose Swap, Message Owner).
   - **BookingModal:** date picker, deposit summary, payment placeholder.
   - **SwapProposalModal:** dropdown of user’s items, cash adjustment field, note.
   - **MessageThread:** chat bubbles per design colors, optimistic updates.
   - **Admin/Owner Dashboard Widgets:** pending approvals, active bookings, disputes placeholder.

4. **Frontend Wiring Sequence**
   - Implement static versions with mocked data to validate layouts.
   - Replace mocks incrementally:
     1. Auth flows (`/auth/register`, `/auth/login`, `/auth/me`).
     2. Items list/detail (`/items`, `/items/:id`).
     3. Booking creation + status updates.
     4. Swap proposals + responses.
     5. Messaging previews (basic send/fetch; real-time deferred).
   - Add error/loading skeletons and toast notifications (success/error) for each mutation.

### 3.2 Backend & API
1. **Architecture**
   - Express server with modular routers: `auth`, `items`, `bookings`, `swaps`, `messages`, `reviews`, `admin`.
   - Middleware: request logging, JWT auth, role-based access, validation (Joi/Zod), error handler.
   - Service layer per domain to keep controllers slim (e.g., `BookingService.checkAvailability()`).

2. **Endpoints**
   - `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`.
   - `GET /items`, `GET /items/:id`, `POST /items`, `PATCH /items/:id`, `PATCH /items/:id/status`.
   - `POST /bookings`, `GET /bookings?role=owner|renter`, `PATCH /bookings/:id/approve`, `PATCH /bookings/:id/cancel`.
   - `POST /swaps`, `GET /swaps`, `PATCH /swaps/:id/respond`.
   - `GET /messages/threads`, `GET /messages/:threadId`, `POST /messages/:threadId`.
   - `POST /reviews`, `GET /reviews/:userId`.
   - Admin: `GET /admin/listings`, `PATCH /admin/listings/:id`, `GET /admin/disputes`.

3. **Business Rules**
   - Booking creation checks overlapping bookings and item availability arrays.
   - Swap proposals ensure ownership of proposer item, prevent duplicate pending swaps between same items.
   - Approval workflows: owner must approve bookings/swaps; auto-status updates drive notifications.
   - Reviews allowed only after completed booking/swap (verified via `BookingService.hasCompletedInteraction()`).

### 3.3 Database Design & Seeding
1. **Schemas (Mongoose)**
   - `UserSchema`: profile info, role (`renter`, `owner`, `admin`), rating aggregates.
   - `ItemSchema`: owner ref, pricing, availability slots (ISO date ranges), `isSwappable`, media array.
   - `BookingSchema`: refs to item + renter + owner, status enum (`pending`, `approved`, `active`, `completed`, `cancelled`), deposit.
   - `SwapSchema`: proposer/receiver refs, item refs, `cashAdjustment`, status timeline.
   - `MessageSchema`: thread composite key (item or booking context), sender, content, timestamps.
   - `ReviewSchema`: fromUser, toUser, booking/swaps refs, rating, comment.

2. **Indexes**
   - Users: `{ email: 1 }` unique.
   - Items: `{ owner: 1 }`, text index on title/description for search.
   - Bookings: compound `{ item: 1, startDate: 1, endDate: 1 }` for overlap checks.
   - Swaps: `{ proposerItem: 1, receiverItem: 1, status: 1 }`.
   - Messages: `{ threadId: 1, createdAt: -1 }`.

3. **Seed Data**
   - Script to create sample users (owners/renters), listings with varying attributes, bookings in several states, swap proposals, and message threads.
   - Use `.env.local` vs `.env.production` to separate credentials.

### 3.4 Integration Steps
1. **Local Environment**
   - Run MongoDB locally or via Atlas; load seed data.
   - Start backend (`npm run dev:server`) and frontend (`npm run dev`) concurrently; configure proxy for API.
2. **Auth Wiring**
   - Frontend login/register forms call auth endpoints; store JWT in httpOnly cookie; React Query invalidates `auth/me`.
3. **Listings & Search**
   - Fetch `/items` with filter params; URL query sync with `FiltersBar`.
   - Item detail page fetches `/items/:id`; action buttons open booking/swap modals.
4. **Booking Flow**
   - Booking modal posts to `/bookings`; on success, show confirmation state and push notification placeholder.
   - Owner dashboard consumes `/bookings?role=owner`; approvals patch status and refresh renter view.
5. **Swap Flow**
   - Swap modal displays user-owned items (from `/items?owner=me`); proposals post to `/swaps`.
   - Inbox surfaces pending swaps/bookings; actions update status.
6. **Messaging**
   - Inbox threads fetch `/messages/threads`; message pane hits `/messages/:threadId`.
   - Use polling or manual refresh; real-time upgrade deferred.
7. **Reviews**
   - After booking completion, UI prompts for review; submit to `/reviews`; display on user profile.

### 3.5 Testing & Validation
- **API Tests:** Postman/Thunder tests for each endpoint; integration tests with supertest covering booking overlap, swap validation, auth guards.
- **Frontend:** Component tests for key modals/cards; Cypress/Playwright script for happy-path (login → browse → book → approve).
- **Manual Checklist:** Auth, listing CRUD, booking lifecycle, swap lifecycle, messaging send, review post.

---


Delivering the above ensures the project demo showcases the core rent-and-swap experience with consistent UI, working backend logic, and a populated database—all aligned with the original functional requirements and design language.
