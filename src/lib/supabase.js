import { createClient } from '@supabase/supabase-js'

// INSTRUCTIONS: Remplace ces valeurs par tes vraies clés Supabase
// 1. Va sur https://supabase.com
// 2. Crée un nouveau projet
// 3. Va dans Settings > API
// 4. Copie l'URL du projet et la clé "anon" (publique)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper pour formater les montants en Ariary
export const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' Ar'
}

// Helper pour formater les dates
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Catégories par défaut
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salaire', icon: '💼' },
  { id: 'freelance', name: 'Freelance / Travail indépendant', icon: '💻' },
  { id: 'investments', name: 'Investissements / Loyers perçus', icon: '📈' },
  { id: 'allowances', name: 'Allocations / Aides sociales', icon: '🏛️' },
  { id: 'other_income', name: 'Autres revenus', icon: '💰' },
]

export const EXPENSE_CATEGORIES = [
  { id: 'rent', name: 'Loyer / Crédit immobilier', icon: '🏠' },
  { id: 'utilities', name: 'JIRAMA (eau + électricité)', icon: '⚡' },
  { id: 'groceries', name: 'Courses alimentaires', icon: '🛒' },
  { id: 'transport', name: 'Transport (essence, taxi, bus)', icon: '🚗' },
  { id: 'health', name: 'Santé (médecin, pharmacie, mutuelle)', icon: '🏥' },
  { id: 'education', name: 'Éducation (école, fournitures)', icon: '📚' },
  { id: 'leisure', name: 'Loisirs / Sorties', icon: '🎉' },
  { id: 'savings', name: 'Épargne', icon: '🏦' },
  { id: 'clothing', name: 'Vêtements', icon: '👕' },
  { id: 'phone', name: 'Téléphone / Internet', icon: '📱' },
  { id: 'insurance', name: 'Assurances', icon: '🛡️' },
  { id: 'other_expense', name: 'Autres dépenses', icon: '💸' },
]

// Récupérer toutes les catégories
export const getAllCategories = () => {
  return {
    income: INCOME_CATEGORIES,
    expense: EXPENSE_CATEGORIES,
  }
}

// Trouver une catégorie par ID
export const getCategoryById = (categoryId, type) => {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  return categories.find(cat => cat.id === categoryId)
}
