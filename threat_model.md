# Threat Model

## Project Overview

This project is a public Next.js 15 portfolio site deployed through OpenNext/Cloudflare Workers. Its production code is a mostly static client-rendered landing page (`app/page.tsx`) plus a single server route (`app/api/file/[filename]/route.ts`) that reads files from persistent storage under `/mnt/user-data/uploads` and returns them to the browser.

There is no first-party user authentication, admin panel, or database in the current production code. The main production assumptions for this scan are: `NODE_ENV=production`, TLS is terminated by the platform, and mockup/sandbox-only assets are not deployed to production.

## Assets

- **Persistent uploaded/generated files** — Files stored under `/mnt/user-data/uploads` may include public assets, generated documents, or operator-only content. Unauthorized disclosure would expose any sensitive files placed in that directory.
- **Application secrets** — Environment variables such as `GEMINI_API_KEY` and deployment/runtime credentials must never be exposed to clients, logs, or file-serving routes.
- **Portfolio content and external embeds** — The site embeds third-party content and links to external properties. These integrations should not expand the trust granted to untrusted origins.
- **Service availability** — The public site and file-serving route should remain resilient against trivial abuse and should not expose internal runtime details through errors.

## Trust Boundaries

- **Browser to Next.js application** — All request parameters, path segments, and browser state are untrusted. Any server route must validate inputs and enforce access policy server-side.
- **Next.js server to persistent filesystem** — `app/api/file/[filename]/route.ts` crosses from web requests into server-side file reads. This is the highest-risk boundary in the current codebase because filesystem access can disclose non-public content if the route is too broad.
- **Browser to third-party services** — The client directly loads GitHub API data and embeds an external n8n-hosted form in an iframe. These services are outside the app's trust domain and should be treated as untrusted dependencies.
- **Production vs dev-only assets** — `attached_assets/`, `.next/`, and most `.local/` contents are development or tooling artifacts and should be ignored unless separately proven reachable in production.

## Scan Anchors

- **Production entry points:** `app/page.tsx`, `app/layout.tsx`, `app/api/file/[filename]/route.ts`
- **Highest-risk code area:** filesystem-backed file serving in `app/api/file/[filename]/route.ts`
- **Public surface:** the landing page and the `/api/file/[filename]` route are publicly reachable
- **Dev-only areas usually out of scope:** `attached_assets/`, `.next/`, `.local/`, build logs, and generic instruction files such as `AI_RULES.md`

## Threat Categories

### Information Disclosure

The main confidentiality risk is unauthorized file disclosure through the public file-serving route. The application must ensure that public requests can only retrieve files that are explicitly intended for public access, and that path parameters cannot be used to enumerate or retrieve unrelated files from persistent storage.

Secrets and internal paths must not be exposed in responses, logs, or client bundles. Error handling should stay generic and must not reveal filesystem structure or runtime internals.

### Tampering

There is very little server-side state mutation in the current production app, but any future extension of the file route or external integrations must not trust browser-provided identifiers, filenames, or metadata. If files are ever uploaded or generated dynamically, server-side ownership and policy checks are required before those files are served back.

### Denial of Service

The public site depends on client-side third-party fetches and a server-side file read endpoint. The application should avoid allowing unauthenticated requests to trigger disproportionate filesystem work or repeated large-file delivery without operational safeguards such as size constraints, caching policy, or rate limiting at the platform edge.

### Elevation of Privilege

There is no formal user/admin privilege model today, but the filesystem boundary still represents privilege separation: unauthenticated web users must not gain read access to files that are only meant to exist on the server or in persistent storage. Any future authenticated or operator-only functionality must enforce authorization on the server, not in the client.
