import Footer from "@/components/homepage/Footer";
import GoogleLoginButton from "./GoogleLoginButton";
import Navbar from "@/components/homepage/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  firebaseCreateUserWithEmailAndPassword as createUserWithEmailAndPassword,
  firebaseSendPasswordResetEmail as sendPasswordResetEmail,
  firebaseSignInWithEmailAndPassword as signInWithEmailAndPassword,
} from "@/lib/auth-firebase";
import { saveUser } from "@/lib/firestore";
import { Eye, EyeOff, Lock, Mail, MapPin, User } from "lucide-react";
import { useState } from "react";

const gradientBtn =
  "w-full py-3 rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-60";

export default function UserAuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "forgot") {
        await sendPasswordResetEmail(null, email);
        setSuccess("Password reset email sent! Check your inbox.");
        return;
      }
      if (mode === "login") {
        const cred = await signInWithEmailAndPassword(null, email, password);
        localStorage.setItem("zila_user_email", cred.user.email ?? email);
      } else {
        const cred = await createUserWithEmailAndPassword(
          null,
          email,
          password,
        );
        localStorage.setItem("zila_user_email", cred.user.email ?? email);
        // Save user profile to Firestore
        await saveUser({
          name: fullName,
          email: cred.user.email ?? email,
          city,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("zila_user_name", fullName);
        localStorage.setItem("zila_user_city", city);
      }
      window.location.hash = "#dashboard";
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else if (code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Navbar currentPage="login" />
      <main className="flex items-center justify-center px-4 py-16 lg:py-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10">
            {/* Google Login Button hidden for now */}
            {/*
            {mode !== "forgot" && (
              <GoogleLoginButton
                onSuccess={(user) => {
                  localStorage.setItem("zila_user_email", user.email);
                  window.location.hash = "#dashboard";
                }}
                onError={(err) => setError("Google sign-in failed. Please try again.")}
              />
            )}
            */}
            <div className="text-center mb-8">
              <img
                src="/logo.png"
                alt="Zila Skin"
                className="h-12 w-auto object-contain mx-auto mb-4"
              />
              <h1 className="font-serif text-2xl font-bold text-brand-text">
                {mode === "login"
                  ? "Welcome Back"
                  : mode === "signup"
                    ? "Create Account"
                    : "Reset Password"}
              </h1>
              <p className="text-brand-text-muted text-sm mt-1">
                {mode === "login"
                  ? "Login to track orders and manage your wishlist"
                  : mode === "signup"
                    ? "Join Zila Skin for exclusive offers and order tracking"
                    : "Enter your email to receive a reset link"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name - signup only */}
              {mode === "signup" && (
                <div>
                  <Label className="text-xs font-medium text-brand-text">
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
                    />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="pl-9 rounded-full"
                      data-ocid="login.input"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <Label className="text-xs font-medium text-brand-text">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="pl-9 rounded-full"
                    data-ocid="login.input"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== "forgot" && (
                <div>
                  <Label className="text-xs font-medium text-brand-text">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
                    />
                    <Input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        mode === "signup"
                          ? "Min. 6 characters"
                          : "Your password"
                      }
                      required
                      className="pl-9 pr-10 rounded-full"
                      data-ocid="login.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-pink transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === "login" && (
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setError("");
                          setSuccess("");
                        }}
                        className="text-xs text-brand-pink hover:underline"
                        data-ocid="login.link"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* City - signup only */}
              {mode === "signup" && (
                <div>
                  <Label className="text-xs font-medium text-brand-text">
                    City
                  </Label>
                  <div className="relative mt-1">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
                    />
                    <Input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Your city"
                      required
                      className="pl-9 rounded-full"
                      data-ocid="login.input"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div
                  className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-2.5"
                  data-ocid="login.error_state"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-2.5"
                  data-ocid="login.success_state"
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={gradientBtn}
                data-ocid="login.submit_button"
              >
                {loading
                  ? "Please wait…"
                  : mode === "login"
                    ? "Login to Your Account"
                    : mode === "signup"
                      ? "Create Account"
                      : "Send Reset Link"}
              </button>
            </form>

            {mode === "forgot" ? (
              <p className="text-center text-sm text-brand-text-muted mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-brand-pink font-semibold hover:underline"
                  data-ocid="login.link"
                >
                  ← Back to Login
                </button>
              </p>
            ) : (
              <p className="text-center text-sm text-brand-text-muted mt-6">
                {mode === "login"
                  ? "New to Zila Skin? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-brand-pink font-semibold hover:underline"
                  data-ocid="login.toggle"
                >
                  {mode === "login" ? "Create an account" : "Login"}
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
