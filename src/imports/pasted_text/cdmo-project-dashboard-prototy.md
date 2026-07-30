Design a high-fidelity desktop web dashboard prototype for a client-facing CDMO project management portal in the pharmaceutical / biotech industry.

The dashboard should fit into a single screen and clearly present all critical project information at a glance using a combination of visual timeline components, structured tables, progress indicators, and lightweight status cards. The design should feel professional, clean, enterprise-grade, and trustworthy, suitable for communication between a CDMO and its client company. Use a modern B2B healthcare / biotech UI style with a white background, navy and teal accents, subtle gray dividers, and a polished but restrained visual language.

This is a shared project dashboard used by both the CDMO team and the client team. The goal is to reduce unnecessary meetings and emails by making project status, production stage, action items, follow-up timing, and bilateral requests visible in one place.

Create one main dashboard screen with the following information architecture:

1. Top header section
- Project name
- Client company name
- Internal project code
- Product / campaign name
- Project manager names for both companies
- Overall project health badge
- Last updated date and time
- Quick summary chips such as “Current Phase”, “Next Milestone”, “Open Actions”, “Pending Requests”

2. Overall project timeline section
- A horizontal milestone timeline for the entire project lifecycle
- Show major phases such as Tech Transfer, Material Readiness, Intermediate Manufacturing, Final API Manufacturing, QC / QA Release, Shipment, Project Close
- Clearly indicate the current position in the timeline
- Use visual progress cues such as a highlighted active stage, completed stages, upcoming stages, and a vertical “Today” marker if useful
- Include milestone dates or estimated windows
- Make it visually obvious where the project stands right now

3. Production timeline / batch or campaign tracking section
- Show multiple batches or campaigns in a structured timeline or segmented tracker
- Each batch should display its current production stage
- Example stages can include Raw Material Ready, Reaction, Workup, Crystallization, Drying, Milling, Packaging, QC Release, Ready for Shipment
- Some batches may have detailed notes such as:
  - “Intermediate 2 production completed”
  - “Currently in drying”
  - “Release documents under preparation”
  - “Ready for shipment”
- Each batch or campaign row should show:
  - Batch / campaign ID
  - Current stage
  - Progress bar or step tracker
  - Planned completion date
  - Status indicator
- Make this section easy to scan visually

4. Action items section
- Create a structured table for action items generated from meetings or email follow-ups
- Include action items for both the CDMO side and the client side
- Table columns should include:
  - Action item title
  - Owner company
  - Responsible department
  - Owner / PIC
  - Due date
  - Status
  - Progress note
- Status values should visibly differ, such as Open, In Progress, Completed, At Risk
- Use colored status pills
- Include a few realistic sample action items
- Make this feel like a real collaborative project tracker

5. Follow-up timeline section
- Show follow-up progress connected to ongoing action items
- This should visually communicate how far each open item has progressed
- Use a compact vertical or horizontal timeline linked to major follow-up checkpoints
- Example progression states:
  - Request submitted
  - Under review
  - Data shared
  - Confirmation pending
  - Closed
- This section should help users understand not just the status label, but where the item currently sits in the follow-up flow

6. Mutual request / information exchange section
- Create a dedicated two-column area where both companies can leave requests or information updates without needing a meeting
- Left column: Client Requests to CDMO
- Right column: CDMO Requests to Client
- Each request card should include:
  - Short title
  - Request details
  - Requested date
  - Priority
  - Due date if applicable
  - PM acknowledgment checkbox
- Include a visual confirmation mechanism that shows whether each PM has reviewed the request
- For example:
  - “Client PM reviewed” checkbox
  - “CDMO PM reviewed” checkbox
- This section should feel practical, low-friction, and collaborative

7. Optional right-side summary rail or compact footer zone
- Add a compact summary area if space allows
- Could include:
  - Upcoming milestones
  - Escalation risks
  - Documents awaiting review
  - Recent updates log
- Keep it concise and visually lightweight

Interaction and UX expectations:
- Design it as a realistic interactive prototype, not just a static report
- Include hoverable cards, clickable rows, status pills, expandable notes, and checkbox interactions where appropriate
- Prioritize clarity and scanability over decoration
- Keep the layout dense enough to be useful, but not cluttered
- This should feel like a dashboard that a project manager would actually use weekly with a client

Visual style guidance:
- Desktop width around 1440 px
- Grid-based layout with clearly separated modules
- Use timeline diagrams, progress trackers, tables, and cards
- Avoid consumer-app aesthetics; this should feel like enterprise biotech software
- Polished, minimal, data-forward, credible, and operational
- Subtle icons are okay, but avoid excessive illustration
- Use realistic placeholder content related to pharmaceutical manufacturing projects

Please generate:
- one main dashboard screen
- clean information hierarchy
- realistic example content
- strong visual distinction between project-level timeline, batch-level production status, action management, and bilateral requests
- a prototype that looks presentation-ready for internal concept review
