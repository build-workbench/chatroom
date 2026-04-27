## ADDED Requirements

### Requirement: Final Tooling Rationalization
The repository SHALL make explicit keep-or-remove decisions for AI/tooling surfaces before archive finalization is considered complete.

#### Scenario: AI and editor tooling is reviewed
- **WHEN** `.claude` assets, Copilot instructions, plugin posture, and LSP guidance are audited
- **THEN** each retained surface has a clear repository-specific purpose and low-value or redundant tooling is removed or consolidated

#### Scenario: Minimal integration policy is enforced
- **WHEN** a new MCP, plugin, or tool-specific integration is considered during finalization
- **THEN** it is rejected unless it has clear recurring value that outweighs its maintenance and context cost
