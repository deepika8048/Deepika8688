import { BaseAgent } from './BaseAgent.js';
import db from '../db.js';

export class RevenueForecastingAgent extends BaseAgent {
  constructor() {
    super('Revenue Forecaster');
  }

  async run(context: { companyId: string }) {
    this.log(`Analyzing revenue trends for ${context.companyId}`, context.companyId, 'ANALYSIS');
    
    const history = db.prepare(`
      SELECT period, value 
      FROM financial_data 
      WHERE company_id = ? AND metric = 'revenue' 
      ORDER BY period DESC 
      LIMIT 12
    `).all(context.companyId) as { period: string, value: number }[];

    const prompt = `
      You are a Revenue Forecasting Agent for an FP&A platform.
      Analyze the following 12-month revenue history for company ${context.companyId}:
      ${JSON.stringify(history)}
      
      Provide a brief strategic insight (1-2 sentences) about the trend and a forecast for the next 3 months.
      Format: JSON { "insight": "...", "forecast": [val1, val2, val3] }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const result = JSON.parse(response.text || '{}');
      this.log(`Insight: ${result.insight}`, context.companyId, 'INSIGHT');
      
      // Store forecast in a real app, here we just log
    } catch (error) {
      this.log(`Error during revenue analysis: ${error}`, context.companyId, 'ERROR');
    }
  }
}
