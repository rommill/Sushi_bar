import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;
const ORDERS_FILE = path.join(process.cwd(), "orders.json");

// 1. Функция загрузки
const loadOrders = () => {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
};

// 2. Функция сохранения
const saveOrders = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error saving orders:", error);
  }
};

// 3. Инициализация базы данных (ТОЛЬКО ОДИН РАЗ)
let ordersDB = loadOrders();

const menuItems = [
  {
    id: 1,
    name: "Philadelphia",
    description: "Classic roll with salmon, cream cheese and cucumber",
    price: 12,
    image: "/images/sushi/philadelphia.jpg",
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
    image: "/images/sushi/california.jpg",
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
    image: "/images/sushi/unagi-nigiri-eel.jpg",
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
    image: "/images/sushi/sake-maki.webp",
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
    image: "/images/sushi/spicy-tuna-roll.jpg",
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
    image: "/images/sushi/avocado-maki.jpg",
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
    image: "/images/sushi/salmon-sashimi.jpg",
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
    image: "/images/sushi/sakura-set.jpeg",
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

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    ordersCount: ordersDB.length,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

// Создание заказа
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
    };

    ordersDB.push(newOrder);
    saveOrders(ordersDB); // Сохраняем на диск!

    console.log(` Order saved to file: ${newOrder.orderNumber}`);

    res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

// Получение всех заказов (для админки)
app.get("/api/orders", (req, res) => {
  res.json(ordersDB.slice().reverse()); // Отдаем последние первыми
});

app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = ordersDB.length;

  ordersDB = ordersDB.filter((order) => order.id !== id);

  if (ordersDB.length < initialLength) {
    saveOrders(ordersDB);
    console.log(`✅ Order ${id} completed and removed from DB`);
    res.json({ success: true, message: "Order completed" });
  } else {
    res.status(404).json({ success: false, error: "Order not found" });
  }
});

app.patch("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const orderIndex = ordersDB.findIndex((o) => o.id === id);

  if (orderIndex !== -1) {
    ordersDB[orderIndex].status = status;
    saveOrders(ordersDB);
    console.log(
      ` Order ${ordersDB[orderIndex].orderNumber} status changed to: ${status}`,
    );
    res.json({ success: true, order: ordersDB[orderIndex] });
  } else {
    res.status(404).json({ success: false, error: "Order not found" });
  }
});

app.listen(PORT, () => {
  console.log(` Server live on port ${PORT}`);
});

export default app;
