// Firestore CRUD for categories, concerns, orders, coupons
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';
import FIREBASE_CONFIG from '../firebase';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// --- Categories ---
export async function getCategoriesFirestore() {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
export async function addCategoryFirestore(category) {
  const docRef = await addDoc(collection(db, 'categories'), category);
  return { id: docRef.id, ...category };
}
export async function updateCategoryFirestore(id, category) {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, category);
}
export async function deleteCategoryFirestore(id) {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
}

// --- Concerns ---
export async function getConcernsFirestore() {
  const querySnapshot = await getDocs(collection(db, 'concerns'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
export async function addConcernFirestore(concern) {
  const docRef = await addDoc(collection(db, 'concerns'), concern);
  return { id: docRef.id, ...concern };
}
export async function updateConcernFirestore(id, concern) {
  const docRef = doc(db, 'concerns', id);
  await updateDoc(docRef, concern);
}
export async function deleteConcernFirestore(id) {
  const docRef = doc(db, 'concerns', id);
  await deleteDoc(docRef);
}

// --- Orders ---
export async function getOrdersFirestore() {
  const querySnapshot = await getDocs(collection(db, 'orders'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
export async function addOrderFirestore(order) {
  const docRef = await addDoc(collection(db, 'orders'), order);
  return { id: docRef.id, ...order };
}
export async function updateOrderFirestore(id, order) {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, order);
}
export async function deleteOrderFirestore(id) {
  const docRef = doc(db, 'orders', id);
  await deleteDoc(docRef);
}

// --- Coupons ---
export async function getCouponsFirestore() {
  const querySnapshot = await getDocs(collection(db, 'coupons'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
export async function addCouponFirestore(coupon) {
  const docRef = await addDoc(collection(db, 'coupons'), coupon);
  return { id: docRef.id, ...coupon };
}
export async function updateCouponFirestore(id, coupon) {
  const docRef = doc(db, 'coupons', id);
  await updateDoc(docRef, coupon);
}
export async function deleteCouponFirestore(id) {
  const docRef = doc(db, 'coupons', id);
  await deleteDoc(docRef);
}
