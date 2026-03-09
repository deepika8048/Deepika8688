import db from './db.js';
import { addMonths, format, startOfMonth } from 'date-fns';

const COMPANIES = [
  { id: 'cloudcrm_inc', name: 'CloudCRM Inc', revenue: 35000000, growth: 0.45, industry: 'SaaS', margin: 0.72 },
  { id: 'manufacturetech_co', name: 'ManufactureTech Co', revenue: 95000000, growth: 0.08, industry: 'Manufacturing', margin: 0.35 },
  { id: 'healthcaretech', name: 'HealthcareTech Solutions', revenue: 55000000, growth: 0.25, industry: 'Healthcare IT', margin: 0.55 },
  { id: 'ecommerce_logistics', name: 'E-commerce Logistics', revenue: 140000000, growth: 0.15, industry: 'Logistics', margin: 0.22 },
  { id: 'fintech_payments', name: 'FinTech Payments', revenue: 28000000, growth: 0.85, industry: 'FinTech', margin: 0.65 },
  { id: 'industrial_services', name: 'Industrial Services Group', revenue: 180000000, growth: 0.05, industry: 'Services', margin: 0.28 },
];

function getSeasonality(industry: string): number[] {
  if (industry === 'SaaS') return [0.98, 0.97, 1.00, 1.00, 1.01, 1.00, 0.99, 1.00, 1.01, 1.02, 1.02, 1.05];
  if (industry === 'Logistics') return [0.95, 0.96, 0.98, 1.00, 1.02, 1.03, 1.05, 1.05, 1.03, 1.02, 1.05, 1.10];
  return [0.97, 0.98, 0.99, 1.00, 1.00, 1.01, 1.01, 1.01, 1.02, 1.02, 1.03, 1.04];
}

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  db.prepare('DELETE FROM companies').run();
  db.prepare('DELETE FROM financial_data').run();
  db.prepare('DELETE FROM kpis').run();
  db.prepare('DELETE FROM drivers').run();
  db.prepare('DELETE FROM budgets').run();
  db.prepare('DELETE FROM initiatives').run();
  db.prepare('DELETE FROM strategic_plans').run();

  const insertCompany = db.prepare('INSERT INTO companies (id, name, industry, revenue_base, growth_rate, margin_base) VALUES (?, ?, ?, ?, ?, ?)');
  const insertFinancial = db.prepare('INSERT INTO financial_data (company_id, period, metric, value) VALUES (?, ?, ?, ?)');
  const insertKpi = db.prepare('INSERT INTO kpis (company_id, period, kpi_name, value, target) VALUES (?, ?, ?, ?, ?)');
  const insertDriver = db.prepare('INSERT INTO drivers (company_id, period, driver_name, value) VALUES (?, ?, ?, ?)');
  const insertBudget = db.prepare('INSERT INTO budgets (company_id, department, category, month, value) VALUES (?, ?, ?, ?, ?)');
  const insertInitiative = db.prepare('INSERT INTO initiatives (company_id, name, category, start_date, investment, revenue_impact, irr, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertPlan = db.prepare('INSERT INTO strategic_plans (company_id, year, metric, value) VALUES (?, ?, ?, ?)');

  const startDate = startOfMonth(new Date(2023, 0, 1));

  for (const company of COMPANIES) {
    insertCompany.run(company.id, company.name, company.industry, company.revenue, company.growth, company.margin);

    const seasonality = getSeasonality(company.industry);
    const baseMonthlyRevenue = company.revenue / 12;

    for (let i = 0; i < 36; i++) {
      const date = addMonths(startDate, i);
      const period = format(date, 'yyyy-MM');
      const monthIdx = date.getMonth();
      const trend = Math.pow(1 + company.growth, i / 12);
      const season = seasonality[monthIdx];
      const random = 0.96 + Math.random() * 0.08;

      const revenue = baseMonthlyRevenue * trend * season * random;
      const cogs = revenue * (1 - company.margin) * (0.97 + Math.random() * 0.06);
      const gp = revenue - cogs;
      const opex = gp * (0.6 + Math.random() * 0.2);
      const ebitda = gp - opex;

      insertFinancial.run(company.id, period, 'revenue', revenue);
      insertFinancial.run(company.id, period, 'cogs', cogs);
      insertFinancial.run(company.id, period, 'gross_profit', gp);
      insertFinancial.run(company.id, period, 'ebitda', ebitda);
      insertFinancial.run(company.id, period, 'net_income', ebitda * 0.75);

      // KPIs
      insertKpi.run(company.id, period, 'ebitda_margin', ebitda / revenue, 0.2);
      insertKpi.run(company.id, period, 'revenue_growth', company.growth, company.growth + 0.05);

      // Drivers
      insertDriver.run(company.id, period, 'headcount', Math.floor(revenue / 200000));
    }

    // Budgets
    const depts = ['Sales', 'Marketing', 'Engineering', 'G&A'];
    for (const dept of depts) {
      for (let m = 1; m <= 12; m++) {
        insertBudget.run(company.id, dept, 'Salaries', m, baseMonthlyRevenue * 0.1);
        insertBudget.run(company.id, dept, 'Software', m, baseMonthlyRevenue * 0.02);
      }
    }

    // Initiatives
    insertInitiative.run(company.id, 'Enterprise Tier Launch', 'Product', '2026-04-01', company.revenue * 0.05, company.revenue * 0.2, 0.45, 'Planning');

    // Strategic Plans
    for (let year = 2026; year <= 2028; year++) {
      insertPlan.run(company.id, year, 'revenue_target', company.revenue * Math.pow(1 + company.growth, year - 2025));
    }
  }

  console.log('Seeding complete.');
}

seed().catch(console.error);
