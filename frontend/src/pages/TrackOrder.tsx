import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, MapPin, CheckCircle2, Phone, Bike } from "lucide-react";

// ── localStorage dispatch key (shared with AdminDashboard) ──
const DISPATCH_KEY = "foodizzz_dispatch";

export default function TrackOrder() {
  const { orderId } = useParams();
  const [searchOrderId, setSearchOrderId] = useState(orderId || "");
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lsPollingRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ── Driver comes from API (assignedPartner) OR localStorage dispatch ──
  // No random auto-assign — driver only appears after Admin manually assigns
  const [assignedDriver, setAssignedDriver] = useState<{ name: string; phone: string } | null>(null);

  // Check localStorage for a dispatched driver for the current order
  const checkLocalDispatch = (orderId: string) => {
    try {
      const raw = localStorage.getItem(DISPATCH_KEY);
      if (!raw) return null;
      const map = JSON.parse(raw);
      return map[orderId] || null;
    } catch { return null; }
  };

  // Merge API order with any localStorage dispatch override
  const mergeDispatch = (order: any) => {
    if (!order) return order;
    const dispatch = checkLocalDispatch(order.displayOrderId || order._id);
    if (dispatch) {
      return {
        ...order,
        assignedPartner: dispatch.partner,
        status: dispatch.status || order.status,
      };
    }
    return order;
  };

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`);
      if (!res.ok) throw new Error("Order not found");
      const orders = await res.json();
      const foundOrder = orders.find((o: any) => o.displayOrderId === id || o._id === id);
      if (foundOrder) {
        const merged = mergeDispatch(foundOrder);
        setCurrentOrder(merged);
        setAssignedDriver(merged.assignedPartner || null);
        setLastUpdated(new Date());
      } else {
        setError("Order not found");
      }
    } catch {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  // Poll localStorage every 2s so driver card appears the moment Admin assigns
  const startLsPolling = (id: string) => {
    if (lsPollingRef.current) clearInterval(lsPollingRef.current);
    lsPollingRef.current = setInterval(() => {
      const dispatch = checkLocalDispatch(id);
      if (dispatch && (!assignedDriver || assignedDriver.name !== dispatch.partner?.name)) {
        setAssignedDriver(dispatch.partner);
        setCurrentOrder((prev: any) => prev
          ? { ...prev, assignedPartner: dispatch.partner, status: dispatch.status || prev.status }
          : prev
        );
      }
    }, 2000);
  };

  const handleSearch = async () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    await fetchOrder(searchOrderId);
    pollingRef.current = setInterval(() => fetchOrder(searchOrderId), 10000);
    startLsPolling(searchOrderId);
  };

  useEffect(() => {
    if (orderId) {
      setSearchOrderId(orderId);
      fetchOrder(orderId);
      pollingRef.current = setInterval(() => fetchOrder(orderId), 10000);
      startLsPolling(orderId);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (lsPollingRef.current) clearInterval(lsPollingRef.current);
    };
    // eslint-disable-next-line
  }, [orderId]);

  const getOrderProgress = (status: string) => {
    const stages = ['queued', 'preparing', 'ready', 'out_for_delivery'];
    const currentIndex = stages.indexOf(status);
    return stages.map((stage, index) => ({
      stage,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const progressMeta = useMemo(() => {
    if (!currentOrder) return { progress: [], percent: 0 };
    const progress = getOrderProgress(currentOrder.status);
    const activeIndex = progress.findIndex((p) => p.active);
    if (activeIndex === -1 || progress.length <= 1) {
      return { progress, percent: 0 };
    }
    const percent = (activeIndex / (progress.length - 1)) * 100;
    return { progress, percent };
  }, [currentOrder]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 page-fade-up pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Track Your Order</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Live updates from the kitchen to the pickup counter.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Live tracking
            </div>
          </div>
          
          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Order ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    placeholder="e.g., 20240710-001"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={loading || !searchOrderId}>
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Track Order"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Results */}
          {currentOrder ? (
            <div className="space-y-6">
              <Card className="page-fade-up stagger-1 transition-all duration-300 hover:border-sienna/20">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <CardTitle>Order Progress</CardTitle>
                      <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50">
                        <MapPin className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                    {lastUpdated && (
                      <p className="text-xs text-muted-foreground">
                        Last updated {lastUpdated.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-8">
                    <div className="flex items-center justify-between">
                      {progressMeta.progress.map((item, index) => (
                        <div key={item.stage} className="relative flex flex-col items-center flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${
                              item.completed
                                ? item.active
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-emerald-500 text-white border-emerald-500"
                                : "bg-muted text-muted-foreground border-muted"
                            }`}
                          >
                            {item.completed ? (
                              item.active ? (
                                <Clock className="w-6 h-6" />
                              ) : (
                                <CheckCircle2 className="w-6 h-6" />
                              )
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="text-center">
                            <p
                              className={`font-medium text-sm ${
                                item.completed ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {item.stage === "queued" && "Queued"}
                              {item.stage === "preparing" && "Preparing"}
                              {item.stage === "ready" && "Ready"}
                              {item.stage === "out_for_delivery" && "On the Way"}
                            </p>
                          </div>
                          {index < progressMeta.progress.length - 1 && (
                            <div
                              className={`absolute top-6 left-1/2 right-[-50%] h-0.5 ${
                                progressMeta.progress[index + 1]?.completed
                                  ? "bg-emerald-500"
                                  : "bg-muted"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary via-emerald-500 to-primary transition-all duration-500"
                        style={{ width: `${progressMeta.percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Status refreshes automatically every 10 seconds while this page is open.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    {currentOrder.status === 'ready' ? (
                      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <Badge className="bg-success text-success-foreground mb-2">
                          Ready for Pickup!
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Your order is ready. Please come to the restaurant to collect it.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                        <Badge className="bg-warning text-warning-foreground mb-2">
                          Estimated Time: {currentOrder.timeRequired ? currentOrder.timeRequired : 'N/A'} minutes
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          We're working on your order. You'll be notified when it's ready.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Driver card — hidden until Admin manually assigns via Dispatch tab */}
              {assignedDriver ? (
                <Card className="border-sienna/30 bg-sienna/5 page-fade-up stagger-2 transition-all duration-300 hover:border-sienna/50 hover:shadow-lg hover:shadow-sienna/10">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-sienna/20 flex items-center justify-center text-sienna">
                          <Bike className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-sienna font-medium tracking-widest uppercase mb-0.5">Driver Assigned</p>
                          <p className="text-cream font-semibold text-base">{assignedDriver.name}</p>
                          <p className="text-muted-foreground text-sm">{assignedDriver.phone}</p>
                        </div>
                      </div>
                      <a href={`tel:${assignedDriver.phone}`}>
                        <Button className="bg-sienna hover:bg-sienna/80 text-cream rounded-full gap-2 shadow-lg shadow-sienna/25">
                          <Phone className="w-4 h-4" />
                          Call Driver
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ) : currentOrder.status !== 'picked' && (
                // Searching state — shown while Admin hasn't dispatched yet
                <Card className="border-white/10 bg-white/3">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-sienna/40 border-t-sienna animate-spin shrink-0" />
                    <div>
                      <p className="text-cream font-medium text-sm">Searching for nearby delivery partners...</p>
                      <p className="text-muted-foreground text-xs mt-0.5">The admin will assign a driver shortly. This updates automatically.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="page-fade-up stagger-3 transition-all duration-300 hover:border-sienna/20">
                <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
                <CardContent>
                  <div className="mb-2"><strong>Order Number:</strong> {currentOrder.displayOrderId || currentOrder._id}</div>
                  <div className="mb-2"><strong>Status:</strong> {currentOrder.status}</div>
                  <div className="mb-2"><strong>Customer:</strong> {currentOrder.customer?.name} ({currentOrder.customer?.phone})</div>
                  <div className="mb-2"><strong>Items:</strong></div>
                  <ul className="mb-2 pl-4 list-disc">
                    {currentOrder.items.map((item: any, idx: number) => (
                      <li key={idx}>{item.name} x{item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}</li>
                    ))}
                  </ul>
                  <div className="mb-2"><strong>Total:</strong> ₹{currentOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}</div>
                  {currentOrder.timeRequired && (
                    <div className="mb-2"><strong>Estimated Time:</strong> {currentOrder.timeRequired} minutes</div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-xl text-muted-foreground mb-4">
                  {error}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your Order ID and try again.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground mb-4">
                  Enter your Order ID to track your order
                </p>
                <p className="text-sm text-muted-foreground">
                  You can find your Order ID in the confirmation email or message.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}