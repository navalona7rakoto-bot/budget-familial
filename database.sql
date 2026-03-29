-- =====================================================
-- BUDGET FAMILIAL - SCHEMA BASE DE DONNÉES SUPABASE
-- =====================================================

-- Table: transactions
-- Stocke toutes les transactions (revenus et dépenses)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Chaque utilisateur ne peut voir que ses propres données
-- =====================================================

-- Activer RLS sur la table transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leurs propres transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent créer leurs propres transactions
CREATE POLICY "Users can create own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent modifier leurs propres transactions
CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Les utilisateurs peuvent supprimer leurs propres transactions
CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGER POUR UPDATED_AT
-- Met à jour automatiquement le champ updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONNÉES DE DÉMONSTRATION (OPTIONNEL)
-- Décommentez pour créer des transactions de test
-- =====================================================

/*
-- Remplacez 'YOUR_USER_ID' par un vrai UUID utilisateur
INSERT INTO transactions (user_id, type, amount, category, date, description) VALUES
  ('YOUR_USER_ID', 'income', 1500000, 'salary', '2026-03-01', 'Salaire mars 2026'),
  ('YOUR_USER_ID', 'expense', 400000, 'rent', '2026-03-05', 'Loyer appartement'),
  ('YOUR_USER_ID', 'expense', 85000, 'utilities', '2026-03-10', 'JIRAMA mars'),
  ('YOUR_USER_ID', 'expense', 150000, 'groceries', '2026-03-15', 'Courses Shoprite'),
  ('YOUR_USER_ID', 'expense', 50000, 'transport', '2026-03-20', 'Essence + Taxi'),
  ('YOUR_USER_ID', 'income', 200000, 'freelance', '2026-03-25', 'Projet client');
*/
