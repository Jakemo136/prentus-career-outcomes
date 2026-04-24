import type {
  Cohort,
  InstitutionSnapshot,
  SourceHealth,
} from '../types/readiness'

/**
 * Static institution snapshot for the prototype.
 *
 * Numbers are tuned so the demo narrative lands:
 * - institution-wide Verified Earnings Coverage is in the low 60s (the
 *   pressure point); Outcomes Coverage is noticeably higher, reinforcing
 *   that raw coverage ≠ verified coverage;
 * - Cybersecurity and one cohort of Software Engineering are at-risk;
 * - Verified Earnings is the lowest-coverage / highest-trust source,
 *   which explains *why* the institution's verified coverage is thin.
 */

export const MOCK_SOURCES: SourceHealth[] = [
  {
    id: 'verified-earnings',
    name: 'Verified Earnings',
    coveragePct: 28,
    lastRefreshedAt: '2026-04-12',
    trust: 'high',
    hasIssue: true,
    issueNote: 'Coverage below 40% — fewest records of any source.',
    issueSeverity: 'warning',
  },
  {
    id: 'surveys',
    name: 'Surveys',
    coveragePct: 54,
    lastRefreshedAt: '2026-04-18',
    trust: 'medium',
    hasIssue: false,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Scans',
    coveragePct: 71,
    lastRefreshedAt: '2026-04-22',
    trust: 'medium',
    hasIssue: false,
  },
  {
    id: 'self-report',
    name: 'Student Self-Report',
    coveragePct: 82,
    lastRefreshedAt: '2026-03-08',
    trust: 'low',
    hasIssue: true,
    issueNote: 'Last refreshed 47 days ago.',
    issueSeverity: 'caution',
  },
]

