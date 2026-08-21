CREATE TABLE public.fortune_cookie_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fortune_id INTEGER NOT NULL CHECK (fortune_id BETWEEN 1 AND 500),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  fortune_date DATE NOT NULL,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, fortune_date)
);

CREATE INDEX fortune_cookie_history_user_opened_idx
  ON public.fortune_cookie_history (user_id, opened_at DESC);

ALTER TABLE public.fortune_cookie_history ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.fortune_cookie_history TO authenticated;
GRANT ALL ON public.fortune_cookie_history TO service_role;

CREATE POLICY "pro users read own fortune history"
ON public.fortune_cookie_history
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.plan = 'pro'
  )
);

CREATE POLICY "pro users open own fortune"
ON public.fortune_cookie_history
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.plan = 'pro'
  )
);
