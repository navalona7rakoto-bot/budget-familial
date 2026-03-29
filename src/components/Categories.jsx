import { useState, useEffect } from 'react'
import { supabase, formatAmount, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../lib/supabase'
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Categories({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('expense') // 'income' ou 'expense'
  const [categoryStats, setCategoryStats] = useState([])
  const [currentMonth, setCurrentMonth] = useState('')

  useEffect(() => {
    loadCategoryStats()
  }, [session, activeTab])

  const loadCategoryStats = async () => {
    try {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      setCurrentMonth(
        now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      )

      // Récupérer toutes les transactions du mois par type
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('type', activeTab)
        .gte('date', `${year}-${String(month).padStart(2, '0')}-01`)
        .lt(
          'date',
          `${month === 12 ? year + 1 : year}-${String(
            month === 12 ? 1 : month + 1
          ).padStart(2, '0')}-01`
        )

      if (error) throw error

      // Grouper par catégorie
      const categories = activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
      const stats = categories.map((category) => {
        const categoryTransactions = transactions?.filter(
          (t) => t.category === category.id
        ) || []
        
        const total = categoryTransactions.reduce(
          (sum, t) => sum + t.amount,
          0
        )

        return {
          ...category,
          total,
          count: categoryTransactions.length,
        }
      })

      // Trier par montant décroissant
      stats.sort((a, b) => b.total - a.total)
      setCategoryStats(stats)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculer le total
  const grandTotal = categoryStats.reduce((sum, cat) => sum + cat.total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Budget par catégorie</h1>
              <p className="text-sm text-gray-600 capitalize">{currentMonth}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('income')}
              className={`py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Revenus
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-1" />
              Dépenses
            </button>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="p-4 max-w-lg mx-auto">
        <div
          className={`card ${
            activeTab === 'income'
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-gradient-to-br from-red-500 to-red-600'
          } text-white mb-6`}
        >
          <div className="text-center">
            <p className="text-white/90 text-sm font-medium mb-1">
              Total {activeTab === 'income' ? 'revenus' : 'dépenses'}
            </p>
            <p className="text-3xl font-bold">
              {formatAmount(grandTotal)}
            </p>
          </div>
        </div>

        {/* Liste des catégories */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categoryStats.map((category) => {
              const percentage = grandTotal > 0 ? (category.total / grandTotal) * 100 : 0

              return (
                <div
                  key={category.id}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Icône */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        activeTab === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {category.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {category.count} transaction{category.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <p
                            className={`font-bold text-lg ${
                              activeTab === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {formatAmount(category.total)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {percentage.toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      {category.total > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              activeTab === 'income' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Message si aucune transaction */}
        {!loading && categoryStats.every((cat) => cat.total === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Aucun{activeTab === 'income' ? ' revenu' : 'e dépense'} ce mois-ci
            </p>
            <button
              onClick={() => navigate('/add')}
              className="btn-primary"
            >
              Ajouter une transaction
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
