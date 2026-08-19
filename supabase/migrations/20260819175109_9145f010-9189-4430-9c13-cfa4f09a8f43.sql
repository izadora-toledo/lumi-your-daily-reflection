CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'free',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_music_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  genres TEXT[] NOT NULL DEFAULT '{}',
  favorite_artists TEXT NOT NULL DEFAULT '',
  sad_music_preference TEXT NOT NULL DEFAULT 'depende',
  discovery_level INT NOT NULL DEFAULT 3,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_music_preferences TO authenticated;
GRANT ALL ON public.user_music_preferences TO service_role;
ALTER TABLE public.user_music_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own prefs" ON public.user_music_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_text TEXT NOT NULL,
  detected_mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mood_entries TO authenticated;
GRANT ALL ON public.mood_entries TO service_role;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own moods" ON public.mood_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.generated_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_entry_id UUID REFERENCES public.mood_entries(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_messages TO authenticated;
GRANT ALL ON public.generated_messages TO service_role;
ALTER TABLE public.generated_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.generated_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.music_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_entry_id UUID REFERENCES public.mood_entries(id) ON DELETE SET NULL,
  song TEXT NOT NULL,
  artist TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  spotify_url TEXT NOT NULL DEFAULT '',
  mood_label TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.music_recommendations TO authenticated;
GRANT ALL ON public.music_recommendations TO service_role;
ALTER TABLE public.music_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own recs" ON public.music_recommendations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();