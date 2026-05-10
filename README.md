# LeadHunter OS - Node.js/TypeScript Edition

AI-driven Lead Hunting System migrated from Python to Node.js with TypeScript.

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns (Discovery, Enrichment, Scoring, Orchestration)
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Concurrent Processing**: Batch operations with configurable concurrency
- **Intelligent Caching**: Built-in caching for enrichment data
- **Configurable Scoring**: Flexible lead scoring with customizable criteria
- **Multiple Export Formats**: JSON and CSV export capabilities

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm run test
```

## 📖 Usage

### Basic Usage

```typescript
import { LeadOrchestrator } from './src/agent/index.js';
import { createConfig } from './src/config/default.js';

const config = createConfig({
  verbose: true,
  discovery: { maxResults: 50 },
  scoring: { threshold: 60 }
});

const orchestrator = new LeadOrchestrator(config);

const criteria = {
  keywords: ['SaaS', 'AI'],
  industries: ['Technology'],
  locations: ['San Francisco'],
  titles: ['CEO', 'CTO']
};

const result = await orchestrator.execute(criteria);
```

### Individual Services

```typescript
// Discovery only
const leads = await orchestrator.discoverOnly(criteria);

// Enrichment only
const enriched = await orchestrator.enrichOnly(leads);

// Scoring only
const scored = await orchestrator.scoreOnly(leads, enrichments);
```

### Export Data

```typescript
// Export to CSV
const csv = orchestrator.exportToCSV(leads);

// Export to JSON
const json = orchestrator.exportToJSON(leads);
```

## 🏗️ Architecture

```
src/
├── types/          # TypeScript interfaces and types
├── agent/          # Core services
│   ├── discovery.ts    # Lead discovery from sources
│   ├── enrichment.ts   # Data enrichment service
│   ├── scoring.ts      # Lead scoring engine
│   └── orchestration.ts # Workflow coordinator
├── config/         # Configuration management
└── index.ts        # Main entry point
```

## ⚙️ Configuration

```typescript
{
  agent: {
    llmProvider: 'openai' | 'anthropic' | 'local',
    model: string,
    temperature: number,
    maxTokens: number
  },
  discovery: {
    sources: string[],
    maxResults: number,
    concurrency: number,
    retryAttempts: number,
    retryDelay: number
  },
  enrichment: {
    providers: string[],
    fallbackProviders: string[],
    cacheEnabled: boolean,
    cacheTTL: number
  },
  scoring: {
    criteria: ScoringCriterion[],
    weights: Record<string, number>,
    threshold: number
  },
  outputFormat: 'json' | 'csv' | 'table',
  verbose: boolean
}
```

## 🔧 Customization

### Custom Scoring Criteria

```typescript
orchestrator.getServices().scoring.updateCriteria([
  {
    name: 'customCriterion',
    description: 'Custom scoring logic',
    weight: 1.5,
    evaluator: (lead, enrichment) => {
      // Your custom scoring logic
      return score;
    }
  }
]);
```

### Custom Weights

```typescript
orchestrator.getServices().scoring.updateWeights({
  emailValidity: 2.0,
  companyInfo: 1.5
});
```

## 🧪 Testing

```bash
npm run test
```

## 📝 Migration from Python

This is a complete rewrite from Python to Node.js/TypeScript with improvements:

- ✅ Better type safety with TypeScript
- ✅ Improved performance with async/await
- ✅ Modular architecture (split from monolithic tools.py)
- ✅ Enhanced error handling
- ✅ Built-in caching mechanism
- ✅ Configurable concurrency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT