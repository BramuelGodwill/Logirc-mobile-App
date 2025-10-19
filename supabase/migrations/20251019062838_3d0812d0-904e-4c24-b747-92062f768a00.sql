-- Update plans with correct search limits
UPDATE public.plans SET search_limit = 15 WHERE name = 'Free';
UPDATE public.plans SET search_limit = 300 WHERE name = 'Pro';
UPDATE public.plans SET search_limit = -1 WHERE name = 'Enterprise'; -- -1 for unlimited

-- Create cron job to reset daily searches at midnight
-- First enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily reset at midnight UTC
SELECT cron.schedule(
  'reset-daily-searches',
  '0 0 * * *', -- At 00:00 every day
  $$
  SELECT public.reset_daily_searches();
  $$
);

-- Add function to check search limit
CREATE OR REPLACE FUNCTION public.check_search_limit(user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
  remaining integer;
BEGIN
  -- Get user profile with plan info
  SELECT 
    p.daily_searches_used,
    p.daily_searches_limit,
    p.plan_type,
    p.last_search_reset_at
  INTO profile_record
  FROM public.profiles p
  WHERE p.id = user_id;

  -- If no profile found, return error
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'Profile not found'
    );
  END IF;

  -- Check if reset is needed (more than 24 hours since last reset)
  IF profile_record.last_search_reset_at < (now() - interval '1 day') THEN
    UPDATE public.profiles
    SET 
      daily_searches_used = 0,
      last_search_reset_at = now()
    WHERE id = user_id;
    
    profile_record.daily_searches_used := 0;
  END IF;

  -- Calculate remaining searches
  IF profile_record.daily_searches_limit = -1 THEN
    remaining := -1; -- Unlimited
  ELSE
    remaining := profile_record.daily_searches_limit - profile_record.daily_searches_used;
  END IF;

  -- Check if limit exceeded
  IF profile_record.daily_searches_limit != -1 
     AND profile_record.daily_searches_used >= profile_record.daily_searches_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'Daily search limit exceeded',
      'used', profile_record.daily_searches_used,
      'limit', profile_record.daily_searches_limit,
      'remaining', 0,
      'plan_type', profile_record.plan_type
    );
  END IF;

  -- Allow search and increment counter
  UPDATE public.profiles
  SET daily_searches_used = daily_searches_used + 1
  WHERE id = user_id;

  RETURN jsonb_build_object(
    'allowed', true,
    'used', profile_record.daily_searches_used + 1,
    'limit', profile_record.daily_searches_limit,
    'remaining', CASE WHEN remaining = -1 THEN -1 ELSE remaining - 1 END,
    'plan_type', profile_record.plan_type
  );
END;
$$;