# VSB-APEX: Tasks & Future Work

This file tracks goals and construction tasks for later phases of the dashboard development.

## Deferred Tasks

- `[ ]` **Semester Results Page**: Currently under construction. Need to design and build a detailed per-semester drill-down for student performance.
- `[ ]` **Pass Percentage Analytics**: Deep-dive into specific year/section results trends in the dedicated Results page.
- `[ ]` **Goal Tracking v2**: Potential re-implementation of goal tracking if requested later.
- `[ ]` **Insights v2**: AI-driven insights engine integration.
- `[ ]` **Performance Optimization (Caching)**: Use local browser/PC caching for API resources to reduce fetch times and improve dashboard responsiveness.

## Known Constraints
- Attendance % in scorecards is currently based on **Today (presence-only)** for immediate monitoring.
- Pass % hover data relies on the latest semester results data available in the DB.
- Toppers require accurate student metadata (Year/Section) in the DB.
