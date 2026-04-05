// Simple auth abstraction using localStorage
// Replaces Firebase Auth when SDK is not available

const USERS_KEY = "zila_auth_users";
const SESSION_KEY = "zila_auth_session";

interface StoredUser {
  email: string;
  passwordHash: string; // simple hash, not cryptographically secure
}

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

export async function signInWithEmailAndPassword(
  _auth: unknown,
  email: string,
  password: string,
): Promise<{ user: { email: string } }> {
  const users = getStoredUsers();
  const user = users.find(
    (u) => u.email === email && u.passwordHash === simpleHash(password),
  );
  if (!user) {
    const err = new Error("Invalid credentials") as Error & { code: string };
    err.code = "auth/invalid-credential";
    throw err;
  }
  localStorage.setItem(SESSION_KEY, email);
  return { user: { email } };
}

export async function createUserWithEmailAndPassword(
  _auth: unknown,
  email: string,
  password: string,
): Promise<{ user: { email: string } }> {
  const users = getStoredUsers();
  if (users.find((u) => u.email === email)) {
    const err = new Error("Email in use") as Error & { code: string };
    err.code = "auth/email-already-in-use";
    throw err;
  }
  if (password.length < 6) {
    const err = new Error("Weak password") as Error & { code: string };
    err.code = "auth/weak-password";
    throw err;
  }
  const newUser: StoredUser = { email, passwordHash: simpleHash(password) };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  localStorage.setItem(SESSION_KEY, email);
  return { user: { email } };
}

export async function signInWithAdminCheck(
  email: string,
  password: string,
): Promise<boolean> {
  // Use admin credentials from .env
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  // Debug log (remove in production)
  console.log('ENV ADMIN:', adminEmail, adminPassword);
  if (email === adminEmail && password === adminPassword) {
    localStorage.setItem("zila_admin_email", email);
    return true;
  }
  return false;
}

export const auth = {};

export async function sendPasswordResetEmail(
  _auth: unknown,
  email: string,
): Promise<void> {
  // In production this would call Firebase Auth
  // For now, simulate success (security: don't reveal if email exists)
  console.info("Password reset email would be sent to:", email);
  return Promise.resolve();
}
