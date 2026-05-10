import { describe, it, expect } from 'vitest';
import { ScoringService } from '../agent/scoring.js';
import { Lead, EnrichmentData } from '../types/index.js';

describe('ScoringService', () => {
  const mockLead: Lead = {
    id: 'test-1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Tech Corp',
    title: 'CEO',
    industry: 'Technology',
    location: 'San Francisco',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockEnrichment: EnrichmentData = {
    email: 'john@techcorp.com',
    phone: '+1-555-0100',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/johndoe'
    },
    companyInfo: {
      name: 'Tech Corp',
      size: '51-200',
      industry: 'Technology'
    },
    technologies: ['React', 'Node.js']
  };

  it('should score a lead with valid data', async () => {
    const scoring = new ScoringService({
      criteria: [],
      weights: {},
      threshold: 40
    });

    const result = await scoring.score(mockLead, mockEnrichment);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    // Score can be 0 if no criteria are defined (default behavior)
    if (result.data) {
      expect(typeof result.data.score).toBe('number');
      expect(typeof result.data.breakdown.totalScore).toBe('number');
    }
  });

  it('should score a lead without enrichment', async () => {
    const scoring = new ScoringService({
      criteria: [],
      weights: {},
      threshold: 40
    });

    const result = await scoring.score(mockLead);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should handle batch scoring', async () => {
    const scoring = new ScoringService({
      criteria: [],
      weights: {},
      threshold: 40
    });

    const leads = [mockLead, { ...mockLead, id: 'test-2', name: 'Jane Doe' }];
    const result = await scoring.scoreBatch(leads);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    if (result.data) {
      expect(result.data.length).toBe(2);
    }
  });

  it('should filter by threshold', () => {
    const scoring = new ScoringService({
      criteria: [],
      weights: {},
      threshold: 50
    });

    const scoredLeads = [
      { lead: mockLead, score: 75, breakdown: { totalScore: 75, criterionScores: {} } },
      { lead: { ...mockLead, id: 'test-2' }, score: 30, breakdown: { totalScore: 30, criterionScores: {} } }
    ];

    const filtered = scoring.filterByThreshold(scoredLeads);
    expect(filtered.length).toBe(1);
    expect(filtered[0].score).toBe(75);
  });

  it('should get top N leads', () => {
    const scoring = new ScoringService({
      criteria: [],
      weights: {},
      threshold: 0
    });

    const scoredLeads = [
      { lead: mockLead, score: 90, breakdown: { totalScore: 90, criterionScores: {} } },
      { lead: { ...mockLead, id: 'test-2' }, score: 70, breakdown: { totalScore: 70, criterionScores: {} } },
      { lead: { ...mockLead, id: 'test-3' }, score: 50, breakdown: { totalScore: 50, criterionScores: {} } }
    ];

    const top2 = scoring.getTopLeads(scoredLeads, 2);
    expect(top2.length).toBe(2);
    expect(top2[0].score).toBe(90);
    expect(top2[1].score).toBe(70);
  });
});
