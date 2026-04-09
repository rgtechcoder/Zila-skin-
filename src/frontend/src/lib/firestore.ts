// ---- Concerns ----
export interface FirestoreConcern {
  id?: string;
  name: string;
  slug: string;
  icon?: string; // emoji or image url
  description?: string;
}

import {
  getCategoriesFirestore,
  addCategoryFirestore,
  updateCategoryFirestore,
  deleteCategoryFirestore,
  getConcernsFirestore,
  addConcernFirestore,
  updateConcernFirestore,
  deleteConcernFirestore,
  getOrdersFirestore,
  addOrderFirestore,
  updateOrderFirestore,
  deleteOrderFirestore,
  getCouponsFirestore,
  addCouponFirestore,
  updateCouponFirestore,
  deleteCouponFirestore,
} from "./firestore-collections-firebase";

export const getConcerns = async (): Promise<FirestoreConcern[]> => {
  return getConcernsFirestore();
};
export const addConcern = async (c: Omit<FirestoreConcern, "id">) => {
  return addConcernFirestore(c);
};
export const updateConcern = async (id: string, c: Partial<FirestoreConcern>) => {
  return updateConcernFirestore(id, c);
};
export const deleteConcern = async (id: string) => {
  return deleteConcernFirestore(id);
};
// ---- Announcements ----
export interface FirestoreAnnouncement {
  id?: string;
  message: string;
  active: boolean;
  createdAt?: string;
}

export const getAnnouncements = async (): Promise<FirestoreAnnouncement[]> => {
  return readCollection<FirestoreAnnouncement>("announcements");
};

export const addAnnouncement = async (a: Omit<FirestoreAnnouncement, "id" | "createdAt">) => {
  const announcements = readCollection<FirestoreAnnouncement>("announcements");
  const item: FirestoreAnnouncement = {
    ...a,
    id: genId(),
    createdAt: new Date().toISOString(),
  };
  writeCollection("announcements", [...announcements, item]);
  return item;
};

export const updateAnnouncement = async (id: string, a: Partial<FirestoreAnnouncement>) => {
  const announcements = readCollection<FirestoreAnnouncement>("announcements");
  writeCollection(
    "announcements",
    announcements.map((x) => (x.id === id ? { ...x, ...a } : x)),
  );
};

export const deleteAnnouncement = async (id: string) => {
  const announcements = readCollection<FirestoreAnnouncement>("announcements");
  writeCollection(
    "announcements",
    announcements.filter((x) => x.id !== id),
  );
};
// Firestore abstraction layer
// Uses localStorage as fallback when Firebase SDK is not available
// All data is stored locally under the keys: zila_fb_{collection}

const PREFIX = "zila_fb_";

