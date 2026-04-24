# PRD: Career Outcomes Readiness Dashboard (Controlled Scope Prototype)

**Product:** Prentus Admin  
**Status:** Prototype-scoped PRD  
**Author:** ChatGPT  
**Last updated:** April 23, 2026

## 1. Summary
This prototype is a **single Admin-facing dashboard page** focused on **career outcomes compliance readiness**.

It is intentionally **not** a full Career Outcomes module. It is a controlled-scope prototype designed to demonstrate:
- strong information hierarchy
- thoughtful admin UX
- sensible assumptions under ambiguity
- a believable readiness-oriented outcomes workflow

This PRD is derived from the broader Career Outcomes module PRD and narrowed specifically to a one-page prototype. The broader PRD covered surveys, review queues, person records, verified earnings, compliance reporting, executive dashboards, widgets, and exports; this prototype does not attempt to fully implement those areas. 

## 2. Prototype Goal
Design a polished **Career Outcomes Readiness Dashboard** that helps an institutional admin quickly assess:
- whether graduate earnings can be credibly proven
- which cohorts/programs are most exposed from a compliance-readiness standpoint
- where action is needed next

## 3. Product Framing
This should be framed as a **compliance-readiness dashboard for outcomes admins**, with enough executive polish to feel productized.

It should **not** be framed primarily as a generic executive analytics dashboard.

The page should tell this story, in order:
1. **Are we safe enough?**
2. **Where are we weak?**
3. **Why are we weak?**
4. **What should we do next?**

That framing better matches the product signal in the one-pager: verified earnings, stale data, cohort tracking, and proof of outcomes.

## 4. Why this page
The one-pager and broader PRD suggest that outcomes data matters because it supports:
- earnings/accountability compliance
- accreditation and audit readiness
- cohort tracking
- exports / reporting
- executive visibility

For a take-home prototype, the highest-signal slice is the top-level dashboard that surfaces:
- verified earnings readiness
- outcomes coverage
- source health
- risk concentration

Rather than building the full module, this prototype should make the larger system feel plausible from one strong page.

## 5. Primary User
**Outcomes / Career Services Admin**

This user is responsible for monitoring outcomes data quality and readiness across cohorts/programs and needs to quickly identify:
- whether the institution has enough verified evidence
- where data is stale or incomplete
- which populations need follow-up first

## 6. Core Questions the Dashboard Should Answer
These are the highest-signal questions for this prototype:

1. **Can I prove graduate earnings with enough verified coverage?**
2. **Which programs or cohorts are most exposed because data is missing, stale, or unverified?**
3. **What should I act on first to improve readiness?**

## 7. Language / Policy Framing Guidance
For the UI and product language, use:
- **Do No Harm readiness**
- **earnings readiness**
- **verified earnings coverage**
- **compliance readiness**

Avoid presenting “Do No Harm” as a formally named standalone statute in the product UI unless citing a specific law. Safer product wording is **framework**, **readiness**, or **earnings standard**.

## 8. Scope
### In scope
A **single overview page** containing three required sections:

1. **Top readiness summary strip**
2. **Cohort / program risk table**
3. **Data pipeline / source health section**

### Optional interactions
- **Cohort drill-in**
- **Filter state**

### Out of scope
This prototype does **not** fully implement:
- review queue / inbox workflows
- person-level outcome records
- survey builder
- AI outreach workflows
- full compliance workspace
- full export flows
- widget publishing
- role/permission system
- real backend integrations
- real regulatory logic engine

Those may be hinted at in the UI, but not built as real flows.

## 9. Product Principles
- Show the institution’s readiness posture immediately.
- Make verified coverage more prominent than raw activity.
- Distinguish trustworthy data from incomplete or self-reported data.
- Prioritize actionability over completeness.
- Use UI hints to imply the larger module without expanding prototype scope.

## 10. Assumptions
To keep the prototype controlled and believable, assume:
- verified earnings can be represented as a **coverage/readiness metric**, not a full compliance filing workflow
- source trust levels can be simplified into a few understandable categories
- all data is mocked / synthetic
- exports and drill-ins can be lightweight prototype interactions
- advanced features can appear as secondary navigation items, disabled modules, or “coming soon” cards

## 11. Information Architecture
### Primary page
**Career Outcomes Readiness Dashboard**

### Suggested page layout
1. Header + page context
2. Filter bar
3. Top readiness summary strip
4. Cohort / program risk table
5. Data pipeline / source health section
6. Secondary navigation / hinted modules

## 12. Required Section 1: Top Readiness Summary Strip
This section should answer the page’s central question at a glance.

### Purpose
Provide an immediate read on:
- verified earnings readiness
- coverage completeness
- concentration of risk
- where attention is needed first

### Suggested KPIs
- **Verified Earnings Coverage**
- **Outcomes Coverage**
- **Stale / Missing Records**
- **Programs At Risk**
- optional: **Placement Rate**

### Behavioral requirements
- one KPI should clearly function as the lead metric
- the lead metric should be **verified earnings coverage** or a closely related readiness metric
- at least one KPI should express urgency or risk
- metrics should visually distinguish “trusted / verified” from “needs attention”
- raw placement should be secondary to proof quality and readiness

### Prototype intent
This strip should make a reviewer think:
> “I immediately understand whether this institution can credibly stand behind its outcomes data.”

## 13. Required Section 2: Cohort / Program Risk Table
This is the operational core of the page.

