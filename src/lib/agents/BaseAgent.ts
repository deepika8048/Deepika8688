import { GoogleGenAI } from '@google/genai';
import db from '../db.js';

export abstract class BaseAgent {
  protected ai: GoogleGenAI;
  protected name: string;

  constructor(name: string) {
    this.name = name;
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  protected log(message: string, companyId?: string, type: string = 'INFO') {
    db.prepare('INSERT INTO agent_activity (agent_name, activity_type, message, company_id) VALUES (?, ?, ?, ?)')
      .run(this.name, type, message, companyId || null);
  }

  abstract run(context: any): Promise<void>;
}
