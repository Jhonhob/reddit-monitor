import { Lead, EnrichmentData, ToolResult } from '../types/index.js';
export declare class EnrichmentService {
    private providers;
    private fallbackProviders;
    private cacheEnabled;
    private cacheTTL;
    private cache;
    constructor(config: {
        providers?: string[];
        fallbackProviders?: string[];
        cacheEnabled?: boolean;
        cacheTTL?: number;
    });
    /**
     * Enrich a single lead with additional data
     */
    enrich(lead: Lead): Promise<ToolResult<EnrichmentData>>;
    /**
     * Enrich multiple leads in batch
     */
    enrichBatch(leads: Lead[], concurrency?: number): Promise<ToolResult<Map<string, EnrichmentData>>>;
    /**
     * Enrich using a specific provider
     */
    private enrichWithProvider;
    /**
     * Check if enrichment data has meaningful content
     */
    private hasMeaningfulData;
    /**
     * Generate cache key from lead
     */
    private getCacheKey;
    /**
     * Get cached data if valid
     */
    private getCached;
    /**
     * Set cache entry
     */
    private setCache;
    /**
     * Chunk array for concurrent processing
     */
    private chunkArray;
    /**
     * Simulate API delay
     */
    private simulateApiDelay;
    /**
     * Get random company size
     */
    private getRandomCompanySize;
    /**
     * Get random revenue
     */
    private getRandomRevenue;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Get cache stats
     */
    getCacheStats(): {
        size: number;
        keys: string[];
    };
}
export default EnrichmentService;
//# sourceMappingURL=enrichment.d.ts.map