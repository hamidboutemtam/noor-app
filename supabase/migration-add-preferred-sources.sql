-- Migration: Ajouter preferred_sources aux profils utilisateurs
-- Permet aux utilisateurs de choisir leurs sources préférées de citations

-- Ajouter la colonne preferred_sources (array de types de sources)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS preferred_sources TEXT[] DEFAULT ARRAY['quran', 'hadith_sahih', 'hadith', 'action', 'rappel', 'sagesse'];

-- Ajouter une contrainte pour valider les valeurs
ALTER TABLE profiles
ADD CONSTRAINT check_preferred_sources
CHECK (preferred_sources <@ ARRAY['quran', 'hadith_sahih', 'hadith', 'action', 'rappel', 'sagesse']);

-- Créer un index GIN pour les recherches efficaces
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_sources
ON profiles USING GIN(preferred_sources);

-- Commentaire pour documentation
COMMENT ON COLUMN profiles.preferred_sources IS 'Sources de citations préférées par l''utilisateur. Utilisé pour prioriser certains types de citations.';
