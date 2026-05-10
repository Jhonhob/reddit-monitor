// Main entry point for LeadHunter OS (Node.js/TypeScript version)
import { LeadOrchestrator } from './agent/index.js';
import { createConfig } from './config/default.js';
async function main() {
    console.log('🚀 LeadHunter OS - Node.js Edition');
    console.log('=====================================');
    // Create orchestrator with default config
    const config = createConfig({
        verbose: true,
        discovery: {
            maxResults: 10,
            sources: ['linkedin', 'crunchbase'],
            concurrency: 5,
            retryAttempts: 3,
            retryDelay: 1000
        },
        scoring: {
            threshold: 40,
            criteria: [],
            weights: {
                emailValidity: 1.5,
                companyInfo: 1.2,
                titleRelevance: 1.3,
                linkedinPresence: 1.0,
                industryMatch: 1.1,
                locationMatch: 0.8,
                enrichmentQuality: 1.4
            }
        }
    });
    const orchestrator = new LeadOrchestrator(config);
    // Define search criteria
    const criteria = {
        keywords: ['SaaS', 'AI', 'B2B'],
        industries: ['Technology', 'Software'],
        locations: ['San Francisco', 'New York'],
        titles: ['CEO', 'CTO', 'Founder', 'VP']
    };
    console.log('\n📋 Search Criteria:');
    console.log(`   Keywords: ${criteria.keywords?.join(', ')}`);
    console.log(`   Industries: ${criteria.industries?.join(', ')}`);
    console.log(`   Locations: ${criteria.locations?.join(', ')}`);
    console.log(`   Titles: ${criteria.titles?.join(', ')}`);
    console.log();
    try {
        // Execute the complete workflow
        const result = await orchestrator.execute(criteria);
        if (result.success && result.data) {
            const { leads, summary } = result.data;
            console.log('\n✅ Results Summary:');
            console.log(`   Total Discovered: ${summary.totalDiscovered}`);
            console.log(`   Total Enriched: ${summary.totalEnriched}`);
            console.log(`   Total Scored: ${summary.totalScored}`);
            console.log(`   Above Threshold: ${summary.aboveThreshold}`);
            console.log(`   Average Score: ${summary.averageScore}`);
            console.log('\n🎯 Top Leads:');
            leads.slice(0, 5).forEach((item, index) => {
                console.log(`\n   ${index + 1}. ${item.lead.name} (${item.lead.title})`);
                console.log(`      Company: ${item.lead.company}`);
                console.log(`      Email: ${item.lead.email || item.enrichment?.email || 'N/A'}`);
                console.log(`      Score: ${item.score}/100`);
                console.log(`      Location: ${item.lead.location || 'N/A'}`);
            });
            // Export example
            console.log('\n💾 Export Options:');
            console.log('   CSV Preview:');
            const csvPreview = orchestrator.exportToCSV(leads.slice(0, 3));
            console.log(csvPreview.split('\n').slice(0, 3).join('\n   '));
            console.log('\n   JSON available via orchestrator.exportToJSON(leads)');
        }
        else {
            console.error('❌ Workflow failed:', result.error);
        }
    }
    catch (error) {
        console.error('❌ Fatal error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
// Run main function
main().catch(console.error);
//# sourceMappingURL=index.js.map