// Lead Enrichment Module
// Enhances lead data with additional information from various sources

import { Lead, EnrichmentData, ToolResult } from '../types/index.js';

interface EnrichmentCache {
  data: EnrichmentData;
  timestamp: Date;
  ttl: number;
}

export class EnrichmentService {
  private providers: string[];
  private fallbackProviders: string[];
  private cacheEnabled: boolean;
  private cacheTTL: number;
  private cache: Map<string, EnrichmentCache>;

  constructor(config: {
    providers?: string[];
    fallbackProviders?: string[];
    cacheEnabled?: boolean;
    cacheTTL?: number;
  }) {
    this.providers = config.providers ?? ['default'];
    this.fallbackProviders = config.fallbackProviders ?? [];
    this.cacheEnabled = config.cacheEnabled ?? true;
    this.cacheTTL = config.cacheTTL ?? 3600000; // 1 hour in ms
    this.cache = new Map();
  }

  /**
   * Enrich a single lead with additional data
   */
  async enrich(lead: Lead): Promise<ToolResult<EnrichmentData>> {
    const cacheKey = this.getCacheKey(lead);
    
    // Check cache first
    if (this.cacheEnabled) {
      const cached = this.getCached(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          metadata: {
            source: 'cache',
            timestamp: new Date(),
            confidence: 0.95
          }
        };
      }
    }

    // Try primary providers
    for (const provider of this.providers) {
      try {
        const result = await this.enrichWithProvider(lead, provider);
        if (result && this.hasMeaningfulData(result)) {
          if (this.cacheEnabled) {
            this.setCache(cacheKey, result);
          }
          return {
            success: true,
            data: result,
            metadata: {
              source: provider,
              timestamp: new Date(),
              confidence: 0.9
            }
          };
        }
      } catch (error) {
        console.warn(`Provider ${provider} failed:`, error instanceof Error ? error.message : error);
      }
    }

    // Try fallback providers
    for (const provider of this.fallbackProviders) {
      try {
        const result = await this.enrichWithProvider(lead, provider);
        if (result && this.hasMeaningfulData(result)) {
          if (this.cacheEnabled) {
            this.setCache(cacheKey, result);
          }
          return {
            success: true,
            data: result,
            metadata: {
              source: provider,
              timestamp: new Date(),
              confidence: 0.7
            }
          };
        }
      } catch (error) {
        console.warn(`Fallback provider ${provider} failed:`, error instanceof Error ? error.message : error);
      }
    }

    return {
      success: false,
      error: 'No enrichment data found from any provider',
      metadata: {
        source: 'enrichment-service',
        timestamp: new Date()
      }
    };
  }

  /**
   * Enrich multiple leads in batch
   */
  async enrichBatch(leads: Lead[], concurrency = 5): Promise<ToolResult<Map<string, EnrichmentData>>> {
    const results = new Map<string, EnrichmentData>();
    const errors: string[] = [];

    // Process with concurrency limit
    const chunks = this.chunkArray(leads, concurrency);
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (lead) => {
        const result = await this.enrich(lead);
        if (result.success && result.data) {
          results.set(lead.id, result.data);
        } else {
          errors.push(`Failed to enrich lead ${lead.id}: ${result.error}`);
        }
      });

      await Promise.all(promises);
    }

    return {
      success: errors.length === 0,
      data: results,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      metadata: {
        source: 'enrichment-service',
        timestamp: new Date(),
        confidence: errors.length === 0 ? 0.9 : 0.7
      }
    };
  }

  /**
   * Enrich using a specific provider
   */
  private async enrichWithProvider(lead: Lead, provider: string): Promise<EnrichmentData | null> {
    // Simulate provider-specific enrichment logic
    // In production, integrate with actual APIs (Clearbit, Hunter, etc.)
    
    await this.simulateApiDelay();

    // Mock enrichment data
    const enrichment: EnrichmentData = {
      email: lead.email || `${lead.name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: lead.phone || '+1-555-0100',
      socialProfiles: {
        linkedin: lead.linkedinUrl || `https://linkedin.com/in/${lead.name.toLowerCase().replace(' ', '-')}`,
        twitter: `https://twitter.com/${lead.name.toLowerCase().replace(' ', '')}`
      },
      companyInfo: {
        name: lead.company || 'Unknown Company',
        size: this.getRandomCompanySize(),
        industry: lead.industry || 'Technology',
        revenue: this.getRandomRevenue(),
        description: `Leading company in ${lead.industry || 'technology'} sector`
      },
      technologies: ['React', 'Node.js', 'AWS', 'Docker']
    };

    return enrichment;
  }

  /**
   * Check if enrichment data has meaningful content
   */
  private hasMeaningfulData(data: EnrichmentData): boolean {
    return !!(
      data.email || 
      data.phone || 
      data.socialProfiles || 
      (data.companyInfo && Object.keys(data.companyInfo).length > 0)
    );
  }

  /**
   * Generate cache key from lead
   */
  private getCacheKey(lead: Lead): string {
    const identifier = lead.email || `${lead.name}:${lead.company}`;
    return `enrich:${identifier.toLowerCase()}`;
  }

  /**
   * Get cached data if valid
   */
  private getCached(key: string): EnrichmentData | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp.getTime();
    if (age > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache entry
   */
  private setCache(key: string, data: EnrichmentData): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl: this.cacheTTL
    });
  }

  /**
   * Chunk array for concurrent processing
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Simulate API delay
   */
  private async simulateApiDelay(): Promise<void> {
    const delay = 100 + Math.random() * 200;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Get random company size
   */
  private getRandomCompanySize(): string {
    const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  /**
   * Get random revenue
   */
  private getRandomRevenue(): string {
    const revenues = ['$1M-$5M', '$5M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'];
    return revenues[Math.floor(Math.random() * revenues.length)];
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default EnrichmentService;
