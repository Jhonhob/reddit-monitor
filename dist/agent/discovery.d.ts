import { Lead, SearchCriteria, ToolResult } from '../types/index.js';
export declare class DiscoveryService {
    private maxResults;
    private concurrency;
    private retryAttempts;
    private retryDelay;
    constructor(config: {
        maxResults?: number;
        concurrency?: number;
        retryAttempts?: number;
        retryDelay?: number;
    });
    /**
     * Search for leads based on criteria
     */
    search(criteria: SearchCriteria): Promise<ToolResult<Lead[]>>;
    /**
     * Search by keywords
     */
    private searchByKeywords;
    /**
     * Search by industry
     */
    private searchByIndustry;
    /**
     * Search by location
     */
    private searchByLocation;
    /**
     * Deduplicate leads by email or name+company
     */
    private deduplicateLeads;
    /**
     * Parse raw data into Lead object
     */
    private parseLead;
    /**
     * Mock API call with retry logic
     */
    private mockApiCall;
}
export default DiscoveryService;
//# sourceMappingURL=discovery.d.ts.map