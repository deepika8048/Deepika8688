import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './src/lib/db.js';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

import { StrategicOrchestratorAgent } from './src/lib/agents/StrategicOrchestratorAgent.js';
import { RevenueForecastingAgent } from './src/lib/agents/RevenueForecastingAgent.js';
import { KPITrackingAgent } from './src/lib/agents/KPITrackingAgent.js';

import { ReportingInsightsAgent } from './src/lib/agents/ReportingInsightsAgent.js';

const orchestrator = new StrategicOrchestratorAgent();
const revenueAgent = new RevenueForecastingAgent();
const kpiAgent = new KPITrackingAgent();
const reportingAgent = new ReportingInsightsAgent();

// Autonomous Heartbeat (Simulate background tasks)
setInterval(async () => {
  const companies = db.prepare('SELECT id FROM companies').all() as { id: string }[];
  const randomCompany = companies[Math.floor(Math.random() * companies.length)];
  
  // Randomly trigger an agent
  const rand = Math.random();
  if (rand < 0.1) {
    await kpiAgent.run({ companyId: randomCompany.id });
  } else if (rand < 0.2) {
    await revenueAgent.run({ companyId: randomCompany.id });
  } else if (rand < 0.25) {
    await reportingAgent.run({ companyId: randomCompany.id });
  }
}, 30000); // Every 30 seconds

// API Routes
app.get('/api/companies', (req, res) => {
  const companies = db.prepare('SELECT * FROM companies').all();
  res.json(companies);
});

app.get('/api/companies/:id', (req, res) => {
  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(req.params.id);
  res.json(company);
});

app.get('/api/financials/:companyId', (req, res) => {
  const data = db.prepare('SELECT * FROM financial_data WHERE company_id = ? ORDER BY period ASC').all(req.params.companyId);
  res.json(data);
});

app.get('/api/kpis/:companyId', (req, res) => {
  const data = db.prepare('SELECT * FROM kpis WHERE company_id = ? ORDER BY period ASC').all(req.params.companyId);
  res.json(data);
});

app.get('/api/drivers/:companyId', (req, res) => {
  const data = db.prepare('SELECT * FROM drivers WHERE company_id = ? ORDER BY period ASC').all(req.params.companyId);
  res.json(data);
});

app.get('/api/budgets/:companyId', (req, res) => {
  const data = db.prepare('SELECT * FROM budgets WHERE company_id = ?').all(req.params.companyId);
  res.json(data);
});

app.get('/api/initiatives/:companyId', (req, res) => {
  const data = db.prepare('SELECT * FROM initiatives WHERE company_id = ?').all(req.params.companyId);
  res.json(data);
});

app.get('/api/plans/:companyId', (req, res) => {
  const data = db.prepare('SELECT * FROM strategic_plans WHERE company_id = ?').all(req.params.companyId);
  res.json(data);
});

app.get('/api/activity', (req, res) => {
  const data = db.prepare('SELECT * FROM agent_activity ORDER BY timestamp DESC LIMIT 50').all();
  res.json(data);
});

// Agent Trigger (Simulated Autonomous Trigger)
app.post('/api/agents/trigger', async (req, res) => {
  const { agentName, companyId } = req.body;
  
  // Here we would call the specific agent logic using Gemini
  // For now, we'll just log an activity
  db.prepare('INSERT INTO agent_activity (agent_name, activity_type, message, company_id) VALUES (?, ?, ?, ?)')
    .run(agentName, 'ANALYSIS', `Agent ${agentName} started analysis for ${companyId}`, companyId);
    
  res.json({ status: 'triggered' });
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
