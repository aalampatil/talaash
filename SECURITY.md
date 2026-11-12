# Security Policy

## Supported code

Security fixes target the latest code on the repository's default branch. Older commits, branches, forks, and deployments are not maintained as separate security release lines. Deployments should incorporate reviewed security fixes and keep their dependencies current.

## Reporting a vulnerability

**Do not disclose vulnerabilities in public issues, pull requests, or discussions.**

Email [aalam.workacc@gmail.com](mailto:aalam.workacc@gmail.com) with the subject `Talaash security report`. If private vulnerability reporting is enabled for the repository, you may instead [submit a private report on GitHub](https://github.com/aalampatil/talaash/security/advisories/new).

Include:

- The affected commit or version, component, and route, if known.
- A description of the issue and its potential impact.
- Steps to reproduce it using a local environment or accounts and data you control.
- A minimal proof of concept and sanitized logs or screenshots, where useful.
- Any suggested mitigation and your preferred contact method.

Do not send passwords, API keys, session cookies, connection strings, or other people's personal data. If a credential has been exposed, revoke or rotate it through the relevant service and describe the exposure without including the credential itself.

## Response and disclosure

The maintainer will review reports, investigate reproducible issues, and coordinate remediation and disclosure with the reporter. Response times depend on maintainer availability; this project does not guarantee a response or fix deadline. If you have not received a reply within seven days, follow up through the same private channel.

Please coordinate publication of vulnerability details so affected deployments have time to apply a fix. Credit can be included with the reporter's permission.

## Testing boundaries

Use local environments or systems where you have explicit permission to test. Avoid accessing other users' records, disrupting service, or performing destructive tests. If you encounter personal data unexpectedly, stop testing and report the issue privately without copying or sharing that data.

Authentication and authorization bypasses, cross-account data access, webhook verification failures, unsafe uploads, and exposed credentials are examples of security concerns. Ordinary bugs and feature requests belong in the public issue tracker.
