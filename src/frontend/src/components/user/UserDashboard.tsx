import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type FirestoreOrder, getUserOrders } from "@/lib/firestore";
import { LogOut, MapPin, Package, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";

interface SavedAddress {
  fullName: string;
  mobile: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyAddress: SavedAddress = {
  fullName: "",
  mobile: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function UserDashboard() {
  const userEmail = localStorage.getItem("zila_user_email");
  const [tab, setTab] = useState<"orders" | "address" | "tracking">("orders");
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [savedAddress, setSavedAddress] = useState<SavedAddress>(emptyAddress);
  const [editMode, setEditMode] = useState(false);
  const [addrForm, setAddrForm] = useState<SavedAddress>(emptyAddress);

  useEffect(() => {
    const raw = localStorage.getItem("zila_saved_address");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SavedAddress;
        setSavedAddress(parsed);
        setAddrForm(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!userEmail || (tab !== "orders" && tab !== "tracking")) return;
    if (orders.length > 0) return; // already loaded
    setOrdersLoading(true);
    getUserOrders(userEmail)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [userEmail, tab, orders.length]);

  function handleLogout() {
    localStorage.removeItem("zila_user_email");
    localStorage.removeItem("zila_saved_address");
    window.location.hash = "#home";
  }

  function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("zila_saved_address", JSON.stringify(addrForm));
    setSavedAddress(addrForm);
    setEditMode(false);
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-brand-bg font-sans">
        <Navbar currentPage="dashboard" />
        <main className="flex items-center justify-center px-4 py-24">
          <div className="text-center">
            <User size={48} className="text-brand-pink mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">
              You're not logged in
            </h2>
            <p className="text-brand-text-muted mb-6">
              Please login to view your dashboard.
            </p>
            <Button
              className="rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90 px-8"
              onClick={() => {
                window.location.hash = "#login";
              }}
              data-ocid="dashboard.primary_button"
            >
              Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine user name for greeting
  const userName = savedAddress.fullName?.trim() ? savedAddress.fullName : userEmail;

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Navbar currentPage="dashboard" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Welcome message */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-brand-text">
                My Account
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white"
              data-ocid="dashboard.secondary_button"
            >
              <LogOut size={15} /> Logout
            </Button>
          </div>
          {/* User name prominently below heading */}
          <div className="mt-1 mb-4">
            <span className="inline-block font-serif text-lg font-semibold text-brand-pink bg-[#fde3ec] px-4 py-1 rounded-full shadow-sm">
              {userName}
            </span>
          </div>
          {/* Welcome message */}
          <div>
            <div className="rounded-2xl bg-gradient-to-r from-[#fde3ec] to-[#f3d0ff] px-6 py-4 flex items-center gap-3 shadow-md animate-fade-in">
              <span className="text-2xl">👋</span>
              <span className="font-serif text-lg font-bold text-brand-pink drop-shadow-sm">
                Welcome to Zila Skin Care!
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 bg-white rounded-2xl p-2 shadow-card mb-8 w-fit mx-auto border border-[#f3d0ff]"
          data-ocid="dashboard.panel"
        >
          {(
            [
              { key: "orders", label: "Orders", icon: Package },
              { key: "address", label: "Saved Address", icon: MapPin },
              { key: "tracking", label: "Track Order", icon: Truck },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 border border-transparent bg-gradient-to-br group
                ${
                  tab === key
                    ? "from-[#F1267A]/90 to-[#9B59B6]/90 text-white scale-105 shadow-lg border-brand-pink"
                    : "from-white to-white text-brand-text-muted hover:from-[#fde3ec] hover:to-[#f3d0ff] hover:text-brand-pink hover:shadow-md"
                }
              `}
              style={{ minWidth: 150 }}
              data-ocid="dashboard.tab"
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                <Icon size={18} />
              </span>
              <span className="tracking-wide font-playfair">{label}</span>
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {ordersLoading ? (
              <div
                className="p-10 text-center text-brand-text-muted"
                data-ocid="dashboard.loading_state"
              >
                Loading orders…
              </div>
            ) : orders.length === 0 ? (
              <div
                className="p-10 text-center"
                data-ocid="dashboard.empty_state"
              >
                <Package
                  size={40}
                  className="text-brand-pink/30 mx-auto mb-3"
                />
                <p className="font-semibold text-brand-text">No orders yet</p>
                <p className="text-brand-text-muted text-sm mt-1">
                  Your completed orders will appear here.
                </p>
                <Button
                  className="mt-4 rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90"
                  onClick={() => {
                    window.location.hash = "#shop";
                  }}
                  data-ocid="dashboard.primary_button"
                >
                  Shop Now
                </Button>
              </div>
            ) : (
              <div
                className="divide-y divide-border"
                data-ocid="dashboard.list"
              >
                {orders.map((order, i) => (
                  <div
                    key={order.id}
                    className="p-5"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm text-brand-text">
                          Order #{order.orderId}
                        </p>
                        <p className="text-xs text-brand-text-muted mt-0.5">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""} · ₹{order.total}
                        </p>
                        <p className="text-xs text-brand-text-muted mt-0.5">
                          {order.items.map((it) => it.name).join(", ")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
                            order.paymentStatus === "PAID"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus === "PAID"
                            ? "Paid"
                            : "COD Pending"}
                        </span>
                        {order.orderStatus && (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Track Order Tab */}
        {tab === "tracking" && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div
                className="bg-white rounded-2xl shadow-card p-10 text-center text-brand-text-muted"
                data-ocid="dashboard.loading_state"
              >
                Loading orders…
              </div>
            ) : orders.length === 0 ? (
              <div
                className="bg-white rounded-2xl shadow-card p-10 text-center"
                data-ocid="dashboard.empty_state"
              >
                <Truck size={40} className="text-brand-pink/30 mx-auto mb-3" />
                <p className="font-semibold text-brand-text">
                  No orders to track
                </p>
                <p className="text-brand-text-muted text-sm mt-1">
                  Place an order first to see tracking here.
                </p>
              </div>
            ) : (
              orders.map((order, i) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-card p-5"
                  data-ocid={`dashboard.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-sm text-brand-text">
                        Order #{order.orderId}
                      </p>
                      <p className="text-xs text-brand-text-muted mt-0.5">
                        ₹{order.total} · {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus ?? "Pending"}
                    </span>
                  </div>
                  {order.trackingId ? (
                    <div className="bg-brand-accent rounded-xl px-4 py-3">
                      <p className="text-xs font-semibold text-brand-text-muted mb-1">
                        Tracking ID
                      </p>
                      <p className="font-bold text-brand-pink text-sm">
                        {order.trackingId}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-brand-text-muted bg-gray-50 rounded-xl px-4 py-3">
                      🔄 Your order is being processed.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Address Tab */}
        {tab === "address" && (
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-brand-text">Saved Address</h2>
              {!editMode && savedAddress.address1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="rounded-full border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white"
                  data-ocid="dashboard.edit_button"
                >
                  Edit
                </Button>
              )}
            </div>

            {!editMode && savedAddress.address1 ? (
              <div className="text-sm text-brand-text space-y-1">
                <p className="font-semibold">{savedAddress.fullName}</p>
                <p className="text-brand-text-muted">{savedAddress.mobile}</p>
                <p className="text-brand-text-muted">{savedAddress.address1}</p>
                {savedAddress.address2 && (
                  <p className="text-brand-text-muted">
                    {savedAddress.address2}
                  </p>
                )}
                <p className="text-brand-text-muted">
                  {savedAddress.city}, {savedAddress.state} –{" "}
                  {savedAddress.pincode}
                </p>
              </div>
            ) : !editMode ? (
              <div data-ocid="dashboard.empty_state">
                <p className="text-brand-text-muted text-sm mb-4">
                  No address saved yet.
                </p>
                <Button
                  className="rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90"
                  onClick={() => setEditMode(true)}
                  data-ocid="dashboard.primary_button"
                >
                  Add Address
                </Button>
              </div>
            ) : (
              <form onSubmit={saveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs font-medium">Full Name</Label>
                    <Input
                      value={addrForm.fullName}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                      required
                      data-ocid="dashboard.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Mobile</Label>
                    <Input
                      value={addrForm.mobile}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, mobile: e.target.value }))
                      }
                      required
                      data-ocid="dashboard.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Email</Label>
                    <Input
                      type="email"
                      value={addrForm.email}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, email: e.target.value }))
                      }
                      data-ocid="dashboard.input"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium">
                      Address Line 1
                    </Label>
                    <Input
                      value={addrForm.address1}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, address1: e.target.value }))
                      }
                      required
                      data-ocid="dashboard.input"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium">
                      Address Line 2 (optional)
                    </Label>
                    <Input
                      value={addrForm.address2 ?? ""}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, address2: e.target.value }))
                      }
                      data-ocid="dashboard.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">City</Label>
                    <Input
                      value={addrForm.city}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, city: e.target.value }))
                      }
                      required
                      data-ocid="dashboard.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">State</Label>
                    <Input
                      value={addrForm.state}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, state: e.target.value }))
                      }
                      required
                      data-ocid="dashboard.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Pincode</Label>
                    <Input
                      value={addrForm.pincode}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, pincode: e.target.value }))
                      }
                      required
                      data-ocid="dashboard.input"
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3 justify-end">
                  {savedAddress.address1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      className="rounded-full"
                      data-ocid="dashboard.cancel_button"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-md hover:opacity-90"
                    data-ocid="dashboard.save_button"
                  >
                    Save Address
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
