import { createHash } from 'crypto';
import { supabaseAdmin } from '@/utils/supabase/admin';

const MAX_GENERATIONS_PER_MONTH = 1000;

// Hash IP for privacy
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

// Get current month string
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Get client IP from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

// Check if IP has already generated this month
export async function hasIPGeneratedThisMonth(ipHash: string): Promise<boolean> {
  const month = getCurrentMonth();

  const { data, error } = await supabaseAdmin
    .from('generations')
    .select('id')
    .eq('ip_hash', ipHash)
    .eq('month', month)
    .limit(1);

  if (error) {
    console.error('Error checking IP:', error);
    throw new Error('Database error');
  }

  return (data?.length || 0) > 0;
}

// Check if global limit has been reached
export async function hasReachedGlobalLimit(): Promise<{
  reached: boolean;
  count: number;
}> {
  const month = getCurrentMonth();

  // Try to get from counter table
  const { data: counterData } = await supabaseAdmin
    .from('monthly_counter')
    .select('count')
    .eq('month', month)
    .single();

  if (counterData) {
    return {
      reached: counterData.count >= MAX_GENERATIONS_PER_MONTH,
      count: counterData.count,
    };
  }

  // Fallback: count from generations table
  const { count, error } = await supabaseAdmin
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('month', month);

  if (error) {
    console.error('Error checking global limit:', error);
    throw new Error('Database error');
  }

  return {
    reached: (count || 0) >= MAX_GENERATIONS_PER_MONTH,
    count: count || 0,
  };
}

// Record a generation
export async function recordGeneration(ipHash: string): Promise<void> {
  const month = getCurrentMonth();

  // Insert generation record
  const { error: insertError } = await supabaseAdmin
    .from('generations')
    .insert({ ip_hash: ipHash, month });

  if (insertError) {
    console.error('Error recording generation:', insertError);
    throw new Error('Database error');
  }

  // Increment monthly counter
  await supabaseAdmin.rpc('increment_monthly_counter', { month_param: month });
}