export const MOCK_COHORTS: Cohort[] = [
  {
    id: 'fs-sp25',
    program: 'Full-Stack Web Development',
    term: 'Spring 2025',
    graduates: 48,
    verifiedEarningsCoveragePct: 76,
    outcomesCoveragePct: 94,
    staleMissingPct: 6,
    placementRatePct: 89,
    trend: 'up',
    risk: 'on-track',
    sourceMix: {
      'verified-earnings': 42,
      surveys: 68,
      linkedin: 88,
      'self-report': 94,
    },
    suggestedAction:
      'Maintain current verification cadence; flagship cohort — use as benchmark.',
    lastVerifiedAt: '2026-04-18',
  },
  {
    id: 'fs-f24',
    program: 'Full-Stack Web Development',
    term: 'Fall 2024',
    graduates: 52,
    verifiedEarningsCoveragePct: 71,
    outcomesCoveragePct: 91,
    staleMissingPct: 9,
    placementRatePct: 86,
    trend: 'flat',
    risk: 'on-track',
    sourceMix: {
      'verified-earnings': 38,
      surveys: 62,
      linkedin: 85,
      'self-report': 91,
    },
    suggestedAction:
      'Refresh LinkedIn scan; a small cohort is approaching 6-month stale threshold.',
    lastVerifiedAt: '2026-04-10',
  },
  {
    id: 'da-sp25',
    program: 'Data Analytics',
    term: 'Spring 2025',
    graduates: 34,
    verifiedEarningsCoveragePct: 68,
    outcomesCoveragePct: 82,
    staleMissingPct: 14,
    placementRatePct: 79,
    trend: 'up',
    risk: 'on-track',
    sourceMix: {
      'verified-earnings': 34,
      surveys: 56,
      linkedin: 74,
      'self-report': 82,
    },
    suggestedAction:
      'Push a survey round to lift outcomes coverage above 90%.',
    lastVerifiedAt: '2026-04-15',
  },
  {
    id: 'da-f24',
    program: 'Data Analytics',
    term: 'Fall 2024',
    graduates: 29,
    verifiedEarningsCoveragePct: 51,
    outcomesCoveragePct: 73,
    staleMissingPct: 24,
    placementRatePct: 72,
    trend: 'down',
    risk: 'watch',
    sourceMix: {
      'verified-earnings': 22,
      surveys: 48,
      linkedin: 66,
      'self-report': 73,
    },
    suggestedAction:
      'Prioritize verified-earnings verification; 24% of records are stale.',
    lastVerifiedAt: '2026-03-20',
  },
  {
    id: 'ux-sp25',
    program: 'UX/UI Design',
    term: 'Spring 2025',
    graduates: 22,
    verifiedEarningsCoveragePct: 59,
    outcomesCoveragePct: 77,
    staleMissingPct: 18,
    placementRatePct: 74,
    trend: 'flat',
    risk: 'watch',
    sourceMix: {
      'verified-earnings': 28,
      surveys: 52,
      linkedin: 70,
      'self-report': 77,
    },
    suggestedAction:
      'Follow up with 4 unverified graduates; small cohort, high leverage.',
    lastVerifiedAt: '2026-04-02',
  },
  {
    id: 'ux-f24',
    program: 'UX/UI Design',
    term: 'Fall 2024',
    graduates: 24,
    verifiedEarningsCoveragePct: 62,
    outcomesCoveragePct: 80,
    staleMissingPct: 16,
    placementRatePct: 76,
    trend: 'up',
    risk: 'watch',
    sourceMix: {
      'verified-earnings': 30,
      surveys: 54,
      linkedin: 72,
      'self-report': 80,
    },
    suggestedAction:
      'Schedule LinkedIn re-scan; most outcomes are unverified beyond self-report.',
    lastVerifiedAt: '2026-04-05',
  },
  {
    id: 'cyb-sp25',
    program: 'Cybersecurity',
    term: 'Spring 2025',
    graduates: 18,
    verifiedEarningsCoveragePct: 38,
    outcomesCoveragePct: 61,
    staleMissingPct: 32,
    placementRatePct: 67,
    trend: 'down',
    risk: 'at-risk',
    sourceMix: {
      'verified-earnings': 14,
      surveys: 36,
      linkedin: 52,
      'self-report': 61,
    },
    suggestedAction:
      'Immediate triage: 32% stale, 38% verified. Launch verification outreach this week.',
    lastVerifiedAt: '2026-02-28',
  },
  {
    id: 'cyb-f24',
    program: 'Cybersecurity',
    term: 'Fall 2024',
    graduates: 21,
    verifiedEarningsCoveragePct: 42,
    outcomesCoveragePct: 64,
    staleMissingPct: 29,
    placementRatePct: 68,
    trend: 'flat',
    risk: 'at-risk',
    sourceMix: {
      'verified-earnings': 18,
      surveys: 40,
      linkedin: 56,
      'self-report': 64,
    },
    suggestedAction:
      'Root-cause verified-earnings gap; consider paid payroll-verification partner.',
    lastVerifiedAt: '2026-03-01',
  },
  {
    id: 'se-sp25',
    program: 'Software Engineering',
    term: 'Spring 2025',
    graduates: 41,
    verifiedEarningsCoveragePct: 65,
    outcomesCoveragePct: 85,
    staleMissingPct: 12,
    placementRatePct: 82,
    trend: 'up',
    risk: 'on-track',
    sourceMix: {
      'verified-earnings': 32,
      surveys: 58,
      linkedin: 78,
      'self-report': 85,
    },
    suggestedAction: 'Steady state — monitor and maintain.',
    lastVerifiedAt: '2026-04-16',
  },
  {
    id: 'se-f24',
    program: 'Software Engineering',
    term: 'Fall 2024',
    graduates: 38,
    verifiedEarningsCoveragePct: 46,
    outcomesCoveragePct: 69,
    staleMissingPct: 27,
    placementRatePct: 71,
    trend: 'down',
    risk: 'at-risk',
    sourceMix: {
      'verified-earnings': 20,
      surveys: 42,
      linkedin: 60,
      'self-report': 69,
    },
    suggestedAction:
      'Survey round + LinkedIn refresh; stale rate trending wrong direction.',
    lastVerifiedAt: '2026-03-10',
  },
]

export const MOCK_INSTITUTION: InstitutionSnapshot = {
  kpis: {
    verifiedEarningsCoverage: {
      value: 62,
      deltaPct: -3.1,
      polarity: 'higher-is-better',
      unit: '%',
    },
    outcomesCoverage: {
      value: 78,
      deltaPct: 1.2,
      polarity: 'higher-is-better',
      unit: '%',
    },
    staleMissingPct: {
      value: 18,
      deltaPct: 2.4,
      polarity: 'lower-is-better',
      unit: '%',
    },
    // 3 at-risk cohort rows in MOCK_COHORTS (cyb-sp25, cyb-f24, se-f24)
    // — the displayed count must match the table, or the narrative
    // breaks ("strip says 2, but I can see 3 in the table").
    programsAtRisk: {
      value: 3,
      deltaPct: 0,
      polarity: 'lower-is-better',
      unit: 'count',
    },
    placementRate: {
      value: 81,
      deltaPct: -0.4,
      polarity: 'higher-is-better',
      unit: '%',
    },
  },
  sources: MOCK_SOURCES,
  cohorts: MOCK_COHORTS,
}

/** Unique program names, in a stable order for filter dropdowns. */
export const MOCK_PROGRAMS: string[] = Array.from(
  new Set(MOCK_COHORTS.map((c) => c.program)),
)

/** Unique term labels, most recent first. */
export const MOCK_TERMS: string[] = [
  'Spring 2025',
  'Fall 2024',
  'Summer 2024',
  'Spring 2024',
  'Fall 2023',
].filter((t) => MOCK_COHORTS.some((c) => c.term === t))
