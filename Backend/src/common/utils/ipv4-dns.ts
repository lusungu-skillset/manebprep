/**
 * IPv4-First DNS Resolver
 * 
 * This module ensures that all DNS lookups prefer IPv4 addresses over IPv6.
 * This is critical for Docker environments where IPv6 may not be properly routed.
 * 
 * MUST be imported as the very first module in the application.
 */

import * as dns from 'dns';
import { promisify } from 'util';

// Set default result order to IPv4 first at module load time
dns.setDefaultResultOrder('ipv4first');

// Promisify DNS lookup for better error handling
export const lookupAsync = promisify(dns.lookup);

/**
 * Resolve a hostname to an IPv4 address
 * Explicitly filters out IPv6 results even if IPv4 preference doesn't work
 */
export async function resolveToIPv4(hostname: string): Promise<string> {
  try {
    const result = await dns.promises.resolve4(hostname);
    if (result.length === 0) {
      throw new Error(`No IPv4 addresses found for ${hostname}`);
    }
    console.log(`✓ Resolved ${hostname} to IPv4: ${result[0]}`);
    return result[0];
  } catch (error) {
    console.error(`✗ Failed to resolve ${hostname} to IPv4:`, error);
    throw error;
  }
}

/**
 * Get IPv4 address from a hostname, with fallback to IPv6
 */
export async function resolveIPv4WithFallback(hostname: string): Promise<string> {
  try {
    return await resolveToIPv4(hostname);
  } catch (error) {
    console.warn(`⚠️  IPv4 resolution failed, attempting general lookup for ${hostname}`);
    try {
      const { address } = await lookupAsync(hostname, { family: 4 });
      console.log(`✓ Resolved ${hostname} to IPv4 (fallback): ${address}`);
      return address;
    } catch (fallbackError) {
      console.error(`✗ All IPv4 resolution attempts failed for ${hostname}`);
      throw fallbackError;
    }
  }
}

export default {
  resolveToIPv4,
  resolveIPv4WithFallback,
};
