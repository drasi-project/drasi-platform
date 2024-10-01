# Drasi
Drasi is a data processing platform that simplifies detecting critical events and taking immediate action in event-driven systems. It is a comprehensive solution that provides built-in capabilities to track system logs and change feeds for specific events, evaluate them for relevance, and automatically initiate appropriate reactions. Visit our documentation site at [https://drasi.io](https://drasi.io) for detailed information.

## Overview
Drasi provides real-time actionable insights without the overhead of traditional data processing methods. It tracks system changes and events without the need to copy data to a central data lake or repeatedly query data sources. Drasi uses queries to continuously evaluate incoming events When the events match the criteria and conditions specified in these queries the result sets of these queries are updated. These updates then trigger context-aware reactions defined tuned to your specific requirements.

Drasi operates through three components:

*	 **Sources** connect to data repositories within software systems to monitor logs and feeds for specific events.
*	 **Continuous Queries** interpret monitored events by applying criteria and conditions to identify significant changes. In Drasi, these Continuous Queries are written using the Cypher Query Language.
*	 **Reactions** trigger meaningful responses based on updates to the result sets of the Continuous Queries.<br>
  
<img src="https://github.com/drasi-project/community/blob/main/images/drasi_components.png" alt="Alt text" width="800" height="300">

<br>To illustrate how Drasi interprets events and triggers appropriate responses, consider a delivery system for an online ordering service. Orders are processed through an order management system, and delivery drivers need real-time notifications when orders are ready for pickup. Drasi automates this process by:<br>

* Configuring a Source to monitor the order management system for changes in order statuses and a second Source to detect when a driver becomes available for a delivery run.
* Creating a Continuous Query that combines data from both Sources to match orders ready for pickup with available drivers.
* Defining a Reaction to send alerts to drivers, notifying them to proceed to the pickup area.
This streamlined setup ensures drivers are promptly informed, optimizing the delivery process through real-time data integration and automated responses.<br>

<img src="https://github.com/drasi-project/community/blob/main/images/curbside_pickup_drasi.png" alt="Alt text" width="800" height="300">


## Getting Started

Follow the [Getting Started tutorial](https://drasi.io/getting-started/) and try out Drasi. The tutorial will lead you through:

1. Applying a Source representing the data source whose changes you want to observe.
2. Creating Continuous Queries to define the data to observe, conditions to assess changes, and the structure of the output.
3. Applying a Debug Reaction to view the output generated by one or more Continuous Queries.

Head over to our [documentation site](https://drasi.io/) and visit the [Tutorial](https://drasi.io/tutorials/) and [How To](https://drasi.io/how-to-guides/) guides to learn more about Drasi.

## Release Status
This is an early release of Drasi for the community learn about the platform and experiment with in Proofs Of Concept. Please share your thoughts on Drasi and create GitHub issues for any bugs you may find or if you have feature requests that will help improve Drasi.

This repo contains everything you require to build a Drasi-based solution with Sources, Reactions, and tooling for development and testing.

## Community
We hope you will join us and contribute to Drasi! Some of the ways to get started with contributing are participating in Issue discussions or joining us on our [Discord server](https://aka.ms/drasidiscord). Check out our [Community repo](https://github.com/drasi-project/community) for more information on the community, and guidance on contributing and development. 

## Contributing To Drasi

Please see the [Contribution guide](https://github.com/drasi-project/drasi-platform/blob/main/CONTRIBUTING.md) for information on contributing to Drasi.

## Security
Please refer to our guide on [reporting security vulnerabilities](https://github.com/drasi-project/drasi-platform/blob/main/SECURITY.md#reporting-security-issues)

## Code of Conduct
Please refer to Drasi's [Code of Conduct](https://github.com/drasi-project/community/blob/main/CODE_OF_CONDUCT.md)

## License
This project is licensed under the **Apache 2.0 license**. Please see the [LICENSE](https://github.com/drasi-project/community/blob/main/LICENSE) file.

## Contact the Drasi Authors
Please join us on Discord to contact us and we will get back to you as soon as possible. You can also email us at info@drasi.io.
