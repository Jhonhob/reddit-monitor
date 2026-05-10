import { Lead, EnrichmentData, ScoringConfig, ToolResult } from '../types/index.js';
export interface ScoreBreakdown {
    totalScore: number;
    criterionScores: Record<string, {
        score: number;
        weight: number;
        weightedScore: number;
        reason?: string;
    }>;
}
export declare class ScoringService {
    private criteria;
    private weights;
    private threshold;
    constructor(config: ScoringConfig);
    /**
     * Score a single lead
     */
    score(lead: Lead, enrichment?: EnrichmentData): Promise<ToolResult<{
        score: number;
        breakdown: ScoreBreakdown;
    }>>;
    /**
     * Score multiple leads
     */
    scoreBatch(leads: Lead[], enrichments?: Map<string, EnrichmentData>): Promise<ToolResult<Array<{
        lead: Lead;
        score: number;
        breakdown: ScoreBreakdown;
    }>>>;
    /**
     * Filter leads by score threshold
     */
    filterByThreshold(scoredLeads: Array<{
        lead: Lead;
        score: number;
        breakdown: ScoreBreakdown;
    }>, threshold?: number): Array<{
        lead: Lead;
        score: number;
        breakdown: ScoreBreakdown;
    }>;
    /**
     * Get top N leads by score
     */
    getTopLeads(scoredLeads: Array<{
        lead: Lead;
        score: number;
        breakdown: ScoreBreakdown;
    }>, n: number): Array<{
        lead: Lead;
        score: number;
        breakdown: ScoreBreakdown;
    }>;
    /**
     * Get default scoring criteria
     */
    private getDefaultCriteria;
    /**
     * Get default weights
     */
    private getDefaultWeights;
    /**
     * Get human-readable reason for score
     */
    private getScoreReason;
    /**
     * Update scoring criteria
     */
    updateCriteria(criteria: ScoringConfig['criteria']): void;
    /**
     * Update weights
     */
    updateWeights(weights: Record<string, number>): void;
    /**
     * Update threshold
     */
    updateThreshold(threshold: number): void;
    /**
     * Get current configuration
     */
    getConfig(): {
        criteria: ScoringConfig['criteria'];
        weights: Record<string, number>;
        threshold: number;
    };
}
export default ScoringService;
//# sourceMappingURL=scoring.d.ts.map