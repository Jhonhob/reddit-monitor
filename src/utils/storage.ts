import fs from 'fs';
import path from 'path';
import { Lead } from '../types';

const DB_PATH = path.join(process.cwd(), 'leads.json');

export class Storage {
  static load(): Lead[] {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static save(leads: Lead[]): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(leads, null, 2), 'utf-8');
    console.log(`💾 已保存 ${leads.length} 条线索到 leads.json`);
  }

  static append(newLeads: Lead[]): void {
    const existing = this.load();
    // 简单去重：基于 email 或 domain
    const uniqueNew = newLeads.filter(
      newLead => !existing.some(ex => ex.email === newLead.email && newLead.email)
    );
    const all = [...existing, ...uniqueNew];
    this.save(all);
  }
}
