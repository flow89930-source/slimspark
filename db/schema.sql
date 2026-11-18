CREATE TABLE app.meal_ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  day_key text NOT NULL,
  attempts integer NOT NULL,
  recent_requests jsonb NOT NULL,
  blocked_until timestamptz,
  version integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_key)
);

CREATE INDEX meal_ai_usage_user_day_idx ON app.meal_ai_usage (user_id, day_key);

CREATE TABLE app.meal_ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text NOT NULL,
  dish text NOT NULL,
  confidence integer NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cache_key)
);

CREATE INDEX meal_ai_cache_expires_idx ON app.meal_ai_cache (expires_at);
