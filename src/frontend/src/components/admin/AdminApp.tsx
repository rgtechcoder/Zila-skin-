import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical } from "lucide-react";
// (duplicate import removed)




// ---- Multi-select for Concerns ----
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { signInWithAdminCheck } from "@/lib/auth";
import {
  type FirestoreCategory,
  type FirestoreCoupon,
  type FirestoreOffer,
  type FirestoreOrder,
  type FirestoreProduct,
  addCategory,
  addCoupon,
  addProduct,
  deleteCategory,
  deleteCoupon,
  deleteOffer,
  deleteProduct,
  getCategories,
  getCoupons,
  getEnhancedUsersList,
  getOffers,
  getOrders,
  getProducts,
  getShippingSettings,
  saveOffer,
  saveShippingSettings,
  updateCategory,
  updateCoupon,
  updateOffer,
  updateOrder,
  updateProduct,
} from "@/lib/firestore";
import {
  BarChart2,
  Box,
  ChevronDown,
  ChevronUp,
  Download,
  Layers,
  LogOut,
  Megaphone,
  Package,
  Pencil,
  PlusCircle,
  Settings,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";


// ---- Multi-select for Concerns ----
function ConcernsMultiSelect({ value, onChange, options }: { value: string[]; onChange: (v: string[]) => void; options: { slug: string; name: string }[] }) {
  function toggle(slug: string) {
    if (value.includes(slug)) onChange(value.filter(v => v !== slug));
    else onChange([...value, slug]);
  }
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.length === 0 ? (
        <span className="text-xs text-gray-400">No concerns</span>
      ) : (
        options.map(opt => (
          <label key={opt.slug} className="flex items-center gap-1 cursor-pointer text-xs border rounded px-2 py-1">
            <input
              type="checkbox"
              checked={value.includes(opt.slug)}
              onChange={() => toggle(opt.slug)}
              className="accent-[#F1267A]"
            />
            {opt.name}
          </label>
        ))
      )}
    </div>
  );
}

import {
  type FirestoreConcern,
  getConcerns,
  addConcern,
  updateConcern,
  deleteConcern,
} from "@/lib/firestore";

type AdminTab =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "coupons"
  | "settings"
  | "users"
  | "offers"
  | "concerns";

