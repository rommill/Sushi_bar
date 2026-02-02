import { useEffect, useState } from "react";
import "./AdminOrders.css";

interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ФУНКЦИЯ ЗАГРУЗКИ (она была потеряна)
  const fetchOrders = async () => {
    try {
      setOrders([]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. ФУНКЦИЯ ОБНОВЛЕНИЯ СТАТУСА
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // 3. ФУНКЦИЯ УДАЛЕНИЯ (АРХИВАЦИИ)
  const handleCompleteOrder = async (id: string) => {
    if (!window.confirm("Mark this order as completed?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOrders((prev) => prev.filter((order) => order.id !== id));
      }
    } catch (error) {
      alert("Failed to complete order");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Kitchen Dashboard</h1>
        <div className="admin-stats">Active Orders: {orders.length}</div>
      </header>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className={`order-card status-${order.status}`}>
            <div className="order-card-header">
              <span className="order-no">{order.orderNumber}</span>

              <div className="status-actions">
                {order.status === "confirmed" && (
                  <button
                    className="status-btn cooking"
                    onClick={() => updateStatus(order.id, "cooking")}
                  >
                    Start Cooking
                  </button>
                )}
                {order.status === "cooking" && (
                  <button
                    className="status-btn ready"
                    onClick={() => updateStatus(order.id, "ready")}
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    className="status-btn complete"
                    onClick={() => handleCompleteOrder(order.id)}
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>

            <div className="order-customer">
              <strong>{order.customer?.name}</strong>
              <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
            </div>

            <div className="order-items">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="item-row">
                  <span className="qty">{item.quantity}x</span> {item.name}
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span className="order-total">€{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
