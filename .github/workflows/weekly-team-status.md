---
description: |
  This workflow creates weekly team status reports with comprehensive activity summaries.
  Gathers repository activity from the past week (issues, PRs, discussions, releases, code changes)
  and generates engaging GitHub discussions with productivity insights, community
  highlights, and project recommendations. Uses a positive, encouraging tone with
  moderate emoji usage to boost team morale.

on:
  schedule: weekly on friday
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
    title-prefix: "[weekly-status] "
    category: "announcements"
---

# Weekly Team Status

Create an upbeat weekly status report for the team as a GitHub discussion.

## What to include

Focus on activity from the **past 7 days**:

- **Repository Activity Summary**
  - Issues opened, closed, and updated
  - Pull requests merged, opened, and reviewed
  - New discussions and active conversations
  - Releases and version updates
  - Significant code changes and commits

- **Team Productivity Insights**
  - Key accomplishments and milestones
  - Areas of high activity or collaboration
  - Suggestions for improvement
  - Productivity patterns and trends

- **Community Engagement Highlights**
  - New contributors and their contributions
  - Active community members
  - Notable feedback or feature requests
  - External engagement metrics

- **Project Recommendations**
  - Feature investment suggestions
  - Technical debt areas to address
  - Documentation improvements
  - Next week's focus areas

## Style

- Be positive, encouraging, and helpful 🌟
- Use emojis moderately for engagement
- Provide context and insights, not just raw data
- Highlight wins and celebrate progress
- Keep it comprehensive but readable

## Process

1. Query repository activity from the past 7 days
2. Analyze trends and patterns in the data
3. Create a new GitHub discussion with your findings, insights, and recommendations
4. Structure the report with clear sections and actionable takeaways
