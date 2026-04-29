/**
 * Database Configuration Validator
 * 
 * Validates database connection parameters and provides helpful error messages
 * if the Supabase endpoint cannot be resolved or is misconfigured.
 */

import * as dns from 'dns';
import { promisify } from 'util';

const resolveAsync = promisify(dns.resolve4);

/**
 * Parse PostgreSQL connection URL to extract components
 */
export function parsePostgresUrl(
  url: string,
): { host: string; port: number; user: string; password: string; database: string } | null {
  try {
    const postgresUrl = new URL(`postgresql://${url.replace('postgresql://', '')}`);
    return {
      host: postgresUrl.hostname,
      port: postgresUrl.port ? Number(postgresUrl.port) : 5432,
      user: postgresUrl.username || 'postgres',
      password: postgresUrl.password || '',
      database: postgresUrl.pathname.replace('/', '') || 'postgres',
    };
  } catch (error) {
    return null;
  }
}

/**
 * Validate that a hostname can be resolved to an IPv4 address
 * Includes a 5-second timeout to prevent hanging
 */
export async function validateHostnameResolution(hostname: string, timeoutMs: number = 5000): Promise<string[]> {
  return Promise.race([
    resolveAsync(hostname),
    new Promise<string[]>((_, reject) =>
      setTimeout(() => reject(new Error(`DNS resolution timeout after ${timeoutMs}ms`)), timeoutMs),
    ),
  ]).catch((error: any) => {
    if (error.code === 'ENOTFOUND') {
      throw new Error(`DNS resolution failed for hostname: ${hostname}. Check that the hostname is correct.`);
    }
    if (error.code === 'ESERVFAIL') {
      throw new Error(`DNS server failure for hostname: ${hostname}. Check your internet/DNS connectivity.`);
    }
    throw error;
  });
}

/**
 * Validate the DATABASE_URL environment variable
 * Returns detailed information about the connection parameters
 */
export function validateDatabaseUrl(databaseUrl: string | undefined): {
  isValid: boolean;
  host?: string;
  port?: number;
  user?: string;
  database?: string;
  error?: string;
} {
  if (!databaseUrl) {
    return {
      isValid: false,
      error: 'DATABASE_URL is not set. Set it in your .env or .env.docker file.',
    };
  }

  // Check for common mistakes
  if (databaseUrl.includes('$(')) {
    return {
      isValid: false,
      error:
        'DATABASE_URL contains shell variable syntax "$(...)" which is not supported. ' +
        'Use actual values or environment variable substitution from your deployment platform.',
    };
  }

  if (databaseUrl.trim() !== databaseUrl) {
    return {
      isValid: false,
      error:
        'DATABASE_URL has leading/trailing whitespace. Remove spaces and try again. ' +
        `Current value: "${databaseUrl}"`,
    };
  }

  const parsed = parsePostgresUrl(databaseUrl);
  if (!parsed) {
    return {
      isValid: false,
      error:
        'DATABASE_URL format is invalid. Expected format: ' +
        'postgresql://username:password@hostname:port/database',
    };
  }

  // Validate hostname looks like a valid format
  if (!parsed.host) {
    return {
      isValid: false,
      error: 'DATABASE_URL hostname is empty. Check your connection string.',
    };
  }

  if (parsed.host.includes('$(')) {
    return {
      isValid: false,
      error:
        'DATABASE_URL hostname contains unevaluated shell variables. ' +
        'This typically happens when DATABASE_URL is set via shell substitution that did not work.',
    };
  }

  return {
    isValid: true,
    host: parsed.host,
    port: parsed.port,
    user: parsed.user,
    database: parsed.database,
  };
}

/**
 * Comprehensive startup validation for database connectivity
 * Checks configuration, hostname resolution, and provides helpful errors
 * Includes timeout to prevent blocking app startup
 */
