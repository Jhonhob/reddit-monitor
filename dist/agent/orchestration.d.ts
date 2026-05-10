import { Lead, SearchCriteria, EnrichmentData, OrchestratorConfig, ToolResult } from '../types/index.js';
import DiscoveryService from './discovery.js';
import EnrichmentService from './enrichment.js';
import ScoringService from './scoring.js';
export declare class LeadOrchestrator {
    private discovery;
    private enrichment;
    private scoring;
    private config;
    private verbose;
    constructor(config: OrchestratorConfig);
    /**
     * Execute complete lead generation workflow
     */
    execute(criteria: SearchCriteria): Promise<ToolResult<{
        leads: Array<{
            lead: Lead;
            enrichment?: EnrichmentData;
            score: number;
            breakdown: any;
        }>;
        summary: {
            totalDiscovered: number;
            totalEnriched: number;
            totalScored: number;
            aboveThreshold: number;
            averageScore: number;
        };
    }>>;
    /**
     * Run discovery only
     */
    discoverOnly(criteria: SearchCriteria): Promise<ToolResult<Lead[]>>;
    /**
     * Run enrichment on existing leads
     */
    enrichOnly(leads: Lead[]): Promise<ToolResult<Map<string, EnrichmentData>>>;
    /**
     * Run scoring on existing leads
     */
    scoreOnly(leads: Lead[], enrichments?: Map<string, EnrichmentData>): Promise<ToolResult<Array<{
        lead: Lead;
        score: number;
        breakdown: any;
    }>>>;
    /**
     * Export leads to CSV format
     */
    exportToCSV(leads: Array<{
        lead: Lead;
        enrichment?: EnrichmentData;
        score: number;
    }>): string;
    /**
     * Export leads to JSON format
     */
    exportToJSON(leads: Array<{
        lead: Lead;
        enrichment?: EnrichmentData;
        score: number;
    }>): string;
    /**
     * Escape CSV special characters
     */
    private escapeCsv;
    /**
     * Log message if verbose mode is enabled
     */
    private log;
    /**
     * Get services for advanced usage
     */
    getServices(): {
        discovery: DiscoveryService;
        enrichment: EnrichmentService;
        scoring: ScoringService;
    };
}
export default LeadOrchestrator;
//# sourceMappingURL=orchestration.d.ts.map