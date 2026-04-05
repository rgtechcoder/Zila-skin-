// Firebase-like interface using localStorage as fallback
// When Firebase SDK is not available, all operations use localStorage

/*
  FIRESTORE COLLECTIONS SEED STRUCTURE:

  products/{id}: { name, price, originalPrice, category, description, stock, imageUrl, badge, skinType, concern, rating, reviews, showsIn }
  categories/{id}: { name, slug }
  orders/{id}: { orderId, items, total, subtotal, delivery, discount, couponCode, paymentStatus, paymentMethod, paymentId, userInfo, createdAt }
  coupons/{id}: { code, discountPercent, expiryDate, usageLimit, usedCount, minimumAmount, usedBy, active }
*/

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAFXov8ym4aqrmpLOGCPjbWyuvpPCgEUXE",
  authDomain: "zila-skin.firebaseapp.com",
  projectId: "zila-skin",
  storageBucket: "zila-skin.firebasestorage.app",
  messagingSenderId: "175677995884",
  appId: "1:175677995884:web:e179ba902157f90006d149",
};

export { FIREBASE_CONFIG };
export default FIREBASE_CONFIG;
