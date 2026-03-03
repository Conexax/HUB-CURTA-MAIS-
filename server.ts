import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hub_coworking.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    company TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'Ativo'
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    indicator TEXT NOT NULL,
    target TEXT NOT NULL,
    current TEXT NOT NULL,
    progress INTEGER NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS okrs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    objective TEXT NOT NULL,
    progress INTEGER NOT NULL,
    quarter TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS key_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    okr_id INTEGER,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    progress INTEGER NOT NULL,
    FOREIGN KEY (okr_id) REFERENCES okrs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS revenue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    value REAL NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    due_date TEXT NOT NULL,
    category TEXT NOT NULL,
    value REAL NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    score INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sales INTEGER NOT NULL,
    target INTEGER NOT NULL,
    revenue REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  );
`);

// Seed data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (name, email, role, company, status) VALUES (?, ?, ?, ?, ?)").run(
    "Ricardo Silva", "ricardo@hubcoworking.com", "CEO & Founder", "Hub Coworking", "Ativo"
  );
  db.prepare("INSERT INTO users (name, email, role, company, status) VALUES (?, ?, ?, ?, ?)").run(
    "Juliana Rocha", "juliana@startupx.com", "Membro", "Startup X", "Ativo"
  );

  db.prepare("INSERT INTO goals (indicator, target, current, progress, status) VALUES (?, ?, ?, ?, ?)").run(
    "Ocupação Média", "90%", "78%", 86, "Em Progresso"
  );
  db.prepare("INSERT INTO goals (indicator, target, current, progress, status) VALUES (?, ?, ?, ?, ?)").run(
    "MRR (Receita Recurrente)", "R$ 100k", "R$ 85k", 85, "Em Progresso"
  );

  const okr1 = db.prepare("INSERT INTO okrs (objective, progress, quarter) VALUES (?, ?, ?)").run(
    "Dominar o mercado de Coworking Premium em SP", 68, "Q1 2026"
  );
  db.prepare("INSERT INTO key_results (okr_id, label, value, progress) VALUES (?, ?, ?, ?)").run(
    okr1.lastInsertRowid, "Atingir 90% de ocupação média nas 3 unidades", "78%", 86
  );
  db.prepare("INSERT INTO key_results (okr_id, label, value, progress) VALUES (?, ?, ?, ?)").run(
    okr1.lastInsertRowid, "Reduzir Churn Rate para menos de 3%", "4.2%", 40
  );

  db.prepare("INSERT INTO revenue (client, date, category, value, status) VALUES (?, ?, ?, ?, ?)").run(
    "TechNova Solutions", "2026-03-02", "Assinatura", 4500, "Pago"
  );
  db.prepare("INSERT INTO revenue (client, date, category, value, status) VALUES (?, ?, ?, ?, ?)").run(
    "Juliana Rocha", "2026-03-01", "Sala Reunião", 350, "Pago"
  );

  db.prepare("INSERT INTO expenses (provider, due_date, category, value, status) VALUES (?, ?, ?, ?, ?)").run(
    "Imobiliária SP", "2026-03-10", "Aluguel", 22000, "Aberto"
  );
  db.prepare("INSERT INTO expenses (provider, due_date, category, value, status) VALUES (?, ?, ?, ?, ?)").run(
    "Enel Distribuição", "2026-03-05", "Utilidades", 1850, "Aberto"
  );

  db.prepare("INSERT INTO leads (name, company, source, status, score) VALUES (?, ?, ?, ?, ?)").run(
    "Carlos Mendes", "Mendes Advogados", "Google Ads", "Novo", 85
  );
  db.prepare("INSERT INTO leads (name, company, source, status, score) VALUES (?, ?, ?, ?, ?)").run(
    "Juliana Rocha", "Startup X", "LinkedIn", "Qualificado", 92
  );

  db.prepare("INSERT INTO opportunities (name, sales, target, revenue) VALUES (?, ?, ?, ?)").run(
    "Marcos Costa", 12, 15, 24500
  );
  db.prepare("INSERT INTO opportunities (name, sales, target, revenue) VALUES (?, ?, ?, ?)").run(
    "Juliana Rocha", 15, 15, 32200
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  // Users
  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  });
  app.post("/api/users", (req, res) => {
    const { name, email, role, company, avatar } = req.body;
    const result = db.prepare("INSERT INTO users (name, email, role, company, avatar) VALUES (?, ?, ?, ?, ?)").run(name, email, role, company, avatar);
    res.json({ id: result.lastInsertRowid });
  });
  app.delete("/api/users/:id", (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });
  app.put("/api/users/:id", (req, res) => {
    const { name, email, role, company, avatar, status } = req.body;
    db.prepare("UPDATE users SET name = ?, email = ?, role = ?, company = ?, avatar = ?, status = ? WHERE id = ?").run(name, email, role, company, avatar, status, req.params.id);
    res.json({ success: true });
  });

  // Goals
  app.get("/api/goals", (req, res) => {
    const goals = db.prepare("SELECT * FROM goals").all();
    res.json(goals);
  });
  app.post("/api/goals", (req, res) => {
    const { indicator, target, current, progress, status } = req.body;
    const result = db.prepare("INSERT INTO goals (indicator, target, current, progress, status) VALUES (?, ?, ?, ?, ?)").run(indicator, target, current, progress, status);
    res.json({ id: result.lastInsertRowid });
  });
  app.delete("/api/goals/:id", (req, res) => {
    db.prepare("DELETE FROM goals WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });
  app.put("/api/goals/:id", (req, res) => {
    const { indicator, target, current, progress, status } = req.body;
    db.prepare("UPDATE goals SET indicator = ?, target = ?, current = ?, progress = ?, status = ? WHERE id = ?").run(indicator, target, current, progress, status, req.params.id);
    res.json({ success: true });
  });

  // OKRs
  app.get("/api/okrs", (req, res) => {
    const okrs = db.prepare("SELECT * FROM okrs").all();
    const okrsWithKrs = okrs.map((okr: any) => {
      const krs = db.prepare("SELECT * FROM key_results WHERE okr_id = ?").all(okr.id);
      return { ...okr, krs };
    });
    res.json(okrsWithKrs);
  });
  app.post("/api/okrs", (req, res) => {
    const { objective, progress, quarter } = req.body;
    const result = db.prepare("INSERT INTO okrs (objective, progress, quarter) VALUES (?, ?, ?)").run(objective, progress, quarter);
    res.json({ id: result.lastInsertRowid });
  });
  app.delete("/api/okrs/:id", (req, res) => {
    db.prepare("DELETE FROM okrs WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Revenue
  app.get("/api/revenue", (req, res) => {
    const revenue = db.prepare("SELECT * FROM revenue").all();
    res.json(revenue);
  });
  app.post("/api/revenue", (req, res) => {
    const { client, date, category, value, status } = req.body;
    const result = db.prepare("INSERT INTO revenue (client, date, category, value, status) VALUES (?, ?, ?, ?, ?)").run(client, date, category, value, status);
    res.json({ id: result.lastInsertRowid });
  });
  app.delete("/api/revenue/:id", (req, res) => {
    db.prepare("DELETE FROM revenue WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });
  app.put("/api/revenue/:id", (req, res) => {
    const { client, date, category, value, status } = req.body;
    db.prepare("UPDATE revenue SET client = ?, date = ?, category = ?, value = ?, status = ? WHERE id = ?").run(client, date, category, value, status, req.params.id);
    res.json({ success: true });
  });

  // Expenses
  app.get("/api/expenses", (req, res) => {
    const expenses = db.prepare("SELECT * FROM expenses").all();
    res.json(expenses);
  });
  app.post("/api/expenses", (req, res) => {
    const { provider, due_date, category, value, status } = req.body;
    const result = db.prepare("INSERT INTO expenses (provider, due_date, category, value, status) VALUES (?, ?, ?, ?, ?)").run(provider, due_date, category, value, status);
    res.json({ id: result.lastInsertRowid });
  });
  app.delete("/api/expenses/:id", (req, res) => {
    db.prepare("DELETE FROM expenses WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });
  app.put("/api/expenses/:id", (req, res) => {
    const { provider, due_date, category, value, status } = req.body;
    db.prepare("UPDATE expenses SET provider = ?, due_date = ?, category = ?, value = ?, status = ? WHERE id = ?").run(provider, due_date, category, value, status, req.params.id);
    res.json({ success: true });
  });

  // Leads
  app.get("/api/leads", (req, res) => {
    const leads = db.prepare("SELECT * FROM leads").all();
    res.json(leads);
  });
  app.post("/api/leads", (req, res) => {
    const { name, company, source, status, score } = req.body;
    const result = db.prepare("INSERT INTO leads (name, company, source, status, score) VALUES (?, ?, ?, ?, ?)").run(name, company, source, status, score);
    res.json({ id: result.lastInsertRowid });
  });
  app.delete("/api/leads/:id", (req, res) => {
    db.prepare("DELETE FROM leads WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });
  app.put("/api/leads/:id", (req, res) => {
    const { name, company, source, status, score } = req.body;
    db.prepare("UPDATE leads SET name = ?, company = ?, source = ?, status = ?, score = ? WHERE id = ?").run(name, company, source, status, score, req.params.id);
    res.json({ success: true });
  });

  // Opportunities
  app.get("/api/opportunities", (req, res) => {
    const opportunities = db.prepare("SELECT * FROM opportunities").all();
    res.json(opportunities);
  });
  app.post("/api/opportunities", (req, res) => {
    const { name, sales, target, revenue } = req.body;
    const result = db.prepare("INSERT INTO opportunities (name, sales, target, revenue) VALUES (?, ?, ?, ?)").run(name, sales, target, revenue);
    res.json({ id: result.lastInsertRowid });
  });
  app.delete("/api/opportunities/:id", (req, res) => {
    db.prepare("DELETE FROM opportunities WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    res.json(settings);
  });
  app.post("/api/settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
