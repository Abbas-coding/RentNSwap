# 🧭 Project Overview Outline — Rent & Swap

## 1. Overview
**Title:** Rent & Swap — Online Rental & Swapping Platform  
**Objective:** Build a user-friendly web platform allowing users to rent or swap lightly used items. Users can list, browse, book, or exchange items securely, creating a trusted peer-to-peer community promoting sustainable consumption.

---

## 2. Technology Stack

| Layer | Tools/Frameworks |
|-------|------------------|
| **Frontend** | React.js / Next.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (NoSQL) |
| **Version Control** | Git / GitHub |

---

## 3. Functional Requirements

1. User Authentication (Email, Phone, Social Login)
2. Item Listing (title, description, photos, price/day, availability)
3. Swap Option (with/without cash adjustment)
4. Search & Browse (category, location, price range, availability)
5. Booking System (start/end dates, escrow payment)
6. Swap Proposal & Negotiation (offer/counter-offer logic)
7. Messaging (in-app chat, real-time communication)
8. Deposit Handling (security deposit until return)
9. Owner Approval Workflow
10. Reviews & Ratings
11. Admin Listing Management
12. Dispute Resolution

---

## 4. Non-Functional Requirements

| Category | Requirement |
|-----------|-------------|
| **Usability** | Responsive, clean UI |
| **Performance** | 2-3s load time |
| **Reliability** | Cloud hosting |
| **Scalability** | Modular, future-ready design |
| **Maintainability** | Version control, modular code |

---

## 5. Core Modules

| Module | Key Components | Dependencies |
|--------|----------------|--------------|
| Auth & User Management | Login, Register, JWT | MongoDB, JWT |
| Item Service | CRUD, Image upload | Auth |
| Booking & Payment | Booking, Escrow | Stripe/PayPal |
| Swap Engine | Proposals, Negotiation | Item Service |
| Messaging Service | Realtime Chat | Auth |
| Admin Dashboard | Moderation, Disputes | All Modules |
| Review System | Ratings, Feedback | Booking Events |

---

## 6. External Integrations (Optional, Once funtional requirements are Completed)

- **Cloudinary / AWS S3:** Image storage
- **Socket.io:** Real-time chat  
- **SendGrid / Nodemailer:** Email notifications

---

## 7. Database Overview

| Collection | Fields |
|-------------|---------|
| **Users** | userId, name, email, passwordHash, role, rating, createdAt |
| **Items** | itemId, ownerId, title, description, pricePerDay, isSwappable, images[], availability[], status |
| **Bookings** | bookingId, itemId, renterId, startDate, endDate, paymentStatus, depositAmount |
| **Swaps** | swapId, proposerId, receiverId, proposerItemId, receiverItemId, cashAdjustment, status |
| **Messages** | messageId, senderId, receiverId, text, timestamp |
| **Reviews** | reviewId, fromUser, toUser, rating, comment, date |
| **Disputes** | disputeId, bookingId, raisedBy, description, resolution, adminDecision |

---

## 8. Workflow
 
- GitHub branching: `main`, `dev`, `feature/*`

---

