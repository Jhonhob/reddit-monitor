// Lead Orchestration Module
// Coordinates discovery, enrichment, and scoring workflows
import DiscoveryService from './discovery.js';
import EnrichmentService from './enrichment.js';
import ScoringService from './scoring.js';
export class LeadOrchestrator {
    discovery;
    enrichment;
    scoring;
    config;
    verbose;
    constructor(config) {
        this.config = config;
        this.verbose = config.verbose ?? false;
        this.discovery = new DiscoveryService({
            maxResults: config.discovery.maxResults,
            concurrency: config.discovery.concurrency,
            retryAttempts: config.discovery.retryAttempts,
            retryDelay: config.discovery.retryDelay
        });
        this.enrichment = new EnrichmentService({
            providers: config.enrichment.providers,
            fallbackProviders: config.enrichment.fallbackProviders,
            cacheEnabled: config.enrichment.cacheEnabled,
            cacheTTL: config.enrichment.cacheTTL
        });
        this.scoring = new ScoringService(config.scoring);
    }
    /**
     * Execute complete lead generation workflow
     */
    async execute(criteria) {
        const startTime = Date.now();
        this.log('Starting lead generation workflow...');
        try {
            // Step 1: Discovery
            this.log('Step 1: Discovering leads...');
            const discoveryResult = await this.discovery.search(criteria);
            if (!discoveryResult.success || !discoveryResult.data) {
                return {
                    success: false,
                    error: discoveryResult.error || 'Discovery failed',
                    metadata: {
                        source: 'orchestrator',
                        timestamp: new Date()
                    }
                };
            }
            const discoveredLeads = discoveryResult.data;
            this.log(`✓ Discovered ${discoveredLeads.length} leads`);
            // Step 2: Enrichment
            this.log('Step 2: Enriching leads...');
            const enrichmentResult = await this.enrichment.enrichBatch(discoveredLeads);
            if (!enrichmentResult.success || !enrichmentResult.data) {
                this.log('⚠ Enrichment had issues, continuing with available data');
            }
            const enrichments = enrichmentResult.data || new Map();
            this.log(`✓ Enriched ${enrichments.size} leads`);
            // Step 3: Scoring
            this.log('Step 3: Scoring leads...');
            const scoringResult = await this.scoring.scoreBatch(discoveredLeads, enrichments);
            if (!scoringResult.success || !scoringResult.data) {
                return {
                    success: false,
                    error: scoringResult.error || 'Scoring failed',
                    metadata: {
                        source: 'orchestrator',
                        timestamp: new Date()
                    }
                };
            }
            const scoredLeads = scoringResult.data;
            this.log(`✓ Scored ${scoredLeads.length} leads`);
            // Step 4: Filter by threshold
            const filteredLeads = this.scoring.filterByThreshold(scoredLeads);
            this.log(`✓ ${filteredLeads.length} leads above threshold (${this.config.scoring.threshold})`);
            // Build results
            const results = filteredLeads.map(item => ({
                lead: item.lead,
                enrichment: enrichments.get(item.lead.id),
                score: item.score,
                breakdown: item.breakdown
            }));
            // Calculate summary
            const summary = {
                totalDiscovered: discoveredLeads.length,
                totalEnriched: enrichments.size,
                totalScored: scoredLeads.length,
                aboveThreshold: filteredLeads.length,
                averageScore: filteredLeads.length > 0
                    ? Math.round((filteredLeads.reduce((sum, item) => sum + item.score, 0) / filteredLeads.length) * 10) / 10
                    : 0
            };
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            this.log(`✓ Workflow completed in ${duration}s`);
            this.log(`  - Average score: ${summary.averageScore}`);
            this.log(`  - Conversion rate: ${((summary.aboveThreshold / summary.totalDiscovered) * 100).toFixed(1)}%`);
            return {
                success: true,
                data: {
                    leads: results,
                    summary
                },
                metadata: {
                    source: 'orchestrator',
                    timestamp: new Date(),
                    confidence: 0.95
                }
            };
        }
        catch (error) {
            this.log('✗ Workflow failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error in orchestrator',
                metadata: {
                    source: 'orchestrator',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Run discovery only
     */
    async discoverOnly(criteria) {
        this.log('Running discovery only...');
        return this.discovery.search(criteria);
    }
    /**
     * Run enrichment on existing leads
     */
    async enrichOnly(leads) {
        this.log('Running enrichment only...');
        return this.enrichment.enrichBatch(leads);
    }
    /**
     * Run scoring on existing leads
     */
    async scoreOnly(leads, enrichments) {
        this.log('Running scoring only...');
        return this.scoring.scoreBatch(leads, enrichments);
    }
    /**
     * Export leads to CSV format
     */
    exportToCSV(leads) {
        const headers = [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Company',
            'Title',
            'Industry',
            'Location',
            'LinkedIn',
            'Score',
            'Company Size',
            'Technologies'
        ];
        const rows = leads.map(item => {
            const { lead, enrichment, score } = item;
            return [
                lead.id,
                this.escapeCsv(lead.name),
                this.escapeCsv(lead.email || ''),
                this.escapeCsv(lead.phone || ''),
                this.escapeCsv(lead.company || ''),
                this.escapeCsv(lead.title || ''),
                this.escapeCsv(lead.industry || ''),
                this.escapeCsv(lead.location || ''),
                this.escapeCsv(lead.linkedinUrl || ''),
                score.toString(),
                this.escapeCsv(enrichment?.companyInfo?.size || ''),
                this.escapeCsv(enrichment?.technologies?.join('; ') || '')
            ].join(',');
        });
        return [headers.join(','), ...rows].join('\n');
    }
    /**
     * Export leads to JSON format
     */
    exportToJSON(leads) {
        return JSON.stringify(leads, null, 2);
    }
    /**
     * Escape CSV special characters
     */
    escapeCsv(value) {
        if (!value)
            return '';
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }
    /**
     * Log message if verbose mode is enabled
     */
    log(...args) {
        if (this.verbose) {
            console.log(...args);
        }
    }
    /**
     * Get services for advanced usage
     */
    getServices() {
        return {
            discovery: this.discovery,
            enrichment: this.enrichment,
            scoring: this.scoring
        };
    }
}
export default LeadOrchestrator;
//# sourceMappingURL=orchestration.js.map