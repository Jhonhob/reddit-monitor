// Core Types and Interfaces

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  linkedinUrl?: string;
  website?: string;
  industry?: string;
  location?: string;
  score?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchCriteria {
  keywords?: string[];
  industries?: string[];
  locations?: string[];
  companySize?: string;
  titles?: string[];
  excludeKeywords?: string[];
}

export interface EnrichmentData {
  email?: string;
  phone?: string;
  socialProfiles?: Record<string, string>;
  companyInfo?: {
    name: string;
    size?: string;
    industry?: string;
    revenue?: string;
    description?: string;
  };
  technologies?: string[];
}

export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    source: string;
    timestamp: Date;
    confidence?: number;
  };
}

export interface AgentConfig {
  llmProvider: 'openai' | 'anthropic' | 'local';
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
  baseUrl?: string;
}

export interface DiscoveryConfig {
  sources: string[];
  maxResults: number;
  concurrency: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface EnrichmentConfig {
  providers: string[];
  fallbackProviders: string[];
  cacheEnabled: boolean;
  cacheTTL: number;
}

export interface ScoringConfig {
  criteria: ScoringCriterion[];
  weights: Record<string, number>;
  threshold: number;
}

export interface ScoringCriterion {
  name: string;
  description: string;
  weight: number;
  evaluator: (lead: Lead, enrichment: EnrichmentData) => number;
}

export interface OrchestratorConfig {
  agent: AgentConfig;
  discovery: DiscoveryConfig;
  enrichment: EnrichmentConfig;
  scoring: ScoringConfig;
  outputFormat: 'json' | 'csv' | 'table';
  verbose: boolean;
}
