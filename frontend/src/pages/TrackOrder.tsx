import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { OrderCard } from "@/components/OrderCard";
import { Search, Clock, MapPin, CheckCircle2 } from "lucide-react";
// import { mockOrders } from "@/data/mockData";

// Countdown timer component
function Countdown({ startTime, durationMinutes }: { startTime: string, durationMinutes: number }) {
  const calculateRemaining = () => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const end = start + durationMinutes * 60 * 1000;
    const remaining = end - now;

    if (remaining <= 0) return { minutes: 0, seconds: 0 };
    
    return {
      minutes: Math.floor((remaining / 1000 / 60) % 60),
      seconds: Math.floor((remaining / 1000) % 60)
    };
  };

  const [remaining, setRemaining] = useState(calculateRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(calculateRemaining());
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [startTime, durationMinutes]);

  return (
    <div className="text-sm text-muted-foreground">
      {/* Time remaining: {String(remaining.minutes).padStart(2, '0')}:{String(remaining.seconds).padStart(2, '0')} */}
    </div>
  );
}

export default function TrackOrder() {
  // Backend URL configured from environment
  const { orderId } = useParams();
  const [searchOrderId, setSearchOrderId] = useState(orderId || "");
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError("");
    setCurrentOrder(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`);
      if (!res.ok) throw new Error("Order not found");
      const orders = await res.json();
      const foundOrder = orders.find((order: any) => order.displayOrderId === id || order._id === id);
      if (foundOrder) {
        setCurrentOrder(foundOrder);
        setLastUpdated(new Date());
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    await fetchOrder(searchOrderId);
    // Start polling every 10 seconds
    pollingRef.current = setInterval(() => fetchOrder(searchOrderId), 10000);
  };

  useEffect(() => {
    if (orderId) {
      setSearchOrderId(orderId);
      fetchOrder(orderId);
      // Start polling every 10 seconds
      pollingRef.current = setInterval(() => fetchOrder(orderId), 10000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line
  }, [orderId]);

  const getOrderProgress = (status: string) => {
    const stages = ['queued', 'preparing', 'ready'];
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
      
      <main className="container py-8 animate-fade-up pt-24">
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
            <div className="space-y-8">
              {/* Order Progress */}
              <Card>
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
                        {currentOrder.status === 'preparing' && currentOrder.preparationStartedAt && currentOrder.timeRequired ? (
                          <Countdown startTime={currentOrder.preparationStartedAt} durationMinutes={currentOrder.timeRequired} />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            We're working on your order. You'll be notified when it's ready.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              {/* Show order details in a simple way for users */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
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