export const defaultConfig = {
    agent: {
        llmProvider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000
    },
    discovery: {
        sources: ['linkedin', 'crunchbase', 'google'],
        maxResults: 100,
        concurrency: 5,
        retryAttempts: 3,
        retryDelay: 1000
    },
    enrichment: {
        providers: ['clearbit', 'hunter'],
        fallbackProviders: ['rocketreach'],
        cacheEnabled: true,
        cacheTTL: 3600000 // 1 hour
    },
    scoring: {
        criteria: [],
        weights: {
            emailValidity: 1.5,
            companyInfo: 1.2,
            titleRelevance: 1.3,
            linkedinPresence: 1.0,
            industryMatch: 1.1,
            locationMatch: 0.8,
            enrichmentQuality: 1.4
        },
        threshold: 50
    },
    outputFormat: 'json',
    verbose: true
};
export function createConfig(overrides) {
    return {
        ...defaultConfig,
        ...overrides,
        discovery: { ...defaultConfig.discovery, ...overrides.discovery },
        enrichment: { ...defaultConfig.enrichment, ...overrides.enrichment },
        scoring: { ...defaultConfig.scoring, ...overrides.scoring },
        agent: { ...defaultConfig.agent, ...overrides.agent }
    };
}
//# sourceMappingURL=default.js.map