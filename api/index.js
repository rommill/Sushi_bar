import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory база данных (для демо)
const ordersDB = [];
const menuItems = [
  {
    id: 1,
    name: "Philadelphia",
    description: "Classic roll with salmon, cream cheese and cucumber",
    price: 12,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    ingredients: ["salmon", "cream cheese", "cucumber", "nori", "rice"],
    weight: 250,
    calories: 320,
    category: "rolls",
    spicy: false,
    vegetarian: false,
    popular: true,
  },
  {
    id: 2,
    name: "California",
    description: "Roll with crab, avocado and flying fish roe",
    price: 11,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
    ingredients: ["crab", "avocado", "tobiko", "mayonnaise", "nori", "rice"],
    weight: 230,
    calories: 280,
    category: "rolls",
    spicy: false,
    vegetarian: false,
    popular: true,
  },
  {
    id: 3,
    name: "Unagi",
    description: "Nigiri with eel, glazed with unagi sauce",
    price: 7,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400",
    ingredients: ["eel", "unagi sauce", "rice"],
    weight: 80,
    calories: 180,
    category: "nigiri",
    spicy: false,
    vegetarian: false,
    popular: false,
  },
  {
    id: 4,
    name: "Sake Maki",
    description: "Simple roll with salmon",
    price: 8,
    image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400",
    ingredients: ["salmon", "nori", "rice"],
    weight: 180,
    calories: 210,
    category: "maki",
    spicy: false,
    vegetarian: false,
    popular: false,
  },
  {
    id: 5,
    name: "Spicy Tuna",
    description: "Spicy roll with tuna and spicy sauce",
    price: 10,
    image: "https://images.unsplash.com/photo-1617196035154-1e7b6cdf4e1c?w=400",
    ingredients: ["tuna", "spicy sauce", "cucumber", "nori", "rice"],
    weight: 240,
    calories: 290,
    category: "rolls",
    spicy: true,
    vegetarian: false,
    popular: true,
  },
  {
    id: 6,
    name: "Avocado Maki",
    description: "Vegetarian roll with avocado",
    price: 7,
    image: "https://images.unsplash.com/photo-1556040220-4096d5223786?w=400",
    ingredients: ["avocado", "nori", "rice"],
    weight: 160,
    calories: 190,
    category: "maki",
    spicy: false,
    vegetarian: true,
    popular: false,
  },
  {
    id: 7,
    name: "Salmon Sashimi",
    description: "Slices of fresh salmon",
    price: 9,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400",
    ingredients: ["salmon"],
    weight: 120,
    calories: 150,
    category: "sashimi",
    spicy: false,
    vegetarian: false,
    popular: true,
  },
  {
    id: 8,
    name: "Sakura Set",
    description: "Set of 24 pieces: Philadelphia, California, Sake Maki",
    price: 32,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    ingredients: [
      "salmon",
      "cream cheese",
      "crab",
      "avocado",
      "cucumber",
      "nori",
      "rice",
    ],
    weight: 600,
    calories: 850,
    category: "sets",
    spicy: false,
    vegetarian: false,
    popular: true,
  },
];

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Sushi Bar API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    ordersCount: ordersDB.length,
  });
});

// Get all menu items
app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

// Get single menu item
app.get("/api/menu/:id", (req, res) => {
  const item = menuItems.find((i) => i.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: "Menu item not found" });
  }
});

// Create a new order
app.post("/api/orders", (req, res) => {
  try {
    const { customer, items, total, deliveryAddress, contact } = req.body;

    const newOrder = {
      id: uuidv4(),
      orderNumber: `SUSHI-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      customer,
      items,
      total,
      deliveryAddress,
      contact,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(), // +45 минут
    };

    ordersDB.push(newOrder);

    console.log(`📦 New order received: ${newOrder.orderNumber} for €${total}`);

    res.status(201).json({
      success: true,
      message: "Order created successfully (test mode)",
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
        estimatedDelivery: newOrder.estimatedDelivery,
        status: newOrder.status,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
});

// Get order by ID
app.get("/api/orders/:id", (req, res) => {
  const order = ordersDB.find((o) => o.id === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// Get recent orders (last 10)
app.get("/api/orders", (req, res) => {
  const recentOrders = ordersDB
    .slice(-10)
    .reverse()
    .map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      customerName: order.customer.name,
    }));

  res.json(recentOrders);
});

// Simulate payment
app.post("/api/payment/simulate", (req, res) => {
  const { amount, currency = "EUR" } = req.body;

  res.json({
    success: true,
    message: "Payment simulation successful",
    transaction: {
      id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: "succeeded",
      timestamp: new Date().toISOString(),
      note: "This is a test transaction. No real money was charged.",
    },
  });
});

// For Vercel deployment
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("../client/dist"));

//   app.get("*", (req, res) => {
//     res.sendFile("index.html", { root: "../client/dist" });
//   });
// }

// Start server
app.listen(PORT, () => {
  console.log(`🍣 Sushi Bar API Server started on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Menu API: http://localhost:${PORT}/api/menu`);
});

// Экспорт для Vercel Serverless Functions
export default app;

// export for Vercel Serverless Functions
export default app;
