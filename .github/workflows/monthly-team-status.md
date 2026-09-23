---
description: |
  This workflow creates monthly team status reports with comprehensive activity summaries.
  Gathers repository activity from the past month (issues, PRs, discussions, releases, code changes)
  and generates engaging GitHub discussions with strategic insights, productivity metrics,
  community growth, and project planning recommendations. Uses a positive, encouraging tone
  with moderate emoji usage to boost team morale.

on:
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
network: defaults
tools:
  github:
safe-outputs:
  create-discussion:
    title-prefix: "[monthly-status] "
    category: "announcements"
---

# Monthly Team Status

Create a comprehensive monthly status report for the team as a GitHub discussion.

## What to include

Focus on activity from the **past 30 days**:

- **Repository Activity Summary**
  - Issues opened, closed, and updated
  - Pull requests merged, opened, and reviewed
  - New discussions and active conversations
  - Releases and version updates
  - Significant code changes and commits
  - Contributor statistics and activity patterns

- **Strategic Insights & Metrics**
  - Major accomplishments and milestones reached
  - Progress on key objectives
  - Velocity and productivity trends
  - Quality metrics (code reviews, test coverage changes)
  - Comparison to previous months if data available

- **Community Growth & Engagement**
  - New contributors and their impact
  - Most active community members
  - Notable feature requests and feedback
  - External engagement and adoption signals
  - Community health indicators

- **Project Planning & Recommendations**
  - Strategic feature investment suggestions
  - Technical debt priorities
  - Documentation and tooling improvements
  - Risk areas requiring attention
  - Recommended focus areas for next month

## Style

- Be positive, strategic, and insightful 🌟
- Use emojis moderately for engagement
- Provide deep analysis and context, not just statistics
- Highlight major wins and celebrate achievements
- Identify trends and patterns across the month
- Make it comprehensive yet engaging to read

## Process

1. Query repository activity from the past 30 days
2. Analyze trends, patterns, and strategic insights
3. Compare metrics and identify month-over-month changes
4. Create a new GitHub discussion with your findings, analysis, and strategic recommendations
5. Structure the report with clear sections, visualizations (when helpful), and actionable next steps
