import { BaseAgent } from './BaseAgent.js';
import db from '../db.js';

export class KPITrackingAgent extends BaseAgent {
  constructor() {
    super('KPI Tracker');
  }

  async run(context: { companyId: string }) {
    this.log(`Monitoring KPIs for ${context.companyId}`, context.companyId, 'MONITORING');
    
    const kpis = db.prepare(`
      SELECT kpi_name, value, target 
      FROM kpis 
      WHERE company_id = ? 
      ORDER BY period DESC 
      LIMIT 10
    `).all(context.companyId) as { kpi_name: string, value: number, target: number }[];

    for (const kpi of kpis) {
      const variance = (kpi.value - kpi.target) / kpi.target;
      if (Math.abs(variance) > 0.1) {
        const status = variance > 0 ? 'ABOVE' : 'BELOW';
        this.log(`KPI Alert: ${kpi.kpi_name} is ${Math.abs(variance * 100).toFixed(1)}% ${status} target`, context.companyId, 'ALERT');
      }
    }
  }
}
