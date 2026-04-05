import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RAZORPAY_KEY_ID } from "@/config/razorpay";
import { useCart } from "@/hooks/useCart";
import {
  type FirestoreCoupon,
  getShippingSettings,
  incrementCouponUsage,
  saveOrder,
  validateCoupon,
} from "@/lib/firestore";
import { CheckCircle, CreditCard, Shield, Tag, Truck } from "lucide-react";
import { useEffect, useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

interface FormData {
  fullName: string;
  mobile: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export interface BuyNowItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  quantity: number;
}

export default function CheckoutPage() {
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();
  const [buyNowItem, setBuyNowItem] = useState<BuyNowItem | null>(null);
  const shippingSettings = getShippingSettings();

  useEffect(() => {
    const stored = sessionStorage.getItem("zilaBuyNow");
    if (stored) {
      try {
        setBuyNowItem(JSON.parse(stored) as BuyNowItem);
        sessionStorage.removeItem("zilaBuyNow");
      } catch {
        /* ignore */
      }
    }
    const savedAddr = localStorage.getItem("zila_saved_address");
    if (savedAddr) {
      try {
        setForm(JSON.parse(savedAddr));
      } catch {
        /* ignore */
      }
    }
    // Auto-fill email from logged-in user
    const userEmail = localStorage.getItem("zila_user_email");
    if (userEmail) {
      setForm((prev) => ({ ...prev, email: prev.email || userEmail }));
    }
  }, []);

  const items = buyNowItem ? [buyNowItem] : cartItems;
  const subtotal = buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : cartSubtotal;

  const delivery =
    subtotal >= shippingSettings.freeShippingAbove
      ? 0
      : shippingSettings.shippingPrice;

  const [form, setForm] = useState<FormData>({
    fullName: "",
    mobile: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [payment, setPayment] = useState("cod");
  const [ordered, setOrdered] = useState(false);
  const [orderId] = useState(() =>
    Math.floor(10000000 + Math.random() * 90000000).toString(),
  );
  const [orderPaymentId, setOrderPaymentId] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<FirestoreCoupon | null>(
    null,
  );
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const total = subtotal + delivery - discountAmount;

  const isLoggedIn = !!localStorage.getItem("zila_user_email");

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const userId =
        form.email || localStorage.getItem("zila_user_email") || undefined;
      const { coupon, error } = await validateCoupon(
        couponCode,
        subtotal,
        userId,
      );
      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponError("");
      } else setCouponError(error);
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  async function saveOrderToFirestore(
    paymentStatus: "PAID" | "COD_PENDING",
    paymentId?: string,
  ) {
    try {
      await saveOrder({
        orderId,
        items: items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        total,
        subtotal,
        delivery,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        paymentStatus,
        paymentMethod: paymentStatus === "PAID" ? "razorpay" : "cod",
        paymentId,
        userInfo: {
          fullName: form.fullName,
          mobile: form.mobile,
          email: form.email,
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      });
      if (appliedCoupon?.id) {
        const userId =
          form.email || localStorage.getItem("zila_user_email") || undefined;
        await incrementCouponUsage(
          appliedCoupon.id,
          appliedCoupon.usedCount,
          userId,
        );
      }
      if (form.email)
        localStorage.setItem("zila_saved_address", JSON.stringify(form));
    } catch {
      console.warn("Could not save order");
    }
  }

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const required: (keyof FormData)[] = [
      "fullName",
      "mobile",
      "email",
      "address1",
      "city",
      "state",
      "pincode",
    ];
    const newErrors: FormErrors = {};
    for (const key of required) {
      if (!form[key].trim()) newErrors[key] = "This field is required";
    }
    if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile))
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function openRazorpay() {
    setPaymentError("");
    if (typeof window.Razorpay === "undefined") {
      setPaymentError(
        "Payment gateway failed to load. Please refresh and try again.",
      );
      return;
    }
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR",
      name: "ZILA SKIN",
      description: "Order Payment",
      prefill: { name: form.fullName, email: form.email, contact: form.mobile },
      theme: { color: "#F1267A" },
      handler: async (response: RazorpayPaymentResponse) => {
        await saveOrderToFirestore("PAID", response.razorpay_payment_id);
        if (!buyNowItem) clearCart();
        setBuyNowItem(null);
        setOrdered(true);
        setOrderPaymentId(response.razorpay_payment_id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      modal: {
        ondismiss: () =>
          setPaymentError("Payment was cancelled. Please try again."),
      },
    });
    rzp.on("payment.failed", (response: { error: { description: string } }) => {
      setPaymentError(
        response.error.description || "Payment failed. Please try again.",
      );
    });
    rzp.open();
  }

  async function handlePlaceOrder() {
    if (!validate()) return;
    if (payment === "cod") {
      await saveOrderToFirestore("COD_PENDING");
      if (!buyNowItem) clearCart();
      setBuyNowItem(null);
      setOrdered(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (payment === "razorpay") {
      openRazorpay();
    }
  }

  if (ordered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDE3EC]/30 to-[#F3E8FF]/30 font-sans">
        <Navbar currentPage="checkout" />
        <main className="flex items-center justify-center min-h-[70vh] px-4">
          <div
            className="text-center max-w-md"
            data-ocid="checkout.success_state"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={44} className="text-green-500" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-brand-text mb-2">
              Order Placed!
            </h2>
            <p className="text-brand-text-muted mb-1">
              Thank you for shopping with Zila Skin 💕
            </p>
            <p className="text-sm text-brand-text-muted mb-6">
              {orderPaymentId ? (
                <>
                  Payment ID:{" "}
                  <span className="font-semibold text-brand-text">
                    #{orderPaymentId}
                  </span>
                </>
              ) : (
                <>
                  Order ID:{" "}
                  <span className="font-semibold text-brand-text">
                    #{orderId}
                  </span>
                </>
              )}
            </p>
            <p className="text-sm text-brand-text-muted mb-8">
              You’ll receive a confirmation on your email shortly.
            </p>
            <button
              type="button"
              className="px-10 py-3 rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all duration-200"
              onClick={() => {
                window.location.hash = "#home";
              }}
              data-ocid="checkout.primary_button"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDE3EC]/30 to-[#F3E8FF]/30 font-sans">
      <Navbar currentPage="checkout" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-brand-text mb-2">
          Checkout
        </h1>
        <p className="text-brand-text-muted text-sm mb-8">
          {items.length} item{items.length !== 1 ? "s" : ""} in your order
        </p>

        {/* Guest checkout notice */}
        {!isLoggedIn && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-center justify-between gap-4">
            <span>
              Ordering as guest — you can{" "}
              <a href="#login" className="font-semibold underline">
                login/signup
              </a>{" "}
              to track orders later.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6 max-w-xl lg:max-w-none">
            <div
              className="bg-white rounded-2xl shadow-card p-6"
              data-ocid="checkout.panel"
            >
              <h2 className="font-semibold text-lg text-brand-text mb-5">
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-brand-text mb-1 block"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-red-400" : ""}
                    data-ocid="checkout.input"
                  />
                  {errors.fullName && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="checkout.error_state"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="mobile"
                    className="text-sm font-medium text-brand-text mb-1 block"
                  >
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobile"
                    value={form.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={errors.mobile ? "border-red-400" : ""}
                    data-ocid="checkout.input"
                  />
                  {errors.mobile && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="checkout.error_state"
                    >
                      {errors.mobile}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-brand-text mb-1 block"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="your@email.com"
                    className={errors.email ? "border-red-400" : ""}
                    data-ocid="checkout.input"
                  />
                  {errors.email && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="checkout.error_state"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="address1"
                    className="text-sm font-medium text-brand-text mb-1 block"
                  >
                    Address Line 1 *
                  </Label>
                  <Input
                    id="address1"
                    value={form.address1}
                    onChange={(e) => updateField("address1", e.target.value)}
                    placeholder="House/Flat No., Street, Area"
                    className={errors.address1 ? "border-red-400" : ""}
                    data-ocid="checkout.input"
                  />
                  {errors.address1 && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="checkout.error_state"
                    >
                      {errors.address1}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="address2"
                    className="text-sm font-medium text-brand-text mb-1 block"
                  >
                    Address Line 2{" "}
                    <span className="text-brand-text-muted font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="address2"
                    value={form.address2}
                    onChange={(e) => updateField("address2", e.target.value)}
                    placeholder="Landmark, Colony (optional)"
                    data-ocid="checkout.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="city"
                    className="text-sm font-medium text-brand-text mb-1 block"
                  >
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    className={errors.city ? "border-red-400" : ""}
                    data-ocid="checkout.input"
                  />
                  {errors.city && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="checkout.error_state"
                    >
                      {errors.city}
                    </p>
                  )}
                </div>
                <div className="relative z-10">
                  <Label className="text-sm font-medium text-brand-text mb-1 block">
                    State *
                  </Label>
                  <Select
                    onValueChange={(v) => updateField("state", v)}
                    value={form.state}
                  >
                    <SelectTrigger
                      className={errors.state ? "border-red-400" : ""}
                      data-ocid="checkout.select"
                    >
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="checkout.error_state"
                    >
                      {errors.state}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="pincode"
                    className="text-sm font-medium text-brand-text mb-1 block"
                  >
                    Pincode *
                  </Label>
                  <Input
                    id="pincode"
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className={errors.pincode ? "border-red-400" : ""}
                    data-ocid="checkout.input"
                  />
                  {errors.pincode && (
                    <p
                      className="text-red-500 text-xs mt-1"
                      data-ocid="checkout.error_state"
                    >
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div
              className="bg-white rounded-2xl shadow-card p-6"
              data-ocid="checkout.panel"
            >
              <h2 className="font-semibold text-lg text-brand-text mb-5">
                Payment Method
              </h2>
              <RadioGroup
                value={payment}
                onValueChange={setPayment}
                className="space-y-3"
              >
                <label
                  htmlFor="cod"
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === "cod" ? "border-brand-pink bg-brand-accent/30" : "border-border hover:border-brand-pink/40"}`}
                >
                  <RadioGroupItem
                    value="cod"
                    id="cod"
                    data-ocid="checkout.radio"
                  />
                  <Truck size={18} className="text-brand-text-muted shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-brand-text">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>
                <label
                  htmlFor="razorpay"
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === "razorpay" ? "border-brand-pink bg-brand-accent/30" : "border-border hover:border-brand-pink/40"}`}
                >
                  <RadioGroupItem
                    value="razorpay"
                    id="razorpay"
                    data-ocid="checkout.radio"
                  />
                  <CreditCard
                    size={18}
                    className="text-brand-text-muted shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-brand-text">
                        Pay Online via Razorpay
                      </p>
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">
                        SECURE
                      </span>
                    </div>
                    <p className="text-xs text-brand-text-muted mt-0.5">
                      UPI • Cards • Net Banking • Wallets
                    </p>
                  </div>
                </label>
              </RadioGroup>

              {/* Coupon */}
              <div className="mt-5 pt-5 border-t border-border">
                <h3 className="text-sm font-semibold text-brand-text mb-3 flex items-center gap-2">
                  <Tag size={15} className="text-brand-pink" /> Have a coupon?
                </h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        ✓ {appliedCoupon.code} applied!
                      </p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.discountPercent}% off — saving ₹
                        {discountAmount}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-xs text-red-500 hover:underline"
                      data-ocid="checkout.cancel_button"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="Enter coupon code (e.g. ZILA10)"
                      className="flex-1"
                      data-ocid="checkout.input"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") applyCoupon();
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white shrink-0"
                      data-ocid="checkout.secondary_button"
                    >
                      {couponLoading ? "Checking…" : "APPLY"}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {couponError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div
              className="bg-white rounded-2xl shadow-card p-5 sm:p-6 sticky top-24"
              data-ocid="checkout.card"
            >
              <h2 className="font-semibold text-lg text-brand-text mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-[#FFF5F9] to-[#FDE3EC] flex items-center justify-center shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-text truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-brand-text-muted">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-brand-text shrink-0">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Delivery</span>
                  <span
                    className={
                      delivery === 0
                        ? "text-green-600 font-semibold"
                        : "font-semibold"
                    }
                  >
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{discountAmount}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {paymentError && (
                <p
                  className="text-red-500 text-xs mt-4 text-center"
                  data-ocid="checkout.error_state"
                >
                  {paymentError}
                </p>
              )}

              <button
                type="button"
                className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-bold text-base shadow-lg hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                onClick={handlePlaceOrder}
                disabled={items.length === 0}
                data-ocid="checkout.submit_button"
              >
                {payment === "razorpay" ? `PAY ₹${total}` : "PLACE ORDER"}
              </button>

              <div className="flex items-center gap-2 mt-4 justify-center">
                <Shield size={14} className="text-green-500" />
                <p className="text-xs text-brand-text-muted">
                  Your order is protected &amp; 100% secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
