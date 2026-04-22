import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import methodOverride from "method-override";

import { sequelize } from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express(); // ✅ MUST BE FIRST

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// EJS setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Pages
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// ✅ LOGIN HANDLER (NOW app exists)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    global.token = data.token;

    res.redirect("/tasks");
  } catch (err) {
    res.send("Login failed");
  }
});

// Tasks page
app.get("/tasks", async (req, res) => {
  try {
    if (!global.token) {
      return res.redirect("/login");
    }

    const response = await fetch("http://localhost:3000/api/tasks", {
      headers: {
        Authorization: `Bearer ${global.token}`
      }
    });

    const data = await response.json();

    const tasks = Array.isArray(data) ? data : data.tasks || [];

    res.render("tasks", { tasks });
  } catch (err) {
    console.log(err);
    res.send("Error loading tasks");
  }
});

app.get("/tasks/new", (req, res) => {
  res.render("create-task");
});

// DB + server
sequelize.sync().then(() => {
  console.log("Database connected");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.post("/tasks", async (req, res) => {
  const { title, description, status } = req.body;

  try {
    await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${global.token}`
      },
      body: JSON.stringify({ title, description, status })
    });

    res.redirect("/tasks");
  } catch (err) {
    res.send("Error creating task");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await fetch(`http://localhost:3000/api/tasks/${req.params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${global.token}`
      }
    });

    res.redirect("/tasks");
  } catch (err) {
    console.log(err);
    res.send("Error deleting task");
  }
});

app.get("/tasks/:id/edit", async (req, res) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tasks`, {
      headers: {
        Authorization: `Bearer ${global.token}`
      }
    });

    const data = await response.json();
    const tasks = Array.isArray(data) ? data : data.tasks || [];

    const task = tasks.find(t => t.id == req.params.id);

    res.render("edit-task", { task });
  } catch (err) {
    console.log(err);
    res.send("Error loading edit page");
  }
});

app.put("/tasks/:id", async (req, res) => {
  const { title, description, status } = req.body;

  try {
    await fetch(`http://localhost:3000/api/tasks/${req.params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${global.token}`
      },
      body: JSON.stringify({ title, description, status })
    });

    res.redirect("/tasks");
  } catch (err) {
    console.log(err);
    res.send("Error updating task");
  }
});