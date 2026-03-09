import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('fpa.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    revenue_base REAL,
    growth_rate REAL,
    margin_base REAL
  );

  CREATE TABLE IF NOT EXISTS financial_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    period TEXT NOT NULL,
    metric TEXT NOT NULL,
    value REAL NOT NULL,
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS kpis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    period TEXT NOT NULL,
    kpi_name TEXT NOT NULL,
    value REAL NOT NULL,
    target REAL NOT NULL,
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    period TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    value REAL NOT NULL,
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    month INTEGER NOT NULL,
    value REAL NOT NULL,
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS initiatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    start_date TEXT NOT NULL,
    investment REAL NOT NULL,
    revenue_impact REAL NOT NULL,
    irr REAL NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS strategic_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    metric TEXT NOT NULL,
    value REAL NOT NULL,
    FOREIGN KEY(company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS agent_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    agent_name TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    message TEXT NOT NULL,
    company_id TEXT
  );
`);

export default db;
