// Lead Discovery Module
// Handles finding potential leads from various sources

import axios from 'axios';
import { Lead, SearchCriteria, ToolResult } from '../types/index.js';

export class DiscoveryService {
  private maxResults: number;
  private concurrency: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(config: {
    maxResults?: number;
    concurrency?: number;
    retryAttempts?: number;
    retryDelay?: number;
  }) {
    this.maxResults = config.maxResults ?? 100;
    this.concurrency = config.concurrency ?? 5;
    this.retryAttempts = config.retryAttempts ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;
  }

  /**
   * Search for leads based on criteria
   */
  async search(criteria: SearchCriteria): Promise<ToolResult<Lead[]>> {
    try {
      const leads: Lead[] = [];

      // Simulate discovery from multiple sources
      // In production, integrate with actual APIs (LinkedIn, Crunchbase, etc.)
      
      if (criteria.keywords) {
        const keywordLeads = await this.searchByKeywords(criteria.keywords);
        leads.push(...keywordLeads);
      }

      if (criteria.industries) {
        const industryLeads = await this.searchByIndustry(criteria.industries);
        leads.push(...industryLeads);
      }

      if (criteria.locations) {
        const locationLeads = await this.searchByLocation(criteria.locations);
        leads.push(...locationLeads);
      }

      // Deduplicate and limit results
      const uniqueLeads = this.deduplicateLeads(leads);
      const limitedLeads = uniqueLeads.slice(0, this.maxResults);

      return {
        success: true,
        data: limitedLeads,
        metadata: {
          source: 'discovery-service',
          timestamp: new Date(),
          confidence: 0.8
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during discovery',
        metadata: {
          source: 'discovery-service',
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Search by keywords
   */
  private async searchByKeywords(keywords: string[]): Promise<Lead[]> {
    const leads: Lead[] = [];
    
    for (const keyword of keywords) {
      try {
        // Simulated API call - replace with actual implementation
        const response = await this.mockApiCall(`/search?keyword=${encodeURIComponent(keyword)}`);
        
        if (response && Array.isArray(response.results)) {
          const keywordLeads = response.results.map((item: any) => this.parseLead(item));
          leads.push(...keywordLeads);
        }
      } catch (error) {
        console.warn(`Failed to search by keyword "${keyword}":`, error);
      }
    }

    return leads;
  }

  /**
   * Search by industry
   */
  private async searchByIndustry(industries: string[]): Promise<Lead[]> {
    const leads: Lead[] = [];
    
    for (const industry of industries) {
      try {
        const response = await this.mockApiCall(`/search?industry=${encodeURIComponent(industry)}`);
        
        if (response && Array.isArray(response.results)) {
          const industryLeads = response.results.map((item: any) => this.parseLead(item));
          leads.push(...industryLeads);
        }
      } catch (error) {
        console.warn(`Failed to search by industry "${industry}":`, error);
      }
    }

    return leads;
  }

  /**
   * Search by location
   */
  private async searchByLocation(locations: string[]): Promise<Lead[]> {
    const leads: Lead[] = [];
    
    for (const location of locations) {
      try {
        const response = await this.mockApiCall(`/search?location=${encodeURIComponent(location)}`);
        
        if (response && Array.isArray(response.results)) {
          const locationLeads = response.results.map((item: any) => this.parseLead(item));
          leads.push(...locationLeads);
        }
      } catch (error) {
        console.warn(`Failed to search by location "${location}":`, error);
      }
    }

    return leads;
  }

  /**
   * Deduplicate leads by email or name+company
   */
  private deduplicateLeads(leads: Lead[]): Lead[] {
    const seen = new Set<string>();
    const unique: Lead[] = [];

    for (const lead of leads) {
      const key = lead.email 
        ? `email:${lead.email.toLowerCase()}` 
        : `name:${lead.name.toLowerCase()}:company:${lead.company?.toLowerCase() || 'unknown'}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(lead);
      }
    }

    return unique;
  }

  /**
   * Parse raw data into Lead object
   */
  private parseLead(data: any): Lead {
    const now = new Date();
    return {
      id: data.id || `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name || 'Unknown',
      email: data.email,
      phone: data.phone,
      company: data.company,
      title: data.title,
      linkedinUrl: data.linkedin_url || data.linkedinUrl,
      website: data.website,
      industry: data.industry,
      location: data.location,
      tags: data.tags || [],
      metadata: data.metadata || {},
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Mock API call with retry logic
   */
  private async mockApiCall(endpoint: string, retries = 0): Promise<any> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      // Return mock data for demonstration
      return {
        results: [
          {
            name: `Lead ${endpoint.split('=')[1] || 'Unknown'} ${retries}`,
            company: 'Tech Corp',
            title: 'Decision Maker',
            industry: 'Technology',
            location: 'San Francisco, CA'
          }
        ]
      };
    } catch (error) {
      if (retries < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retries + 1)));
        return this.mockApiCall(endpoint, retries + 1);
      }
      throw error;
    }
  }
}

export default DiscoveryService;
