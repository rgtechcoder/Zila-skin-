// Firebase Auth implementation for real user authentication
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import FIREBASE_CONFIG from '../firebase';

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

export async function firebaseCreateUserWithEmailAndPassword(_unused, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return { user: { email: cred.user.email } };
}

export async function firebaseSignInWithEmailAndPassword(_unused, email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return { user: { email: cred.user.email } };
}

export async function firebaseSendPasswordResetEmail(_unused, email) {
  await sendPasswordResetEmail(auth, email);
  return true;
}
