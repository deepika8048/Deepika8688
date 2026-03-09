import { BaseAgent } from './BaseAgent.js';
import db from '../db.js';

export class ReportingInsightsAgent extends BaseAgent {
  constructor() {
    super('Reporting & Insights');
  }

  async run(context: { companyId: string }) {
    this.log(`Generating monthly board pack for ${context.companyId}`, context.companyId, 'REPORT_GEN');
    
    const financials = db.prepare(`
      SELECT metric, value, period 
      FROM financial_data 
      WHERE company_id = ? 
      ORDER BY period DESC 
      LIMIT 20
    `).all(context.companyId);

    const prompt = `
      You are a Reporting & Insights Agent.
      Based on the following financial data:
      ${JSON.stringify(financials)}
      
      Generate a brief executive summary for the board deck.
      Include:
      1. Key financial highlight
      2. One area of concern
      3. Strategic recommendation
      
      Format: Markdown
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });

      this.log(`Executive Summary Generated: ${response.text?.substring(0, 100)}...`, context.companyId, 'INSIGHT');
      
      // Store report in a real app
    } catch (error) {
      this.log(`Error generating report: ${error}`, context.companyId, 'ERROR');
    }
  }
}
