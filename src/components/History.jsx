import { useState, useEffect } from 'react'
import { supabase, formatAmount, getCategoryById } from '../lib/supabase'
import { ArrowLeft, Search, Trash2, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function History({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [filterType, setFilterType] = useState('all') // 'all', 'income', 'expense'
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [session])

  useEffect(() => {
    filterTransactions()
  }, [transactions, filterType, searchTerm])

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    // Filtre par type
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter((t) => {
        const category = getCategoryById(t.category, t.type)
        const categoryName = category?.name.toLowerCase() || ''
        const description = t.description?.toLowerCase() || ''
        const term = searchTerm.toLowerCase()
        return categoryName.includes(term) || description.includes(term)
      })
    }

    setFilteredTransactions(filtered)
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette transaction ?')) return

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Recharger les transactions
      loadTransactions()
    } catch (error) {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  // Grouper par mois
  const groupByMonth = (transactions) => {
    const groups = {}
    transactions.forEach((t) => {
      const monthKey = new Date(t.date).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
      if (!groups[monthKey]) {
        groups[monthKey] = []
      }
      groups[monthKey].push(t)
    })
    return groups
  }

  const groupedTransactions = groupByMonth(filteredTransactions)

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
            <h1 className="text-xl font-bold text-gray-900">Historique</h1>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Revenus
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dépenses
            </button>
          </div>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune transaction trouvée</p>
            <button
              onClick={() => navigate('/add')}
              className="btn-primary"
            >
              Ajouter une transaction
            </button>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([month, transactions]) => (
            <div key={month}>
              {/* En-tête du mois */}
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3 capitalize">
                {month}
              </h2>

              {/* Transactions du mois */}
              <div className="space-y-2">
                {transactions.map((transaction) => {
                  const category = getCategoryById(
                    transaction.category,
                    transaction.type
                  )

                  return (
                    <div
                      key={transaction.id}
                      className="card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        {/* Icône */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                            transaction.type === 'income'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                          }`}
                        >
                          {category?.icon || '💰'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {category?.name || transaction.category}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString(
                              'fr-FR',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </p>
                          {transaction.description && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {transaction.description}
                            </p>
                          )}
                        </div>

                        {/* Montant */}
                        <div className="text-right shrink-0">
                          <p
                            className={`font-bold text-lg ${
                              transaction.type === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatAmount(transaction.amount)}
                          </p>
                        </div>

                        {/* Bouton supprimer */}
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors shrink-0"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
