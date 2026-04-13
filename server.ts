import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Razorpay
  let razorpay: Razorpay | null = null;
  
  const getRazorpay = () => {
    if (!razorpay) {
      const key_id = process.env.RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!key_id || !key_secret) {
        console.warn("Razorpay keys not found. Using test mode keys for demo purposes.");
        // Fallback to dummy keys if not provided to prevent crash, but warn user
        razorpay = new Razorpay({
          key_id: key_id || "rzp_test_dummy_key_id",
          key_secret: key_secret || "dummy_secret"
        });
      } else {
        razorpay = new Razorpay({ key_id, key_secret });
      }
    }
    return razorpay;
  };

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

  app.post("/api/create-razorpay-order", async (req, res) => {
    try {
      const { amount, currency = "INR" } = req.body;
      const rzp = getRazorpay();
      
      const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
        currency,
        receipt: `receipt_${Date.now()}`
      };
      
      const order = await rzp.orders.create(options);
      res.json({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
        key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key_id"
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  });

  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, text } = req.body;

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ error: "Email credentials not configured on the server. Please set EMAIL_USER and EMAIL_PASS in your environment variables." });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Sanskriti's Pizza" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending email:", error);
      if (error.message && error.message.includes('Invalid login')) {
        res.status(500).json({ error: "Authentication failed. Please ensure you are using a Google App Password (16 characters) in the EMAIL_PASS environment variable, NOT your regular Gmail password." });
      } else {
        res.status(500).json({ error: "Failed to send email. Please check server logs." });
      }
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
