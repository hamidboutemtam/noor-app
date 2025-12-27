-- ============================================
-- NOOR - Script d'initialisation Supabase
-- ============================================
-- Exécutez ce script dans le SQL Editor de Supabase
-- https://app.supabase.com/project/_/sql

-- 1. Table des citations
-- Cette table sera alimentée par le workflow n8n
CREATE TABLE IF NOT EXISTS citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_fr TEXT NOT NULL,
  text_ar TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('quran', 'hadith_sahih', 'hadith', 'action', 'rappel', 'sagesse')),
  source_ref TEXT,
  moods TEXT[] DEFAULT '{}',
  target TEXT[] DEFAULT '{}' CHECK (target <@ ARRAY['particulier', 'entrepreneur']),
  epreuve BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  has_boost BOOLEAN DEFAULT false,
  preferred_profile TEXT DEFAULT 'particulier' CHECK (preferred_profile IN ('particulier', 'entrepreneur')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des favoris utilisateurs
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  citation_id UUID REFERENCES citations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, citation_id)
);

-- 4. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_citations_moods ON citations USING GIN(moods);
CREATE INDEX IF NOT EXISTS idx_citations_target ON citations USING GIN(target);
CREATE INDEX IF NOT EXISTS idx_citations_epreuve ON citations(epreuve);
CREATE INDEX IF NOT EXISTS idx_citations_source_type ON citations(source_type);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_citation_id ON user_favorites(citation_id);

-- 5. Function pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 6. Triggers pour updated_at
DROP TRIGGER IF EXISTS update_citations_updated_at ON citations;
CREATE TRIGGER update_citations_updated_at
  BEFORE UPDATE ON citations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security (RLS)
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies pour citations (lecture publique)
DROP POLICY IF EXISTS "Anyone can read citations" ON citations;
CREATE POLICY "Anyone can read citations"
  ON citations FOR SELECT
  USING (true);

-- Policy pour l'insertion via service role (workflow n8n)
DROP POLICY IF EXISTS "Service role can insert citations" ON citations;
CREATE POLICY "Service role can insert citations"
  ON citations FOR INSERT
  WITH CHECK (true);

-- Policy pour la mise à jour via service role
DROP POLICY IF EXISTS "Service role can update citations" ON citations;
CREATE POLICY "Service role can update citations"
  ON citations FOR UPDATE
  USING (true);

-- Policies pour profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policies pour user_favorites
DROP POLICY IF EXISTS "Users can read own favorites" ON user_favorites;
CREATE POLICY "Users can read own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON user_favorites;
CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON user_favorites;
CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 8. Fonction pour créer un profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 9. Données de démonstration (optionnel)
-- Décommentez pour insérer des citations de test
/*
INSERT INTO citations (text_fr, text_ar, source_type, source_ref, moods, target, epreuve) VALUES
('Allah ne change pas l''état d''un peuple tant qu''ils ne changent pas ce qui est en eux-mêmes.', 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ', 'quran', 'Sourate Ar-Ra''d, 13:11', ARRAY['motivation', 'procrastination'], ARRAY['particulier', 'entrepreneur'], false),
('Après la difficulté vient certes la facilité.', 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', 'quran', 'Sourate Ash-Sharh, 94:5', ARRAY['stress', 'déprime', 'fatigue', 'epreuve'], ARRAY['particulier', 'entrepreneur'], true),
('Allah n''impose à aucune âme une charge supérieure à sa capacité.', 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', 'quran', 'Sourate Al-Baqarah, 2:286', ARRAY['stress', 'fatigue', 'déprime'], ARRAY['particulier', 'entrepreneur'], true),
('Les actes ne valent que par les intentions.', 'إنما الأعمال بالنيات', 'hadith_sahih', 'Sahih Al-Bukhari, 1', ARRAY['motivation'], ARRAY['particulier', 'entrepreneur'], false),
('Le croyant fort est meilleur et plus aimé d''Allah que le croyant faible.', 'المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف', 'hadith_sahih', 'Sahih Muslim, 2664', ARRAY['motivation', 'fatigue'], ARRAY['entrepreneur', 'particulier'], false),
('La patience est la clé du soulagement.', 'الصبر مفتاح الفرج', 'hadith', 'Rapporté par Al-Bayhaqi', ARRAY['patience', 'stress', 'epreuve'], ARRAY['particulier', 'entrepreneur'], true),
('Tu n''as pas besoin d''aller bien pour avancer. Tu as juste besoin d''avancer.', NULL, 'action', NULL, ARRAY['déprime', 'procrastination', 'fatigue'], ARRAY['particulier'], false),
('La discipline aujourd''hui t''évitera le regret demain.', NULL, 'action', NULL, ARRAY['procrastination'], ARRAY['particulier', 'entrepreneur'], false),
('Le manque de résultats n''est pas une injustice, c''est un signal.', NULL, 'action', NULL, ARRAY['motivation'], ARRAY['entrepreneur'], false),
('L''épreuve n''est pas une punition automatique. C''est souvent une élévation déguisée.', NULL, 'rappel', NULL, ARRAY['epreuve', 'patience'], ARRAY['particulier', 'entrepreneur'], true);
*/

-- 10. Vue pour les statistiques (optionnel)
CREATE OR REPLACE VIEW citations_stats AS
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE source_type = 'quran') as quran_count,
  COUNT(*) FILTER (WHERE source_type = 'hadith_sahih') as hadith_sahih_count,
  COUNT(*) FILTER (WHERE source_type = 'hadith') as hadith_count,
  COUNT(*) FILTER (WHERE source_type = 'action') as action_count,
  COUNT(*) FILTER (WHERE source_type = 'rappel') as rappel_count,
  COUNT(*) FILTER (WHERE source_type = 'sagesse') as sagesse_count,
  COUNT(*) FILTER (WHERE epreuve = true) as epreuve_count
FROM citations;

-- Accès public à la vue stats
GRANT SELECT ON citations_stats TO anon, authenticated;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
-- Votre base de données Noor est maintenant prête !
-- 
-- Prochaines étapes :
-- 1. Configurez le workflow n8n pour alimenter la table citations
-- 2. Copiez l'URL Supabase et la clé anon dans votre fichier .env
-- 3. Lancez l'application avec `npm run dev`
