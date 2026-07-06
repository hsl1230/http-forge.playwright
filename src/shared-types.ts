/**
 * Shared Types for HTTP Forge Generated API Clients
 * 
 * Base types that all generated Playwright API clients can use.
 * These types reduce code duplication in generated files.
 * 
 * Project-specific types (Tenant, Cluster, etc.) should be defined
 * in the generated code's own shared-types.ts file.
 */

import type { APIRequestContext } from '@playwright/test';
import type { IForgeEnv } from './forge-env';

/**
 * Common HTTP headers interface
 * Includes standard headers with autocomplete support
 */
export interface HttpHeaders {
    /** Content type of the request/response */
    'Content-Type'?: string;
    
    /** Content length in bytes */
    'Content-Length'?: string | number;
    
    /** Authorization credentials */
    'Authorization'?: string;
    
    /** Acceptable response content types */
    'Accept'?: string;
    
    /** Acceptable encodings */
    'Accept-Encoding'?: string;
    
    /** Acceptable languages */
    'Accept-Language'?: string;
    
    /** Cache control directives */
    'Cache-Control'?: string;
    
    /** Cookies */
    'Cookie'?: string;
    
    /** Origin for CORS */
    'Origin'?: string;
    
    /** Referer URL */
    'Referer'?: string;
    
    /** User agent string */
    'User-Agent'?: string;
    
    /** XMLHttpRequest indicator */
    'X-Requested-With'?: string;

    /** Allow any custom headers */
    [key: string]: any;
}

/**
 * Base request context required by all generated API clients
 */
export interface BaseRequestContext<THeaders extends HttpHeaders = HttpHeaders> {
    /** Playwright API request context */
    request: APIRequestContext;
    
    /** Environment with resolved variables */
    env: IForgeEnv;
    
    /** Additional headers to merge with defaults */
    headers?: THeaders;
}

/**
 * Base API client options
 * Common options that all API requests support
 */
export interface BaseApiOptions {
    /** Maximum number of request redirects (default: 20) */
    maxRedirects?: number;
    
    /** Request timeout in milliseconds */
    timeout?: number;
    
    /** Whether to throw on non-2xx status codes (default: false) */
    failOnStatusCode?: boolean;
}
