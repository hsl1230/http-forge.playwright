# Integration Guide: @http-forge/playwright In The HTTP Forge Family

This guide explains how `@http-forge/playwright` works with the other HTTP Forge components and where it should be used.

## Component Responsibilities

| Component | Primary Responsibility | Typical Output |
|---|---|---|
| HTTP Forge VS Code extension | Author and run requests, collections, suites in workspace | Request definitions, environments, run history |
| `@http-forge/core` | Shared execution runtime and compatibility layer | Runtime APIs for execution/import/export |
| `@http-forge/codegen` | Generate typed TypeScript API functions | `*.ts` API client files |
| `@http-forge/playwright` | Runtime dependency for generated Playwright clients | `ForgeEnv`, shared types |
| HTTP Forge CLI | Headless execution in CI/CD | Exit codes, JSON/JUnit/HTML reports |

## End-To-End Workflow

1. Build and validate requests in the HTTP Forge extension.
2. Generate typed client code with `@http-forge/codegen`.
3. Use generated clients inside Playwright tests.
4. Provide runtime environment values with `ForgeEnv` from `@http-forge/playwright`.
5. Run test automation in local dev or CI.

## How Generated Clients Use This Package

Generated clients rely on `@http-forge/playwright` for two things:

1. Environment and template resolution via `ForgeEnv`.
2. Shared request option types to avoid duplicating boilerplate in every generated file.

Typical generated usage pattern:

```ts
import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { BaseRequestContext, BaseApiOptions } from '@http-forge/playwright/shared-types';

interface LoginRequestOptions extends BaseRequestContext, BaseApiOptions {
    query?: Record<string, string>;
}

export async function loginRequest(options: LoginRequestOptions): Promise<APIResponse> {
    const { request, env } = options;
    const url = env.buildUrl('{{baseUrl}}/oauth2/authorize', { query: options.query });
    return request.get(url);
}
```

## Recommended Project Layout

```text
my-project/
  tests/
    api/
      generated/
  src/
    env/
      forge-env.ts
  playwright.config.ts
```

- Keep generated API clients under a dedicated `generated` folder.
- Keep environment bootstrapping in one place for reuse across tests.

## Environment Strategy

Use `ForgeEnv` as the handoff point between your test runtime and generated clients.

```ts
import { ForgeEnv } from '@http-forge/playwright';

export const env = ForgeEnv.fromEnvironments(
    {
        dev: {
            baseUrl: 'https://dev-api.example.com',
            tenant: 'dev'
        },
        sit: {
            baseUrl: 'https://sit-api.example.com',
            tenant: 'sit'
        }
    },
    process.env.TEST_ENV || 'dev'
);
```

## When To Use Which Component

- Use the extension for authoring and interactive debugging.
- Use `@http-forge/codegen` when you want strongly typed API test code.
- Use `@http-forge/playwright` when executing those generated clients in Playwright.
- Use CLI when you need pipeline/headless execution and reporting.

## Practical CI Pattern

1. Commit workspace request definitions.
2. Generate clients as part of build or pre-test step.
3. Run Playwright tests that import generated clients and use `ForgeEnv`.
4. Publish results with your preferred test reporter.

## Scope Clarification

`@http-forge/playwright` does not execute collections by itself and does not replace the extension UI or CLI runner. It is a runtime utility package for generated Playwright client code.
