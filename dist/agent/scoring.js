// Lead Scoring Module
// Evaluates and scores leads based on configurable criteria
export class ScoringService {
    criteria;
    weights;
    threshold;
    constructor(config) {
        this.criteria = config.criteria || this.getDefaultCriteria();
        this.weights = config.weights || this.getDefaultWeights();
        this.threshold = config.threshold ?? 50;
    }
    /**
     * Score a single lead
     */
    async score(lead, enrichment) {
        try {
            const breakdown = {
                totalScore: 0,
                criterionScores: {}
            };
            // Evaluate each criterion
            for (const criterion of this.criteria) {
                const score = criterion.evaluator(lead, enrichment || {});
                const weight = this.weights[criterion.name] || criterion.weight;
                const weightedScore = score * weight;
                breakdown.criterionScores[criterion.name] = {
                    score,
                    weight,
                    weightedScore,
                    reason: this.getScoreReason(criterion.name, score)
                };
                breakdown.totalScore += weightedScore;
            }
            // Normalize to 0-100 scale
            const normalizedScore = Math.min(100, Math.max(0, breakdown.totalScore));
            return {
                success: true,
                data: {
                    score: Math.round(normalizedScore * 10) / 10,
                    breakdown
                },
                metadata: {
                    source: 'scoring-service',
                    timestamp: new Date(),
                    confidence: 0.95
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error during scoring',
                metadata: {
                    source: 'scoring-service',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Score multiple leads
     */
    async scoreBatch(leads, enrichments) {
        try {
            const results = await Promise.all(leads.map(async (lead) => {
                const enrichment = enrichments?.get(lead.id);
                const scoreResult = await this.score(lead, enrichment);
                if (scoreResult.success && scoreResult.data) {
                    return {
                        lead,
                        score: scoreResult.data.score,
                        breakdown: scoreResult.data.breakdown
                    };
                }
                return null;
            }));
            const validResults = results.filter((r) => r !== null);
            // Sort by score descending
            validResults.sort((a, b) => b.score - a.score);
            return {
                success: true,
                data: validResults,
                metadata: {
                    source: 'scoring-service',
                    timestamp: new Date(),
                    confidence: 0.9
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error during batch scoring',
                metadata: {
                    source: 'scoring-service',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Filter leads by score threshold
     */
    filterByThreshold(scoredLeads, threshold) {
        const effectiveThreshold = threshold ?? this.threshold;
        return scoredLeads.filter(item => item.score >= effectiveThreshold);
    }
    /**
     * Get top N leads by score
     */
    getTopLeads(scoredLeads, n) {
        return scoredLeads.slice(0, n);
    }
    /**
     * Get default scoring criteria
     */
    getDefaultCriteria() {
        return [
            {
                name: 'emailValidity',
                description: 'Has valid email address',
                weight: 1.5,
                evaluator: (lead) => (lead.email && lead.email.includes('@') ? 10 : 0)
            },
            {
                name: 'companyInfo',
                description: 'Has company information',
                weight: 1.2,
                evaluator: (lead) => (lead.company ? 8 : 0)
            },
            {
                name: 'titleRelevance',
                description: 'Has relevant job title',
                weight: 1.3,
                evaluator: (lead, enrichment) => {
                    const decisionTitles = ['ceo', 'cto', 'cfo', 'founder', 'director', 'vp', 'head', 'manager'];
                    const title = (lead.title || '').toLowerCase();
                    return decisionTitles.some(t => title.includes(t)) ? 9 : 5;
                }
            },
            {
                name: 'linkedinPresence',
                description: 'Has LinkedIn profile',
                weight: 1.0,
                evaluator: (lead) => (lead.linkedinUrl ? 7 : 0)
            },
            {
                name: 'industryMatch',
                description: 'Industry matches target',
                weight: 1.1,
                evaluator: (lead) => (lead.industry ? 6 : 0)
            },
            {
                name: 'locationMatch',
                description: 'Location in target region',
                weight: 0.8,
                evaluator: (lead) => (lead.location ? 5 : 0)
            },
            {
                name: 'enrichmentQuality',
                description: 'Quality of enrichment data',
                weight: 1.4,
                evaluator: (lead, enrichment) => {
                    if (!enrichment)
                        return 0;
                    let score = 0;
                    if (enrichment.email)
                        score += 3;
                    if (enrichment.phone)
                        score += 2;
                    if (enrichment.socialProfiles)
                        score += 2;
                    if (enrichment.companyInfo)
                        score += 3;
                    return Math.min(10, score);
                }
            }
        ];
    }
    /**
     * Get default weights
     */
    getDefaultWeights() {
        return {
            emailValidity: 1.5,
            companyInfo: 1.2,
            titleRelevance: 1.3,
            linkedinPresence: 1.0,
            industryMatch: 1.1,
            locationMatch: 0.8,
            enrichmentQuality: 1.4
        };
    }
    /**
     * Get human-readable reason for score
     */
    getScoreReason(criterionName, score) {
        const reasons = {
            emailValidity: {
                10: 'Valid email address present',
                0: 'No valid email address'
            },
            companyInfo: {
                8: 'Company information available',
                0: 'No company information'
            },
            titleRelevance: {
                9: 'Decision-maker title detected',
                5: 'Standard professional title'
            },
            linkedinPresence: {
                7: 'LinkedIn profile available',
                0: 'No LinkedIn profile'
            },
            industryMatch: {
                6: 'Industry information present',
                0: 'No industry information'
            },
            locationMatch: {
                5: 'Location information present',
                0: 'No location information'
            },
            enrichmentQuality: {
                10: 'Excellent enrichment data',
                8: 'Good enrichment data',
                5: 'Moderate enrichment data',
                3: 'Limited enrichment data',
                0: 'No enrichment data'
            }
        };
        return reasons[criterionName]?.[score] || `Score: ${score}`;
    }
    /**
     * Update scoring criteria
     */
    updateCriteria(criteria) {
        this.criteria = criteria;
    }
    /**
     * Update weights
     */
    updateWeights(weights) {
        this.weights = { ...this.weights, ...weights };
    }
    /**
     * Update threshold
     */
    updateThreshold(threshold) {
        this.threshold = threshold;
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return {
            criteria: this.criteria,
            weights: this.weights,
            threshold: this.threshold
        };
    }
}
export default ScoringService;
//# sourceMappingURL=scoring.js.map