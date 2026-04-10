import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  const menu = [
    {
      id: "1",
      name: "The Vedic Veggie",
      description: "Hand-picked organic veggies, homemade mozzarella, and basil pesto.",
      price: 18.00,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400",
      category: "Veg",
      doshaRecommendation: "Vata"
    },
    {
      id: "2",
      name: "Golden Paneer Tikka",
      description: "Turmeric-infused paneer, roasted bell peppers, and creamy makhani sauce.",
      price: 20.00,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400",
      category: "Veg",
      doshaRecommendation: "Kapha"
    },
    {
      id: "3",
      name: "Ashwagandha Mushroom Truffle",
      description: "Wild mushrooms, truffle oil, and a subtle hint of ashwagandha for stress relief.",
      price: 22.00,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400",
      category: "Signature",
      doshaRecommendation: "Pitta"
    }
  ];

  const orders: any[] = [];

  // API Routes
  app.get("/api/menu", (req, res) => {
    res.json(menu);
  });

  app.post("/api/orders", (req, res) => {
    const { items, total, address, doshaCrust } = req.body;
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      items,
      total,
      address,
      doshaCrust,
      status: "Preparing",
      createdAt: new Date()
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  });

  app.get("/api/orders/:id", (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
