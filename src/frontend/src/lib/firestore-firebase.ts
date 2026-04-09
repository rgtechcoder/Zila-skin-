// Firebase Firestore implementation for product CRUD
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import FIREBASE_CONFIG from '../firebase';

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export async function getProductsFirestore() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addProductFirestore(product) {
  const docRef = await addDoc(collection(db, 'products'), product);
  return { id: docRef.id, ...product };
}

export async function updateProductFirestore(id, product) {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, product);
}

export async function deleteProductFirestore(id) {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}