export async function validateDatabaseConnectivity(timeoutMs: number = 5000): Promise<{
  canConnect: boolean;
  host?: string;
  resolvedIps?: string[];
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const databaseUrl = process.env.DATABASE_URL;

  console.log('\n📊 Database Connection Validation');
  console.log('='.repeat(50));

  // Step 1: Validate URL format
  const urlValidation = validateDatabaseUrl(databaseUrl);
  if (!urlValidation.isValid) {
    console.error(`\n❌ DATABASE_URL Validation Failed`);
    console.error(`   ${urlValidation.error}`);
    return {
      canConnect: false,
      errors: [urlValidation.error || 'DATABASE_URL validation failed'],
      warnings,
    };
  }

  console.log(`✅ DATABASE_URL format is valid`);
  console.log(`   Host: ${urlValidation.host}`);
  console.log(`   Port: ${urlValidation.port}`);
  console.log(`   User: ${urlValidation.user}`);
  console.log(`   Database: ${urlValidation.database}`);

  // Step 2: Validate hostname resolution with timeout
  if (!urlValidation.host) {
    errors.push('Hostname is empty');
    return {
      canConnect: false,
      host: urlValidation.host,
      errors,
      warnings,
    };
  }

  console.log(`\n🔍 Attempting DNS resolution for: ${urlValidation.host} (timeout: ${timeoutMs}ms)`);

  let resolvedIps: string[] = [];
  try {
    resolvedIps = await validateHostnameResolution(urlValidation.host, timeoutMs);
    console.log(`✅ DNS resolution succeeded`);
    console.log(`   Resolved IPv4 addresses: ${resolvedIps.join(', ')}`);
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    console.error(`⚠️  DNS resolution issue detected`);
    console.error(`   ${errorMessage}`);

    // Provide helpful suggestions
    if (errorMessage.includes('ENOTFOUND')) {
      console.error(`\n💡 Troubleshooting suggestions:`);
      console.error(`   1. Verify the hostname in your DATABASE_URL is correct`);
      console.error(`   2. For Supabase: Check Dashboard → Settings → Database → Connection String`);
      console.error(`   3. If using Supabase pooler, ensure you're using the pooler hostname`);
      console.error(`   4. Check your internet connection and DNS settings`);
      console.error(`   5. Try pinging the hostname: ping ${urlValidation.host}`);
    } else if (errorMessage.includes('timeout')) {
      console.error(`\n💡 DNS resolution timed out after ${timeoutMs}ms.`);
      console.error(`   This usually means:`);
      console.error(`   1. DNS server is not responding quickly`);
      console.error(`   2. Network connectivity is slow or unreliable`);
      console.error(`   3. Container DNS configuration may be incorrect`);
      console.error(`   4. Proceeding with connection attempt anyway...`);
    }

    // Don't mark as connection failure for DNS timeout - let TypeORM handle retries
    if (!errorMessage.includes('timeout')) {
      errors.push(`DNS resolution issue for ${urlValidation.host}: ${errorMessage}`);
    } else {
      warnings.push(
        `DNS resolution timed out after ${timeoutMs}ms. ` +
          `The application will attempt to connect anyway with TypeORM retries.`,
      );
    }
  }

  // Step 3: Check for common Supabase issues
  if (urlValidation.host.includes('supabase')) {
    if (!urlValidation.host.includes('pooler.supabase.com') && !urlValidation.host.includes('.supabase.co')) {
      warnings.push(
        'Hostname does not match known Supabase patterns (*.supabase.co or *.pooler.supabase.com). ' +
          'Verify this is the correct Supabase connection string.',
      );
    }

    if (urlValidation.user !== 'postgres') {
      warnings.push(
        `Non-standard user "${urlValidation.user}" detected. Most Supabase connections use user "postgres".`,
      );
    }
  }

  console.log(`\n${'='.repeat(50)}\n`);

  return {
    canConnect: errors.length === 0,
    host: urlValidation.host,
    resolvedIps,
    errors,
    warnings,
  };
}

/**
 * Get a helpful error message for connection failures
 */
export function getConnectionErrorMessage(error: any): string {
  const errorCode = error.code || error.message;

  if (errorCode.includes('ENOTFOUND')) {
    return (
      `Hostname "${error.address}" could not be resolved. ` +
      `This usually means:\n` +
      `  • The hostname in DATABASE_URL is incorrect or misspelled\n` +
      `  • Your internet connection is down or DNS is not working\n` +
      `  • For Supabase: Verify the connection string from Dashboard → Settings → Database`
    );
  }

  if (errorCode.includes('ECONNREFUSED')) {
    return (
      `Connection refused at ${error.address}:${error.port}. ` +
      `The database server is not accepting connections or is unreachable.`
    );
  }

  if (errorCode.includes('ETIMEDOUT')) {
    return (
      `Connection timed out to ${error.address}:${error.port}. ` +
      `The database server is not responding. Check network connectivity and firewall rules.`
    );
  }

  if (errorCode.includes('ENETUNREACH')) {
    return (
      `Network unreachable to ${error.address}:${error.port}. ` +
      `The container may not have internet access or IPv6 routing issues. ` +
      `Verify your network configuration.`
    );
  }

  if (errorCode.includes('EACCES')) {
    return `Permission denied connecting to ${error.address}:${error.port}. Check database credentials.`;
  }

  return `Unexpected error: ${error.message || errorCode}`;
}

export default {
  parsePostgresUrl,
  validateHostnameResolution,
  validateDatabaseUrl,
  validateDatabaseConnectivity,
  getConnectionErrorMessage,
};
