# Change Log

All notable changes to the "drasi" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Added
- **YAML Intellisense**: Comprehensive auto-completion and validation for Drasi YAML resources
  - JSON schemas based on Drasi Management API OpenAPI 3.0.3 specification
  - ContinuousQuery schema with full support for queries, joins, middleware, and views
  - Source schema with identity configurations and provider-specific properties
  - Reaction schema with query subscriptions and authentication settings
- **Schema Provider**: Automatic schema association based on document content
  - Detects resource kind from YAML content
  - Supports multi-document YAML files
  - File name pattern matching for query, source, and reaction files
- **TypeScript Models**: Complete type definitions for all Drasi resources
  - ContinuousQuerySpec with sources, joins, middleware, and view configurations
  - SourceSpec and ReactionSpec with identity and service configurations
  - Shared common types for ConfigValue, ServiceIdentity, ServiceConfig
- **Example File**: Added example-drasi-resources.yaml demonstrating all features

### Dependencies
- Added Red Hat YAML extension as recommended dependency for enhanced YAML support

## [0.3.6] - Previous Release

- Initial release