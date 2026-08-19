-- Keep plan and billing state server-controlled.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('free', 'pro'));

ALTER TABLE public.user_music_preferences
  ADD CONSTRAINT preferences_discovery_level_check CHECK (discovery_level BETWEEN 1 AND 5),
  ADD CONSTRAINT preferences_sad_choice_check
    CHECK (sad_music_preference IN ('combinar', 'melhorar', 'depende'));

ALTER TABLE public.music_recommendations
  ADD CONSTRAINT recommendations_feedback_check
    CHECK (feedback IS NULL OR feedback IN ('love', 'neutral', 'dislike'));

CREATE INDEX generated_messages_user_created_idx
  ON public.generated_messages (user_id, created_at DESC);
CREATE INDEX generated_messages_user_favorite_idx
  ON public.generated_messages (user_id, favorite)
  WHERE favorite = true;
CREATE INDEX music_recommendations_user_created_idx
  ON public.music_recommendations (user_id, created_at DESC);

REVOKE INSERT, DELETE, UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (name, email, onboarded) ON public.profiles TO authenticated;

REVOKE UPDATE ON public.generated_messages FROM authenticated;
GRANT UPDATE (favorite) ON public.generated_messages TO authenticated;

REVOKE UPDATE ON public.music_recommendations FROM authenticated;
GRANT UPDATE (feedback) ON public.music_recommendations TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_lumi_free_limits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_plan TEXT;
  daily_count INTEGER;
  favorite_count INTEGER;
BEGIN
  SELECT plan INTO current_plan
  FROM public.profiles
  WHERE id = NEW.user_id;

  IF COALESCE(current_plan, 'free') = 'free' THEN
    IF TG_OP = 'INSERT' THEN
      SELECT COUNT(*) INTO daily_count
      FROM public.generated_messages
      WHERE user_id = NEW.user_id
        AND created_at >= date_trunc('day', now());

      IF daily_count >= 3 THEN
        RAISE EXCEPTION 'Limite diário do plano Free atingido';
      END IF;
    END IF;

    IF NEW.favorite = true THEN
      IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.favorite = false) THEN
        SELECT COUNT(*) INTO favorite_count
        FROM public.generated_messages
        WHERE user_id = NEW.user_id
          AND favorite = true;

        IF favorite_count >= 5 THEN
          RAISE EXCEPTION 'Limite de favoritos do plano Free atingido';
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_free_message_limits
BEFORE INSERT OR UPDATE OF favorite ON public.generated_messages
FOR EACH ROW EXECUTE FUNCTION public.enforce_lumi_free_limits();

CREATE OR REPLACE FUNCTION public.enforce_pro_music_recommendation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = NEW.user_id AND plan = 'pro'
  ) THEN
    RAISE EXCEPTION 'Recomendações musicais estão disponíveis apenas no Lumi Pro';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_pro_music_insert
BEFORE INSERT ON public.music_recommendations
FOR EACH ROW EXECUTE FUNCTION public.enforce_pro_music_recommendation();

REVOKE EXECUTE ON FUNCTION public.enforce_lumi_free_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_pro_music_recommendation() FROM PUBLIC, anon, authenticated;