function readCollection<T extends { id?: string }>(name: string): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + name);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeCollection<T>(name: string, data: T[]): void {
  localStorage.setItem(PREFIX + name, JSON.stringify(data));
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface FirestoreProduct {
  id?: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  description: string;
  stock: number;
  imageUrl: string;
  badge?: string;
  skinType?: string;
  concerns?: string[]; // array of concern slugs
  rating?: number;
  reviews?: number;
  showsIn?: string[];
  bestsellerImage?: string; // custom image for bestseller section
  newLaunchImage?: string; // custom image for new launch section
}

export interface FirestoreCategory {
  id?: string;
  name: string;
  slug: string;
  imageUrl?: string;
  order?: number;
}

export interface FirestoreOrder {
  id?: string;
  orderId: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  total: number;
  subtotal: number;
  delivery: number;
  discount?: number;
  couponCode?: string;
  paymentStatus: "PAID" | "COD_PENDING";
  paymentMethod: "razorpay" | "cod";
  paymentId?: string;
  userInfo: {
    fullName: string;
    mobile: string;
    email: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt?: string;
  trackingId?: string;
  orderStatus?: "Pending" | "Shipped" | "Delivered";
}

export interface FirestoreCoupon {
  id?: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  minimumAmount: number;
  usedBy: string[];
  active: boolean;
}

// ---- Products ----
import {
  getProductsFirestore,
  addProductFirestore,
  updateProductFirestore,
  deleteProductFirestore,
} from "./firestore-firebase";

export const getProducts = async (): Promise<FirestoreProduct[]> => {
  return getProductsFirestore();
};

export const addProduct = async (p: Omit<FirestoreProduct, "id">) => {
  return addProductFirestore(p);
};

export const updateProduct = async (
  id: string,
  p: Partial<FirestoreProduct>,
) => {
  return updateProductFirestore(id, p);
};

export const deleteProduct = async (id: string) => {
  return deleteProductFirestore(id);
};

// ---- Categories ----
export const getCategories = async (): Promise<FirestoreCategory[]> => {
  return getCategoriesFirestore();
};
export const addCategory = async (c: Omit<FirestoreCategory, "id">) => {
  return addCategoryFirestore(c);
};
export const updateCategory = async (id: string, c: Partial<FirestoreCategory>) => {
  return updateCategoryFirestore(id, c);
};
export const deleteCategory = async (id: string) => {
  return deleteCategoryFirestore(id);
};

// ---- Orders ----
export const getOrders = async (): Promise<FirestoreOrder[]> => {
  return getOrdersFirestore();
};
export const saveOrder = async (order: Omit<FirestoreOrder, "id" | "createdAt">) => {
  return addOrderFirestore(order);
};
export const updateOrder = async (id: string, data: Partial<FirestoreOrder>) => {
  return updateOrderFirestore(id, data);
};
export const deleteOrder = async (id: string) => {
  return deleteOrderFirestore(id);
};

// ---- User Orders ----
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import FIREBASE_CONFIG from '../firebase';
import { initializeApp } from 'firebase/app';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Get orders for a specific user email from Firestore
 */
export const getUserOrders = async (email: string): Promise<FirestoreOrder[]> => {
  const q = query(collection(db, 'orders'), where('userInfo.email', '==', email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirestoreOrder[];
};

// ---- Coupons ----
export const getCoupons = async (): Promise<FirestoreCoupon[]> => {
  return getCouponsFirestore();
};
export const addCoupon = async (c: Omit<FirestoreCoupon, "id">) => {
  return addCouponFirestore(c);
};
export const updateCoupon = async (id: string, c: Partial<FirestoreCoupon>) => {
  return updateCouponFirestore(id, c);
};
export const deleteCoupon = async (id: string) => {
  return deleteCouponFirestore(id);
};

export const validateCoupon = async (
  code: string,
  cartTotal?: number,
  userId?: string,
): Promise<{ coupon: FirestoreCoupon | null; error: string }> => {
  try {
    const coupons = readCollection<FirestoreCoupon>("coupons");
    const coupon = coupons.find(
      (c) => c.code === code.toUpperCase() && c.active,
    );

    if (!coupon) return { coupon: null, error: "Invalid coupon code." };

    const now = new Date();
    const expiry = coupon.expiryDate.includes("T")
      ? new Date(coupon.expiryDate)
      : new Date(`${coupon.expiryDate}T23:59:59`);
    if (expiry < now)
      return { coupon: null, error: "This coupon has expired." };
    if (coupon.usedCount >= coupon.usageLimit)
      return { coupon: null, error: "Coupon usage limit reached." };
    if (userId && (coupon.usedBy ?? []).includes(userId))
      return { coupon: null, error: "You have already used this coupon." };
    const minAmount = coupon.minimumAmount ?? 0;
    if (cartTotal !== undefined && cartTotal < minAmount)
      return {
        coupon: null,
        error: `Minimum order value of ₹${minAmount} not reached.`,
      };

    return { coupon, error: "" };
  } catch {
    return { coupon: null, error: "Could not validate coupon. Try again." };
  }
};

export const incrementCouponUsage = async (
  id: string,
  currentCount: number,
  userId?: string,
) => {
  const coupons = readCollection<FirestoreCoupon>("coupons");
  writeCollection(
    "coupons",
    coupons.map((x) => {
      if (x.id !== id) return x;
      const usedBy = userId
        ? [...new Set([...(x.usedBy ?? []), userId])]
        : (x.usedBy ?? []);
      return { ...x, usedCount: currentCount + 1, usedBy };
    }),
  );
};

// ---- Shipping Settings ----
export interface ShippingSettings {
  shippingPrice: number;
  freeShippingAbove: number;
}

export const getShippingSettings = (): ShippingSettings => {
  try {
    const raw = localStorage.getItem("zila_shipping_settings");
    return raw
      ? JSON.parse(raw)
      : { shippingPrice: 99, freeShippingAbove: 499 };
  } catch {
    return { shippingPrice: 99, freeShippingAbove: 499 };
  }
};

export const saveShippingSettings = (s: ShippingSettings): void => {
  localStorage.setItem("zila_shipping_settings", JSON.stringify(s));
};

// ---- Users List ----
export const getUsersList = (): Array<{
  email: string;
  orderCount: number;
  lastOrder?: string;
}> => {
  const orders = readCollection<FirestoreOrder>("orders");
  const map = new Map<string, { orderCount: number; lastOrder?: string }>();
  for (const o of orders) {
    const email = o.userInfo?.email;
    if (!email) continue;
    const existing = map.get(email) || { orderCount: 0 };
    map.set(email, {
      orderCount: existing.orderCount + 1,
      lastOrder: o.createdAt,
    });
  }
  return Array.from(map.entries()).map(([email, v]) => ({ email, ...v }));
};

// ---- Users ----
export interface FirestoreUser {
  id?: string;
  name: string;
  email: string;
  city: string;
  createdAt: string;
}

export const saveUser = async (
  u: Omit<FirestoreUser, "id">,
): Promise<FirestoreUser> => {
  const users = readCollection<FirestoreUser>("users");
  const existing = users.find((x) => x.email === u.email);
  if (existing) {
    const updated = users.map((x) =>
      x.email === u.email ? { ...x, ...u } : x,
    );
    writeCollection("users", updated);
    return existing;
  }
  const item = { ...u, id: genId() };
  writeCollection("users", [...users, item]);
  return item;
};

export const getUsers = async (): Promise<FirestoreUser[]> => {
  return readCollection<FirestoreUser>("users");
};

export const getUserByEmail = async (
  email: string,
): Promise<FirestoreUser | null> => {
  const users = readCollection<FirestoreUser>("users");
  return users.find((u) => u.email === email) ?? null;
};

export const getEnhancedUsersList = async (): Promise<
  Array<{
    email: string;
    name: string;
    city: string;
    createdAt: string;
    orderCount: number;
    totalSpend: number;
  }>
> => {
  const users = readCollection<FirestoreUser>("users");
  const orders = readCollection<FirestoreOrder>("orders");

  const spendMap = new Map<string, { count: number; total: number }>();
  for (const o of orders) {
    const email = o.userInfo?.email;
    if (!email) continue;
    const prev = spendMap.get(email) ?? { count: 0, total: 0 };
    spendMap.set(email, {
      count: prev.count + 1,
      total: prev.total + (o.total ?? 0),
    });
  }

  const allEmails = new Set([
    ...users.map((u) => u.email),
    ...Array.from(spendMap.keys()),
  ]);

  return Array.from(allEmails).map((email) => {
    const user = users.find((u) => u.email === email);
    const spend = spendMap.get(email) ?? { count: 0, total: 0 };
    const orderForEmail = orders.find((o) => o.userInfo?.email === email);
    return {
      email,
      name: user?.name ?? orderForEmail?.userInfo?.fullName ?? "-",
      city: user?.city ?? orderForEmail?.userInfo?.city ?? "-",
      createdAt: user?.createdAt ?? orderForEmail?.createdAt ?? "",
      orderCount: spend.count,
      totalSpend: spend.total,
    };
  });
};

// ---- Offers ----
export interface FirestoreOffer {
  id?: string;
  title: string;
  description: string;
  couponCode?: string;
  type: "banner" | "popup";
  active: boolean;
  createdAt?: string;
}

export const getOffers = async (): Promise<FirestoreOffer[]> => {
  return readCollection<FirestoreOffer>("offers");
};

export const getActiveOffer = async (): Promise<FirestoreOffer | null> => {
  const offers = readCollection<FirestoreOffer>("offers");
  return offers.find((o) => o.active) ?? null;
};

export const saveOffer = async (
  o: Omit<FirestoreOffer, "id">,
): Promise<FirestoreOffer> => {
  const offers = readCollection<FirestoreOffer>("offers");
  const item = { ...o, id: genId(), createdAt: new Date().toISOString() };
  writeCollection("offers", [...offers, item]);
  return item;
};

export const updateOffer = async (
  id: string,
  data: Partial<FirestoreOffer>,
): Promise<void> => {
  const offers = readCollection<FirestoreOffer>("offers");
  writeCollection(
    "offers",
    offers.map((x) => (x.id === id ? { ...x, ...data } : x)),
  );
};

export const deleteOffer = async (id: string): Promise<void> => {
  const offers = readCollection<FirestoreOffer>("offers");
  writeCollection(
    "offers",
    offers.filter((x) => x.id !== id),
  );
};
