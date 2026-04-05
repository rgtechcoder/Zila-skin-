# Zila Skin — Admin/User/Category/Offers Upgrade

## Current State
- UserAuthPage has email + password signup only (no name/city)
- Admin Users tab shows only email, order count, last order (no name, city, total spend)
- Categories have no image upload in admin; images are static in frontend
- No offer/banner/popup system exists
- firestore.ts has localStorage-backed data layer with users derived from orders

## Requested Changes (Diff)

### Add
- `FirestoreUser` type + CRUD in firestore.ts (name, email, city, createdAt)
- `saveUser` / `getUsers` / `getUserByEmail` functions in firestore.ts
- `FirestoreOffer` type + CRUD in firestore.ts (title, description, couponCode, type: banner|popup, active)
- `getActiveOffer`, `saveOffer`, `updateOffer`, `deleteOffer` in firestore.ts
- `OfferBanner` component — sticky top bar with dismiss button (shows only when active offer type=banner)
- `OfferPopup` component — modal on page load with close button (shows only when active offer type=popup)
- Admin panel: Offers tab with create/edit/delete/enable/disable offer
- Users date range filter (from/to based on createdAt or first order date) in admin Users tab
- Download Excel button for users export (name, email, city, total orders, total spend)

### Modify
- UserAuthPage signup: add Full Name + City fields; on signup save user doc to firestore users collection
- firestore.ts `getUsersList` → return name, city, totalSpend calculated from orders
- `FirestoreCategory` type: ensure imageUrl field present
- Admin Category management: add image upload field (base64 conversion); save imageUrl to Firestore
- CategoryCards frontend: display imageUrl from Firestore when present
- App.tsx: render OfferBanner above AnnouncementBar and OfferPopup conditionally

### Remove
- Nothing (extend cleanly)

## Implementation Plan
1. Update firestore.ts: add FirestoreUser CRUD, FirestoreOffer CRUD, update getUsersList to include name/city/totalSpend
2. Update UserAuthPage: add name + city fields to signup form, call saveUser on successful signup
3. Update AdminApp.tsx: 
   a. Users tab: show name, city, total spend columns; add date range filter; add Excel export
   b. Categories tab: add image upload field
   c. Add new Offers tab with CRUD and enable/disable
4. Create OfferBanner component (dismissable sticky banner)
5. Create OfferPopup component (modal on page load)
6. Update App.tsx to include OfferBanner and OfferPopup