function ConcernsTab() {
    // Ensure concerns have an order field
    function getSortedConcerns(cs: FirestoreConcern[]) {
      return [...cs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    // Save new order to storage
    async function saveOrder(newCs: FirestoreConcern[]) {
      // Assign order field based on array index
      const updated = newCs.map((c, i) => ({ ...c, order: i }));
      // Save all
      updated.forEach(async (concern) => {
        if (concern.id) await updateConcern(concern.id, { order: concern.order });
      });
      setConcerns(updated);
    }

    function handleDragEnd(result: any) {
      if (!result.destination) return;
      const items = getSortedConcerns(concerns);
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      saveOrder(items);
    }
  const [concerns, setConcerns] = useState<FirestoreConcern[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<FirestoreConcern>>({ name: "", slug: "", icon: "", description: "" });
  // Handle icon image file upload (data URL for preview)
  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, icon: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setConcerns(await getConcerns());
    } catch {
      setConcerns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  function handleEdit(c: FirestoreConcern) {
    setEditId(c.id ?? null);
    setForm({ name: c.name, slug: c.slug, icon: c.icon, description: c.description });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim() || !form.slug?.trim()) return;
    if (editId) {
      await updateConcern(editId, form);
    } else {
      await addConcern(form as Omit<FirestoreConcern, "id">);
    }
    setForm({ name: "", slug: "", icon: "", description: "" });
    setEditId(null);
    await load();
  }

  async function handleDelete(id: string) {
    await deleteConcern(id);
    setDeleteConfirm(null);
    await load();
  }

  return (
    <div data-ocid="admin.concerns.section">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Concerns</h2>
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-5">
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <Label className="text-xs font-medium text-gray-700 mb-1 block">Name</Label>
              <Input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Hydration" required />
            </div>
            <div className="flex-1 w-full">
              <Label className="text-xs font-medium text-gray-700 mb-1 block">Slug</Label>
              <Input value={form.slug || ""} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="e.g. hydration" required />
            </div>
            <div className="flex-1 w-full">
              <Label className="text-xs font-medium text-gray-700 mb-1 block">Icon (emoji, image URL, or upload)</Label>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-brand-accent hover:bg-brand-pink/20 text-brand-pink text-xs font-medium rounded-full border border-brand-pink/30 transition-colors">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleIconFile}
                    />
                  </label>
                  {form.icon?.startsWith("data:") && (
                    <img
                      src={form.icon}
                      alt="preview"
                      className="w-8 h-8 rounded object-contain border border-border"
                    />
                  )}
                </div>
                <Input
                  value={form.icon?.startsWith("data:") ? "" : (form.icon ?? "")}
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  placeholder="e.g. 💧 or https://..."
                  disabled={form.icon?.startsWith("data:")}
                />
                {form.icon?.startsWith("data:") && (
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, icon: "" }))}
                    className="text-xs text-red-500 hover:underline self-start"
                  >
                    Remove uploaded image
                  </button>
                )}
              </div>
            </div>
            {/* Description field removed as per request */}
            <Button type="submit" className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all duration-200">
              {editId ? "Update" : "Add"}
            </Button>
            {editId && (
              <Button variant="outline" onClick={() => { setEditId(null); setForm({ name: "", slug: "", icon: "", description: "" }); }}>Cancel</Button>
            )}
          </form>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="concerns-droppable">
                {(provided) => (
                  <Table
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Icon</TableHead>
                        {/* <TableHead>Description</TableHead> */}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSortedConcerns(concerns).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-400 py-8">No concerns yet.</TableCell>
                        </TableRow>
                      ) : (
                        getSortedConcerns(concerns).map((c, i) => (
                          <Draggable key={c.id} draggableId={c.id ?? String(i)} index={i}>
                            {(provided, snapshot) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  background: snapshot.isDragging ? '#f3e8ff' : undefined,
                                }}
                              >
                                <TableCell {...provided.dragHandleProps} className="cursor-grab text-gray-400">
                                  <GripVertical size={18} />
                                </TableCell>
                                <TableCell className="font-medium text-sm max-w-[120px] truncate">{c.name}</TableCell>
                                <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                                <TableCell>
                                  {c.icon && (c.icon.startsWith('data:') || c.icon.startsWith('http')) ? (
                                    <img src={c.icon} alt={c.name} className="w-7 h-7 object-contain inline-block align-middle" />
                                  ) : c.icon ? (
                                    c.icon
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </TableCell>
                                {/* <TableCell className="text-xs max-w-[200px] truncate">{c.description}</TableCell> */}
                                <TableCell className="text-right">
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>Edit</Button>
                                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => setDeleteConfirm(c.id!)}>Delete</Button>
                                  {deleteConfirm === c.id && (
                                    <Dialog open onOpenChange={() => setDeleteConfirm(null)}>
                                      <DialogContent>
                                        <DialogHeader><DialogTitle>Delete Concern?</DialogTitle></DialogHeader>
                                        <div>Are you sure you want to delete <b>{c.name}</b>?</div>
                                        <div className="flex gap-2 mt-4 justify-end">
                                          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                                          <Button variant="destructive" onClick={() => handleDelete(c.id!)}>Delete</Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import {
  type FirestoreAnnouncement,
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/lib/firestore";
// ---- Announcements Tab ----
function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<FirestoreAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ message: string; active: boolean }>({ message: "", active: true });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setAnnouncements(await getAnnouncements());
    } catch {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  function handleEdit(a: FirestoreAnnouncement) {
    setEditId(a.id ?? null);
    setForm({ message: a.message, active: a.active });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim()) return;
    if (editId) {
      await updateAnnouncement(editId, form);
    } else {
      await addAnnouncement(form);
    }
    setForm({ message: "", active: true });
    setEditId(null);
    await load();
  }

  async function handleDelete(id: string) {
    await deleteAnnouncement(id);
    setDeleteConfirm(null);
    await load();
  }

  return (
    <div data-ocid="admin.section">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Announcements</h2>
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-5">
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <Label className="text-xs font-medium text-gray-700 mb-1 block">Message</Label>
              <Input
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="e.g. ✨ FREE Shipping on orders above ₹499 — Shop Now"
                data-ocid="admin.input"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium">Active</Label>
              <Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all duration-200"
              data-ocid="admin.save_button"
            >
              {editId ? "Update" : "Add"}
            </Button>
            {editId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditId(null);
                  setForm({ message: "", active: true });
                }}
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400" data-ocid="admin.loading_state">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Message</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400 py-8" data-ocid="admin.empty_state">No announcements yet.</TableCell>
                  </TableRow>
                ) : (
                  announcements.map((a, i) => (
                    <TableRow key={a.id} data-ocid={`admin.row.${i + 1}`}>
                      <TableCell className="font-medium text-sm max-w-[320px] truncate">{a.message}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={a.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                          {a.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(a)} data-ocid={`admin.edit_button.${i + 1}`}><Pencil size={14} /></Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteConfirm(a.id ?? "")} data-ocid={`admin.delete_button.${i + 1}`}><Trash2 size={14} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={!!deleteConfirm} onOpenChange={v => { if (!v) setDeleteConfirm(null); }}>
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Delete Announcement?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} data-ocid="admin.cancel_button">Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} data-ocid="admin.confirm_button">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- XLSX Export ----
function exportToExcel(orders: FirestoreOrder[]) {
  const headers = [
    "Order ID",
    "Customer",
    "Email",
    "Phone",
    "City",
    "Total",
    "Payment Status",
    "Payment Method",
    "Payment ID",
    "Date",
  ];
  const rows = orders.map((o) => [
    o.orderId,
    o.userInfo.fullName,
    o.userInfo.email,
    o.userInfo.mobile,
    o.userInfo.city,
    o.total,
    o.paymentStatus,
    o.paymentMethod,
    o.paymentId ?? "",
    o.createdAt ? new Date(o.createdAt as string).toLocaleDateString() : "",
  ]);
  const csv = [headers, ...rows]
    .map((r) =>
      r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zila-orders.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportUsersToExcel(
  users: Array<{
    name: string;
    email: string;
    city: string;
    orderCount: number;
    totalSpend: number;
  }>,
) {
  const headers = [
    "Name",
    "Email",
    "City",
    "Total Orders",
    "Total Spend (\u20b9)",
  ];
  const rows = users.map((u) => [
    u.name,
    u.email,
    u.city,
    u.orderCount,
    u.totalSpend,
  ]);
  const csv = [headers, ...rows]
    .map((r) =>
      r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zila-users.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Login Screen ----
function LoginScreen({ onLogin }: { onLogin: (u: { email: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Debug: log env admin credentials
  console.log('ENV ADMIN (UI):', import.meta.env.VITE_ADMIN_EMAIL, import.meta.env.VITE_ADMIN_PASSWORD);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await signInWithAdminCheck(email, password);
      if (!ok) throw new Error("Invalid credentials");
      onLogin({ email });
    } catch {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8e8f8] to-[#f6fafd] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Zila Skin"
            className="h-12 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to manage your store
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl border border-[#f3d6f6] p-8 space-y-5"
          data-ocid="admin.panel"
        >
          <div>
            <Label
              htmlFor="admin-email"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              required
              data-ocid="admin.input"
            />
          </div>
          <div>
            <Label
              htmlFor="admin-password"
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                data-ocid="admin.input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm" data-ocid="admin.error_state">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 active:scale-95 shadow-md transition-all duration-200 rounded-xl py-2.5"
            disabled={loading}
            data-ocid="admin.submit_button"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          Access restricted to authorized admins only.
        </p>
      </div>
    </div>
  );
}

// ---- Dashboard Tab ----
function DashboardTab({
  products,
  orders,
}: {
  products: FirestoreProduct[];
  orders: FirestoreOrder[];
}) {
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Box,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: BarChart2,
      color: "bg-green-50 text-green-600",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6" data-ocid="admin.section">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}
                >
                  <s.icon size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-700">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-400 py-8"
                    data-ocid="admin.empty_state"
                  >
                    No orders yet
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((o, i) => (
                  <TableRow key={o.id ?? i} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-mono text-xs">
                      {o.orderId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {o.userInfo.fullName}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      ₹{o.total}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          o.paymentStatus === "PAID" ? "default" : "secondary"
                        }
                        className={
                          o.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {o.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {o.createdAt
                        ? new Date(o.createdAt as string).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Product Form Modal ----
function ProductFormModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (p: Omit<FirestoreProduct, "id">) => Promise<void>;
  initial?: FirestoreProduct | null;
}) {
  const empty: Omit<FirestoreProduct, "id"> = {
    name: "",
    price: 0,
    originalPrice: 0,
    category: "",
    description: "",
    stock: 0,
    imageUrl: "",
    badge: "",
    skinType: "",
    concerns: [],
    rating: 4.5,
    reviews: 0,
    showsIn: [],
  };
  const [form, setForm] = useState<Omit<FirestoreProduct, "id"> & {
    bestsellerImage?: string;
    newLaunchImage?: string;
  }>(initial ? { ...initial } : empty);

  // Handle Bestseller and New Launch image uploads
  const handleBestsellerImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, bestsellerImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  const handleNewLaunchImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, newLaunchImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  const [concernsOptions, setConcernsOptions] = useState<{ slug: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let f = initial ? { ...initial } : empty;
    // Normalize showsIn for edit: if either 'newlaunch' or 'new-launch' is present, ensure both are present
    let showsIn = f.showsIn ?? [];
    if (showsIn.includes("newlaunch") && !showsIn.includes("new-launch")) {
      showsIn = [...showsIn, "new-launch"];
    }
    if (showsIn.includes("new-launch") && !showsIn.includes("newlaunch")) {
      showsIn = [...showsIn, "newlaunch"];
    }
    setForm({ ...f, showsIn });
    if (open) {
      getConcerns().then(cs => setConcernsOptions(cs.map(c => ({ slug: c.slug, name: c.name }))));
    }
  }, [initial, open]);

  const f =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({
        ...prev,
        [k]:
          e.target.type === "number" ? Number(e.target.value) : e.target.value,
      }));

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const toggleShowsIn = (val: string) => {
    setForm((prev) => {
      const arr = prev.showsIn ?? [];
      return {
        ...prev,
        showsIn: arr.includes(val)
          ? arr.filter((x) => x !== val)
          : [...arr, val],
      };
    });
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      setForm(empty); // Reset form after save
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.dialog"
      >
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="mt-2">
          <div className="grid grid-cols-2 gap-4 p-2">
            <div className="col-span-2">
              <Label className="text-xs font-medium">Product Name *</Label>
              <Input
                value={form.name}
                onChange={f("name")}
                placeholder="Product name"
                required
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Price (₹) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={f("price")}
                placeholder="649"
                required
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Original Price (₹)</Label>
              <Input
                type="number"
                value={form.originalPrice}
                onChange={f("originalPrice")}
                placeholder="849"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Category *</Label>
              <Input
                value={form.category}
                onChange={f("category")}
                placeholder="Serum"
                required
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={f("stock")}
                placeholder="50"
                data-ocid="admin.input"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-medium">Product Image</Label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-brand-pink/20 text-brand-pink text-xs font-medium rounded-full border border-brand-pink/30 transition-colors">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFile}
                    />
                  </label>
                  {form.imageUrl?.startsWith("data:") && (
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="w-12 h-12 rounded-lg object-contain border border-border"
                    />
                  )}
                </div>
                <Input
                  value={
                    form.imageUrl?.startsWith("data:")
                      ? ""
                      : (form.imageUrl ?? "")
                  }
                  onChange={f("imageUrl")}
                  placeholder="Or paste image URL: https://..."
                  data-ocid="admin.input"
                  disabled={form.imageUrl?.startsWith("data:")}
                />
                {form.imageUrl?.startsWith("data:") && (
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove uploaded image
                  </button>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-medium">Description</Label>
              <Input
                value={form.description}
                onChange={f("description")}
                placeholder="Short product description"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Badge</Label>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Array.isArray(form.badge) && form.badge.includes("Bestseller")}
                    onChange={e => {
                      setForm(f => ({
                        ...f,
                        badge: e.target.checked
                          ? [...(Array.isArray(f.badge) ? f.badge : []), "Bestseller"]
                          : (Array.isArray(f.badge) ? f.badge.filter(b => b !== "Bestseller") : [])
                      }));
                    }}
                  /> Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Array.isArray(form.badge) && form.badge.includes("New")}
                    onChange={e => {
                      setForm(f => ({
                        ...f,
                        badge: e.target.checked
                          ? [...(Array.isArray(f.badge) ? f.badge : []), "New"]
                          : (Array.isArray(f.badge) ? f.badge.filter(b => b !== "New") : [])
                      }));
                    }}
                  /> New Launch
                </label>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Skin Type</Label>
              <Input
                value={form.skinType ?? ""}
                onChange={f("skinType")}
                placeholder="All Skin / Oily"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Concerns</Label>
              <ConcernsMultiSelect
                value={form.concerns ?? []}
                onChange={concerns => setForm(f => ({ ...f, concerns }))}
                options={concernsOptions}
              />
            </div>
            ---- Multi-select for Concerns ----
            <div>
              <Label className="text-xs font-medium">Rating</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating ?? 4.5}
                onChange={f("rating")}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Reviews Count</Label>
              <Input
                type="number"
                value={form.reviews ?? 0}
                onChange={f("reviews")}
                data-ocid="admin.input"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium mb-2 block">Show In</Label>
            <div className="flex gap-4">
              {/* Check for both 'newlaunch' and 'new-launch' for New Launches */}
              {[{ label: "All Products", value: "all" }, { label: "Bestsellers", value: "bestseller" }, { label: "New Launches", value: "new-launch" }].map(({ label, value }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={
                      value === "new-launch"
                        ? (form.showsIn ?? []).includes("new-launch") || (form.showsIn ?? []).includes("newlaunch")
                        : (form.showsIn ?? []).includes(value)
                    }
                    onChange={() => toggleShowsIn(value)}
                    className="rounded border-border accent-[#F1267A]"
                    data-ocid="admin.checkbox"
                  />
                  {label}
                </label>
              ))}
            </div>
            {/* Conditional image uploaders for Bestseller and New Launches */}
            {(form.showsIn ?? []).includes("bestseller") && (
              <div className="mt-2">
                <Label className="text-xs font-medium">Bestseller Image (optional)</Label>
                <div className="flex items-center gap-3 mt-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-brand-pink/20 text-brand-pink text-xs font-medium rounded-full border border-brand-pink/30 transition-colors">
                    <span>Upload Bestseller Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBestsellerImageFile}
                    />
                  </label>
                  {form.bestsellerImage?.startsWith("data:") && (
                    <img
                      src={form.bestsellerImage}
                      alt="bestseller preview"
                      className="w-12 h-12 rounded-lg object-contain border border-border"
                    />
                  )}
                  {form.bestsellerImage?.startsWith("data:") && (
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, bestsellerImage: "" }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
            {(form.showsIn ?? []).includes("new-launch") && (
              <div className="mt-2">
                <Label className="text-xs font-medium">New Launch Image (optional)</Label>
                <div className="flex items-center gap-3 mt-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-accent hover:bg-brand-pink/20 text-brand-pink text-xs font-medium rounded-full border border-brand-pink/30 transition-colors">
                    <span>Upload New Launch Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleNewLaunchImageFile}
                    />
                  </label>
                  {form.newLaunchImage?.startsWith("data:") && (
                    <img
                      src={form.newLaunchImage}
                      alt="new launch preview"
                      className="w-12 h-12 rounded-lg object-contain border border-border"
                    />
                  )}
                  {form.newLaunchImage?.startsWith("data:") && (
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, newLaunchImage: "" }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all duration-200"
              disabled={saving}
              data-ocid="admin.save_button"
            >
              {saving ? "Saving…" : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Products Tab ----
function ProductsTab() {
    // Ensure products have an order field
    function getSortedProducts(prods: FirestoreProduct[]) {
      return [...prods].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    // Save new order to storage
    async function saveOrder(newProds: FirestoreProduct[]) {
      // Assign order field based on array index
      const updated = newProds.map((p, i) => ({ ...p, order: i }));
      // Save all
      updated.forEach(async (prod) => {
        if (prod.id) await updateProduct(prod.id, { order: prod.order });
      });
      setProducts(updated);
    }

    function handleDragEnd(result: any) {
      if (!result.destination) return;
      const items = getSortedProducts(products);
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      saveOrder(items);
    }
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<FirestoreProduct | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  async function handleSave(p: Omit<FirestoreProduct, "id">) {
    // Guarantee both 'newlaunch' and 'new-launch' are present if either is selected
    let showsIn = p.showsIn ?? [];
    if (showsIn.includes("newlaunch") && !showsIn.includes("new-launch")) {
      showsIn = [...showsIn, "new-launch"];
    }
    if (showsIn.includes("new-launch") && !showsIn.includes("newlaunch")) {
      showsIn = [...showsIn, "newlaunch"];
    }
    // PATCH: badge as array for multi-badge support
    let badge = p.badge;
    if (!Array.isArray(badge)) {
      badge = badge ? [badge] : [];
    }
    // Always save custom images if present
    const productToSave = { ...p, showsIn, badge };
    if (editProduct?.id) {
      await updateProduct(editProduct.id, productToSave);
    } else {
      await addProduct(productToSave);
    }
    await load();
  }

  async function handleDelete(id: string) {
    await deleteProduct(id);
    setDeleteConfirm(null);
    await load();
  }

  return (
    <div data-ocid="admin.section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Products</h2>
        <Button
          onClick={() => {
            setEditProduct(null);
            setModalOpen(true);
          }}
          className="bg-[#F1267A] hover:bg-[#d91060] text-white gap-2 text-sm"
          data-ocid="admin.open_modal_button"
        >
          <PlusCircle size={15} /> Add Product
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div
              className="p-8 text-center text-gray-400"
              data-ocid="admin.loading_state"
            >
              Loading…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="products-droppable">
                  {(provided) => (
                    <Table
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead></TableHead>
                          <TableHead className="w-14">Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Badge</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedProducts(products).length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center text-gray-400 py-8"
                              data-ocid="admin.empty_state"
                            >
                              No products. Add your first product.
                            </TableCell>
                          </TableRow>
                        ) : (
                          getSortedProducts(products).map((p, i) => (
                            <Draggable key={p.id} draggableId={p.id ?? String(i)} index={i}>
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    background: snapshot.isDragging ? '#f3e8ff' : undefined,
                                  }}
                                  data-ocid={`admin.row.${i + 1}`}
                                >
                                  <TableCell {...provided.dragHandleProps} className="cursor-grab text-gray-400">
                                    <GripVertical size={18} />
                                  </TableCell>
                                  <TableCell>
                                    <img
                                      src={p.imageUrl}
                                      alt={p.name}
                                      className="w-10 h-10 object-contain rounded-lg bg-gray-100"
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium text-sm max-w-[160px] truncate">
                                    {p.name}
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-600">
                                    {p.category}
                                  </TableCell>
                                  <TableCell className="text-sm font-semibold">
                                    ₹{p.price}
                                  </TableCell>
                                  <TableCell className="text-sm">{p.stock}</TableCell>
                                  <TableCell>
                                    {Array.isArray(p.badge)
                                      ? p.badge.map((b, i) => (
                                          <Badge key={b + i} variant="secondary" className="text-xs mr-1">
                                            {b}
                                          </Badge>
                                        ))
                                      : p.badge ? (
                                          <Badge variant="secondary" className="text-xs">{p.badge}</Badge>
                                        ) : (
                                          <span className="text-gray-300 text-xs">-</span>
                                        )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setEditProduct(p);
                                          setModalOpen(true);
                                        }}
                                        data-ocid={`admin.edit_button.${i + 1}`}
                                      >
                                        <Pencil size={14} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => setDeleteConfirm(p.id ?? "")}
                                        data-ocid={`admin.delete_button.${i + 1}`}
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editProduct}
      />

      {/* Delete confirm */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => {
          if (!v) setDeleteConfirm(null);
        }}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              data-ocid="admin.confirm_button"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Categories Tab ----
function CategoriesTab() {
    // Ensure categories have an order field
    function getSortedCategories(cats: FirestoreCategory[]) {
      return [...cats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    // Save new order to storage
    async function saveOrder(newCats: FirestoreCategory[]) {
      // Assign order field based on array index
      const updated = newCats.map((c, i) => ({ ...c, order: i }));
      // Save all
      updated.forEach(async (cat) => {
        if (cat.id) await updateCategory(cat.id, { order: cat.order });
      });
      setCategories(updated);
    }

    function handleDragEnd(result: any) {
      if (!result.destination) return;
      const items = getSortedCategories(categories);
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      saveOrder(items);
    }
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await getCategories());
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    if (editId) {
      await updateCategory(editId, { name, slug, imageUrl });
    } else {
      await addCategory({ name, slug, imageUrl });
    }
    setName("");
    setImageUrl("");
    setEditId(null);
    await load();
  }

  async function handleDelete(id: string) {
    await deleteCategory(id);
    setDeleteConfirm(null);
    await load();
  }

  return (
    <div data-ocid="admin.section">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>

      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1 block">
                {editId ? "Edit Category Name" : "Category Name"}
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Serum"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1 block">
                Category Image
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs h-9"
                  data-ocid="admin.upload_button"
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all duration-200"
              data-ocid="admin.save_button"
            >
              {editId ? "Update" : "Add"}
            </Button>
            {editId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditId(null);
                  setName("");
                  setImageUrl("");
                }}
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div
              className="p-8 text-center text-gray-400"
              data-ocid="admin.loading_state"
            >
              Loading…
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories-droppable">
                {(provided) => (
                  <Table
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead></TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSortedCategories(categories).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-gray-400 py-8"
                            data-ocid="admin.empty_state"
                          >
                            No categories yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        getSortedCategories(categories).map((c, i) => (
                          <Draggable key={c.id} draggableId={c.id ?? String(i)} index={i}>
                            {(provided, snapshot) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  background: snapshot.isDragging ? '#f3e8ff' : undefined,
                                }}
                                data-ocid={`admin.row.${i + 1}`}
                              >
                                <TableCell {...provided.dragHandleProps} className="cursor-grab text-gray-400">
                                  <GripVertical size={18} />
                                </TableCell>
                                <TableCell>
                                  {c.imageUrl ? (
                                    <img
                                      src={c.imageUrl}
                                      alt={c.name}
                                      className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FDE3EC] to-[#F3D0FF]" />
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">{c.name}</TableCell>
                                <TableCell className="text-gray-500 text-sm font-mono">
                                  {c.slug}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditId(c.id ?? "");
                                        setName(c.name);
                                        setImageUrl(c.imageUrl ?? "");
                                      }}
                                      data-ocid={`admin.edit_button.${i + 1}`}
                                    >
                                      <Pencil size={14} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => setDeleteConfirm(c.id ?? "")}
                                      data-ocid={`admin.delete_button.${i + 1}`}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => {
          if (!v) setDeleteConfirm(null);
        }}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteConfirm!)}
              data-ocid="admin.confirm_button"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Orders Tab ----

function OrdersTab() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [couponFilter, setCouponFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<
    Record<string, { trackingId: string; orderStatus: string }>
  >({});
  const [trackingSaved, setTrackingSaved] = useState<string | null>(null);

  // Calculate coupon usage summary
  const couponSummary: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.couponCode) {
      const code = o.couponCode.toUpperCase();
      couponSummary[code] = (couponSummary[code] || 0) + 1;
    }
  });

  async function handleUpdateTracking(orderId: string) {
    const t = trackingInputs[orderId];
    if (!t) return;
    await updateOrder(orderId, {
      trackingId: t.trackingId,
      orderStatus: t.orderStatus as "Pending" | "Shipped" | "Delivered",
    });
    setTrackingSaved(orderId);
    setTimeout(() => setTrackingSaved(null), 2000);
    // refresh
    const updated = await getOrders();
    setOrders(updated);
  }

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  let filtered = orders;
  if (statusFilter !== "All")
    filtered = filtered.filter((o) => o.paymentStatus === statusFilter);
  if (dateFrom)
    filtered = filtered.filter((o) => {
      if (!o.createdAt) return false;
      return new Date(o.createdAt as string) >= new Date(dateFrom);
    });
  if (dateTo)
    filtered = filtered.filter((o) => {
      if (!o.createdAt) return false;
      return new Date(o.createdAt as string) <= new Date(`${dateTo}T23:59:59`);
    });
  if (couponFilter.trim())
    filtered = filtered.filter((o) => (o.couponCode || "").toLowerCase().includes(couponFilter.trim().toLowerCase()));

  return (
    <div data-ocid="admin.section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
        <Button
          onClick={() => exportToExcel(filtered)}
          variant="outline"
          className="gap-2 text-sm border-green-500 text-green-600 hover:bg-green-50"
          data-ocid="admin.primary_button"
        >
          <Download size={15} /> Download Excel
        </Button>
      </div>

      {/* Coupon Usage Summary */}
      {Object.keys(couponSummary).length > 0 && (
        <Card className="border-0 shadow mb-4 bg-yellow-50">
          <CardContent className="p-4">
            <div className="font-semibold mb-2 text-yellow-800">Coupon Usage Summary</div>
            <div className="flex flex-wrap gap-4">
              {Object.entries(couponSummary).map(([code, count]) => (
                <div key={code} className="text-sm text-yellow-900 bg-yellow-100 rounded px-3 py-1">
                  <span className="font-mono font-bold">{code}</span>: {count} order{count > 1 ? "s" : ""}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1 block">
                Status
              </Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F1267A]/30"
                data-ocid="admin.select"
              >
                <option>All</option>
                <option value="PAID">PAID</option>
                <option value="COD_PENDING">COD_PENDING</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1 block">
                From Date
              </Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1 block">
                To Date
              </Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1 block">
                Coupon Code
              </Label>
              <Input
                type="text"
                placeholder="e.g. INFLUENCER10"
                value={couponFilter}
                onChange={(e) => setCouponFilter(e.target.value)}
                className="text-sm"
                data-ocid="admin.input.coupon_filter"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div
              className="p-8 text-center text-gray-400"
              data-ocid="admin.loading_state"
            >
              Loading orders…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-8" />
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Coupon Used</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-400 py-8"
                        data-ocid="admin.empty_state"
                      >
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((o, i) => (
                      <>
                        <TableRow
                          key={`${o.id}-row`}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() =>
                            setExpanded(
                              expanded === o.id ? null : (o.id ?? null),
                            )
                          }
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell>
                            {expanded === o.id ? (
                              <ChevronUp size={14} className="text-gray-400" />
                            ) : (
                              <ChevronDown
                                size={14}
                                className="text-gray-400"
                              />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {o.orderId}
                          </TableCell>
                          <TableCell className="text-sm">
                            {o.userInfo.fullName}
                          </TableCell>
                          <TableCell className="text-sm font-semibold">
                            ₹{o.total}
                          </TableCell>
                          <TableCell className="text-xs">
                            {o.couponCode ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                {o.couponCode}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                o.paymentStatus === "PAID"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {o.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">
                            {o.createdAt
                              ? new Date(
                                  o.createdAt as string,
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                        {expanded === o.id && (
                          <TableRow key={`${o.id}-detail`}>
                            <TableCell colSpan={6} className="bg-gray-50 p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="font-semibold text-gray-700 mb-2">
                                    Customer Info
                                  </p>
                                  <p>
                                    <span className="text-gray-500">
                                      Phone:
                                    </span>{" "}
                                    {o.userInfo.mobile}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">
                                      Email:
                                    </span>{" "}
                                    {o.userInfo.email}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">City:</span>{" "}
                                    {o.userInfo.city}, {o.userInfo.state}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">
                                      Address:
                                    </span>{" "}
                                    {o.userInfo.address1}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-700 mb-2">
                                    Items Ordered
                                  </p>
                                  {o.items.map((item) => (
                                    <p
                                      key={item.name}
                                      className="text-gray-600"
                                    >
                                      {item.name} × {item.quantity} — ₹
                                      {item.price * item.quantity}
                                    </p>
                                  ))}
                                  {o.couponCode && (
                                    <p className="text-green-600 mt-1">
                                      Coupon: {o.couponCode} (-₹
                                      {o.discount ?? 0})
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <Truck size={14} /> Update Tracking
                                  </p>
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Tracking ID (e.g. DL123456)"
                                      defaultValue={o.trackingId ?? ""}
                                      onChange={(e) =>
                                        setTrackingInputs((prev) => ({
                                          ...prev,
                                          [o.id ?? ""]: {
                                            ...prev[o.id ?? ""],
                                            trackingId: e.target.value,
                                            orderStatus:
                                              prev[o.id ?? ""]?.orderStatus ??
                                              o.orderStatus ??
                                              "Pending",
                                          },
                                        }))
                                      }
                                      className="text-xs h-8"
                                    />
                                    <select
                                      defaultValue={o.orderStatus ?? "Pending"}
                                      onChange={(e) =>
                                        setTrackingInputs((prev) => ({
                                          ...prev,
                                          [o.id ?? ""]: {
                                            ...prev[o.id ?? ""],
                                            orderStatus: e.target.value,
                                            trackingId:
                                              prev[o.id ?? ""]?.trackingId ??
                                              o.trackingId ??
                                              "",
                                          },
                                        }))
                                      }
                                      className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">
                                        Delivered
                                      </option>
                                    </select>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 text-xs h-7"
                                        onClick={() =>
                                          handleUpdateTracking(o.id ?? "")
                                        }
                                        data-ocid="admin.save_button"
                                      >
                                        Update
                                      </Button>
                                      {trackingSaved === o.id && (
                                        <span className="text-green-600 text-xs font-medium">
                                          ✓ Saved!
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Coupons Tab ----
function CouponsTab() {
  const [coupons, setCoupons] = useState<FirestoreCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState<FirestoreCoupon | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const emptyForm: Omit<FirestoreCoupon, "id"> = {
    code: "",
    discountPercent: 10,
    expiryDate: "",
    usageLimit: 100,
    usedCount: 0,
    minimumAmount: 0,
    usedBy: [],
    active: true,
  };
  const [form, setForm] = useState<Omit<FirestoreCoupon, "id">>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      setCoupons(await getCoupons());
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: emptyForm is a stable constant
  useEffect(() => {
    setForm(editCoupon ? { ...editCoupon } : emptyForm);
  }, [editCoupon, modalOpen]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (editCoupon?.id) {
      await updateCoupon(editCoupon.id, form);
    } else {
      await addCoupon({ ...form, code: form.code.toUpperCase() });
    }
    setModalOpen(false);
    await load();
  }

  async function handleDelete(id: string) {
    await deleteCoupon(id);
    setDeleteConfirm(null);
    await load();
  }

  return (
    <div data-ocid="admin.section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Coupons</h2>
        <Button
          onClick={() => {
            setEditCoupon(null);
            setModalOpen(true);
          }}
          className="bg-[#F1267A] hover:bg-[#d91060] text-white gap-2 text-sm"
          data-ocid="admin.open_modal_button"
        >
          <PlusCircle size={15} /> Add Coupon
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div
              className="p-8 text-center text-gray-400"
              data-ocid="admin.loading_state"
            >
              Loading…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-400 py-8"
                      data-ocid="admin.empty_state"
                    >
                      No coupons yet. Create one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((c, i) => (
                    <TableRow key={c.id} data-ocid={`admin.row.${i + 1}`}>
                      <TableCell className="font-mono font-bold text-[#F1267A]">
                        {c.code}
                      </TableCell>
                      <TableCell className="text-sm">
                        {c.discountPercent}%
                      </TableCell>
                      <TableCell className="text-sm">
                        {c.minimumAmount ? `₹${c.minimumAmount}` : "—"}
                      </TableCell>
                      <TableCell className="text-sm">{c.expiryDate}</TableCell>
                      <TableCell className="text-sm">
                        {c.usedCount}/{c.usageLimit}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            c.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }
                        >
                          {c.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditCoupon(c);
                              setModalOpen(true);
                            }}
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteConfirm(c.id ?? "")}
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={(v) => {
          if (!v) setModalOpen(false);
        }}
      >
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editCoupon ? "Edit Coupon" : "Add Coupon"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="mt-2">
            <div className="grid grid-cols-2 gap-4 p-2">
              <div className="col-span-2">
                <Label className="text-xs font-medium">Coupon Code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="ZILA10"
                  required
                  data-ocid="admin.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium">Discount % *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={form.discountPercent}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        discountPercent: Number(e.target.value),
                      }))
                    }
                    required
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Usage Limit *</Label>
                  <Input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        usageLimit: Number(e.target.value),
                      }))
                    }
                    required
                    data-ocid="admin.input"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">Expiry Date *</Label>
                <Input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, expiryDate: e.target.value }))
                  }
                  required
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">Minimum Order (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.minimumAmount ?? 0}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      minimumAmount: Number(e.target.value),
                    }))
                  }
                  placeholder="499"
                  data-ocid="admin.input"
                />
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))}
                  data-ocid="admin.switch"
                />
                <Label className="text-sm">Active</Label>
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  data-ocid="admin.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all duration-200"
                  data-ocid="admin.save_button"
                >
                  {editCoupon ? "Update" : "Create Coupon"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => {
          if (!v) setDeleteConfirm(null);
        }}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Delete Coupon?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              data-ocid="admin.confirm_button"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Settings Tab ----
function SettingsTab() {
  const [shippingPrice, setShippingPrice] = useState<number>(99);
  const [freeShippingAbove, setFreeShippingAbove] = useState<number>(499);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getShippingSettings();
    setShippingPrice(s.shippingPrice);
    setFreeShippingAbove(s.freeShippingAbove);
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveShippingSettings({ shippingPrice, freeShippingAbove });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div data-ocid="admin.section">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Store Settings
      </h2>
      <Card className="border-0 shadow-sm max-w-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Shipping Price (₹)
              </Label>
              <Input
                type="number"
                min="0"
                value={shippingPrice}
                onChange={(e) => setShippingPrice(Number(e.target.value))}
                data-ocid="admin.input"
              />
              <p className="text-xs text-gray-400 mt-1">
                Charged when order is below free shipping threshold
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Free Shipping Above (₹)
              </Label>
              <Input
                type="number"
                min="0"
                value={freeShippingAbove}
                onChange={(e) => setFreeShippingAbove(Number(e.target.value))}
                data-ocid="admin.input"
              />
              <p className="text-xs text-gray-400 mt-1">
                Orders above this amount get free shipping
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 active:scale-95 shadow-sm transition-all duration-200"
                data-ocid="admin.save_button"
              >
                Save Settings
              </Button>
              {saved && (
                <span className="text-green-600 text-sm font-medium">
                  ✓ Saved!
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Users Tab ----
function UsersTab() {
  const [users, setUsers] = useState<
    Array<{
      email: string;
      name: string;
      city: string;
      createdAt: string;
      orderCount: number;
      totalSpend: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    getEnhancedUsersList()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    if (!fromDate && !toDate) return true;
    const d = u.createdAt ? new Date(u.createdAt) : null;
    if (!d) return true;
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  });

  return (
    <div data-ocid="admin.section">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-500 whitespace-nowrap">
              From
            </Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-8 text-xs w-36"
              data-ocid="admin.input"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-500 whitespace-nowrap">
              To
            </Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-8 text-xs w-36"
              data-ocid="admin.input"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportUsersToExcel(filtered)}
            className="gap-1.5 text-xs"
            data-ocid="admin.button"
          >
            <Download size={13} /> Download Excel
          </Button>
        </div>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div
              className="p-10 text-center text-gray-400"
              data-ocid="admin.loading_state"
            >
              Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="p-10 text-center text-gray-400"
              data-ocid="admin.empty_state"
            >
              No users found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spend (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u, i) => (
                  <TableRow key={u.email} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-medium text-sm">
                      {u.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {u.city}
                    </TableCell>
                    <TableCell className="text-sm">{u.orderCount}</TableCell>
                    <TableCell className="text-sm font-medium">
                      ₹{u.totalSpend.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Offers Tab ----
function OffersTab() {
  const [offers, setOffers] = useState<FirestoreOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editOffer, setEditOffer] = useState<FirestoreOffer | null>(null);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    couponCode: string;
    type: "banner" | "popup";
    active: boolean;
  }>({
    title: "",
    description: "",
    couponCode: "",
    type: "banner",
    active: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      setOffers(await getOffers());
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load once
  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditOffer(null);
    setForm({
      title: "",
      description: "",
      couponCode: "",
      type: "banner",
      active: true,
    });
    setDialogOpen(true);
  }

  function openEdit(o: FirestoreOffer) {
    setEditOffer(o);
    setForm({
      title: o.title,
      description: o.description,
      couponCode: o.couponCode ?? "",
      type: o.type,
      active: o.active,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    // If activating, deactivate others of the same type only
    if (form.active) {
      for (const o of offers) {
        if (o.id && o.active && o.id !== editOffer?.id && o.type === form.type) {
          await updateOffer(o.id, { active: false });
        }
      }
    }
    if (editOffer?.id) {
      await updateOffer(editOffer.id, {
        title: form.title,
        description: form.description,
        couponCode: form.couponCode || undefined,
        type: form.type,
        active: form.active,
      });
    } else {
      await saveOffer({
        title: form.title,
        description: form.description,
        couponCode: form.couponCode || undefined,
        type: form.type,
        active: form.active,
      });
    }
    setForm({
      title: "",
      description: "",
      couponCode: "",
      type: "banner",
      active: true,
    }); // Reset offer form
    setDialogOpen(false);
    await load();
  }

  async function handleToggleActive(o: FirestoreOffer) {
    const newActive = !o.active;
    // If activating, deactivate others of the same type only
    if (newActive) {
      for (const other of offers) {
        if (other.id && other.active && other.id !== o.id && other.type === o.type) {
          await updateOffer(other.id, { active: false });
        }
      }
    }
    if (o.id) await updateOffer(o.id, { active: newActive });
    await load();
  }

  async function handleDelete(id: string) {
    await deleteOffer(id);
    setDeleteConfirm(null);
    await load();
  }

  return (
    <div data-ocid="admin.section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Offers & Promotions
        </h2>
        <Button
          onClick={openAdd}
          className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90 gap-2"
          data-ocid="admin.open_modal_button"
        >
          <PlusCircle size={15} /> Add Offer
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div
              className="p-10 text-center text-gray-400"
              data-ocid="admin.loading_state"
            >
              Loading…
            </div>
          ) : offers.length === 0 ? (
            <div
              className="p-10 text-center text-gray-400"
              data-ocid="admin.empty_state"
            >
              No offers yet. Create one to show banners or popups on the
              homepage.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Coupon Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((o, i) => (
                  <TableRow key={o.id} data-ocid={`admin.row.${i + 1}`}>
                    <TableCell className="font-medium text-sm max-w-[200px] truncate">
                      {o.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          o.type === "banner"
                            ? "border-blue-200 text-blue-700 bg-blue-50"
                            : "border-purple-200 text-purple-700 bg-purple-50"
                        }
                      >
                        {o.type === "banner" ? "Top Banner" : "Popup Modal"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-gray-500">
                      {o.couponCode ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={o.active}
                          onCheckedChange={() => handleToggleActive(o)}
                          data-ocid={`admin.switch.${i + 1}`}
                        />
                        <span
                          className={`text-xs font-medium ${o.active ? "text-green-600" : "text-gray-400"}`}
                        >
                          {o.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(o)}
                          data-ocid={`admin.edit_button.${i + 1}`}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteConfirm(o.id ?? "")}
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle>{editOffer ? "Edit Offer" : "New Offer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1 block">
                Title *
              </Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Flash Sale 20% OFF"
                data-ocid="admin.input"
              />
            </div>
            {/* Description field removed from Offer form as per request */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-1 block">
                  Coupon Code (optional)
                </Label>
                <Input
                  value={form.couponCode}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      couponCode: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="e.g. SAVE20"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-1 block">
                  Display Type
                </Label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      type: e.target.value as "banner" | "popup",
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F1267A]/30"
                  data-ocid="admin.select"
                >
                  <option value="banner">Top Banner</option>
                  <option value="popup">Popup Modal</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))}
                data-ocid="admin.switch"
              />
              <Label className="text-sm text-gray-700">
                {form.active
                  ? "Active (will show on homepage)"
                  : "Inactive (hidden)"}
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white hover:opacity-90"
              data-ocid="admin.save_button"
            >
              {editOffer ? "Update Offer" : "Create Offer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => {
          if (!v) setDeleteConfirm(null);
        }}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Delete Offer?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteConfirm!)}
              data-ocid="admin.confirm_button"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Main Admin App ----
export default function AdminApp() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);

  useEffect(() => {
    const adminEmail = localStorage.getItem("zila_admin_email");
    if (adminEmail) setUser({ email: adminEmail });
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([getProducts(), getOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .catch(() => {});
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400" data-ocid="admin.loading_state">
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  const navItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "products", label: "Products", icon: Box },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "orders", label: "Orders", icon: Package },
    { id: "coupons", label: "Coupons", icon: Tag },
    // { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "users", label: "Users", icon: Users },
    { id: "offers", label: "Offers", icon: Megaphone },
    { id: "concerns", label: "Concerns", icon: Tag },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header
        className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50"
        data-ocid="admin.panel"
      >
        <div className="flex items-center gap-3">
          <img
            src="logo.png"
            alt="Zila Skin"
            className="h-8 w-auto object-contain"
          />
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-gradient-to-r from-[#F1267A] to-[#9B59B6] text-white font-semibold shadow-sm hover:opacity-90 active:scale-95"
            onClick={() => window.open("/", "_blank")}
            data-ocid="admin.goto_website_button"
          >
            Go to Website
          </Button>
          <span className="text-xs text-gray-500 hidden sm:block">
            {user.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("zila_admin_email");
              setUser(null);
            }}
            className="gap-2 text-sm"
            data-ocid="admin.button"
          >
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-14 sm:w-52 bg-white border-r border-gray-200 flex flex-col gap-1 pt-4 px-2 sm:px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === item.id
                  ? "bg-[#FDE3EC] text-[#F1267A]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              data-ocid="admin.tab"
            >
              <item.icon size={16} className="shrink-0" />
              <span className="hidden sm:block">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {tab === "dashboard" && (
            <DashboardTab products={products} orders={orders} />
          )}
          {tab === "products" && <ProductsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "coupons" && <CouponsTab />}
          {/* {tab === "announcements" && <AnnouncementsTab />} */}
          {tab === "users" && <UsersTab />}
          {tab === "offers" && <OffersTab />}
          {tab === "concerns" && <ConcernsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
