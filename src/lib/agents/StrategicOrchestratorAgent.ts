import { BaseAgent } from './BaseAgent.js';
import db from '../db.js';

export class StrategicOrchestratorAgent extends BaseAgent {
  constructor() {
    super('Strategic Orchestrator');
  }

  async run(context: { cycle: string }) {
    this.log(`Starting planning cycle: ${context.cycle}`, undefined, 'CYCLE_START');
    
    const companies = db.prepare('SELECT id FROM companies').all() as { id: string }[];
    
    for (const company of companies) {
      this.log(`Activating agents for ${company.id}`, company.id, 'ACTIVATION');
      // In a real system, this would trigger other agents
    }
    
    this.log(`Planning cycle ${context.cycle} initialized across portfolio`, undefined, 'CYCLE_COMPLETE');
  }
}