### Purpose
Help the admin identify:
- which cohorts/programs are strongest
- which are risky
- which need follow-up or verification work

### Row type
Use either:
- **programs**
- **cohorts**
- or a hybrid grouped view

For a prototype, a **program-level table with cohort context** is probably clearest.

### Suggested columns
- Program / Cohort
- Graduates
- Verified Earnings Coverage
- Outcomes Coverage
- Stale / Missing %
- Placement Rate
- Trend
- Risk Status

### Behavioral requirements
- table should support sorting or filtering in a believable way
- verified coverage and stale exposure should be visually prominent
- at least one column should directly reflect verified coverage
- at least one column should directly reflect exposure / incompleteness
- rows should visually signal which populations need attention
- ordering and hierarchy should reinforce that this is a **risk triage table**, not just a performance table

### Optional interaction: Cohort drill-in
Clicking a row opens a detail drawer/panel showing:
- summary for that cohort/program
- source mix
- verification coverage
- stale record count
- suggested next action
- simple action affordances like “Export” or “View details”

This is enough to imply a larger system without creating a second full screen.

## 14. Required Section 3: Data Pipeline / Source Health
This section ties the dashboard back to the product’s underlying story: outcomes are only useful if they are current and trustworthy.

### Purpose
Show where outcomes data is coming from and how reliable it is.

### Sources to represent
- Student Self-Report
- LinkedIn Scans
- Surveys
- Verified Earnings

### Suggested metrics per source
- coverage
- freshness / last updated
- confidence / trust level
- issue state
- trend or recent activity

### Behavioral requirements
- **Verified Earnings** should feel like the most authoritative source
- self-report, LinkedIn, and surveys should feel like supporting evidence with lower trust
- stale / aging source health should be visible
- the section should help explain *why* a cohort/program is risky, not just that it is risky

### Prototype intent
This section should make the system feel more credible than a generic BI dashboard by showing that source provenance matters.

## 15. Optional Interaction: Filter State
Include a lightweight filter bar to make the dashboard feel real without adding major scope.

### Recommended filters
- Program
- Graduation Term
- Source Type
- Verification Status

### Requirements
- filters should visibly affect KPIs and table state
- defaults should preserve a clear first impression
- avoid adding too many advanced controls

## 16. Optional Interaction: Cohort Drill-In
Include one simple supporting interaction:
- click row
- open right-side panel or modal
- show more detail without navigating to a new page

### Recommended contents
- cohort/program summary
- source coverage breakdown
- stale records
- confidence / trust breakdown
- export button
- “view full record set” as a hint, not a real destination

## 17. UI Hints for Out-of-Scope Areas
To imply a larger product, lightly hint at these as non-functional UI elements:
- Review Queue
- Verified Earnings
- Compliance Reports
- Surveys & Outreach
- Executive Dashboards
- Widgets / Public Proof

### How to hint them
- secondary nav tabs
- disabled sidebar items
- “coming soon” cards
- empty preview modules
- buttons that visually suggest adjacent workflows

### Rule
These hints should support product credibility, not create extra build work.

## 18. Non-Goals
This prototype should **not** attempt to prove:
- full module completeness
- full regulatory implementation
- record-level editing workflows
- outreach automation
- reporting/export backends
- exact legal compliance logic
- production-ready system architecture

It should prove:
- good product judgment
- good admin UX
- good prioritization under ambiguity
- strong frontend execution

## 19. Success Criteria
The prototype succeeds if a reviewer can quickly see that:
1. the dashboard is centered on the right problem
2. verified earnings / readiness is the lead story
3. the page helps identify where action is needed
4. the design feels intentional and admin-appropriate
5. the broader module is implied without being overbuilt

## 20. Design Guidance
### Tone
- confident
- clear
- high-signal
- not flashy
- admin/productivity oriented

### Visual hierarchy
- strongest emphasis on readiness / verified coverage
- second emphasis on risky cohorts/programs
- third emphasis on data provenance / source health

### Interaction philosophy
- one-page prototype first
- one drill-in max
- no sprawling navigation
- no fake complexity

## 21. Suggested Demo Narrative
A reviewer should be able to scan the prototype and understand:
- “This institution has moderate overall outcomes coverage”
- “Verified earnings coverage is the real pressure point”
- “A few programs are clearly riskier than others”
- “The underlying source mix explains why”
- “There are obvious next actions, even if the full workflows are not implemented”

## 22. Appendix: Prototype Copy Guidance
Recommended copy phrases:
- **Verified Earnings Coverage**
- **Outcomes Coverage**
- **Data Freshness**
- **Programs Needing Follow-Up**
- **Do No Harm Readiness**
- **Source Health**
- **Last Verified**
- **Needs Review**

Avoid:
- “Do No Harm Act”
- overly legalistic compliance language
- jargon that implies exact regulatory logic the prototype does not actually implement

## 23. Appendix: Relationship to Full Module PRD
The original PRD described a much broader Career Outcomes module including:
- outcomes inbox / review queue
- person-level records
- surveys & outreach
- stale-data workflows
- verified earnings workflows
- compliance workspace
- executive dashboards
- widgets
- exports / audit logging

This prototype intentionally reduces that to:
- one overview page
- one drill-in interaction
- one filter system
- UI hints for the rest

That reduction is deliberate and aligns to a take-home prototype rather than a full product plan.
