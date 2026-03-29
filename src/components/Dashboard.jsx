import { useState, useEffect } from 'react'
import { supabase, formatAmount, getCategoryById } from '../lib/supabase'
import { TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    remaining: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [currentMonth, setCurrentMonth] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [session])

  const loadDashboardData = async () => {
    try {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      setCurrentMonth(
        now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      )

      // Récupérer les transactions du mois en cours
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('date', `${year}-${String(month).padStart(2, '0')}-01`)
        .lt(
          'date',
          `${month === 12 ? year + 1 : year}-${String(
            month === 12 ? 1 : month + 1
          ).padStart(2, '0')}-01`
        )
        .order('date', { ascending: false })

      if (error) throw error

      // Calculer les totaux
      let totalIncome = 0
      let totalExpense = 0

      transactions?.forEach((t) => {
        if (t.type === 'income') {
          totalIncome += t.amount
        } else {
          totalExpense += t.amount
        }
      })

      setStats({
        totalIncome,
        totalExpense,
        remaining: totalIncome - totalExpense,
      })

      // Garder seulement les 5 dernières transactions
      setRecentTransactions(transactions?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Familial</h1>
          <p className="text-gray-600 capitalize">{currentMonth}</p>
        </div>
        <div className="bg-primary text-white rounded-full p-3">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

      {/* Reste à vivre - Carte principale */}
      <div
        className={`card ${
          stats.remaining >= 0
            ? 'bg-gradient-to-br from-green-500 to-green-600'
            : 'bg-gradient-to-br from-red-500 to-red-600'
        } text-white`}
      >
        <div className="text-center">
          <p className="text-white/90 text-sm font-medium mb-2">
            💰 Reste à vivre
          </p>
          <p className="text-4xl font-bold mb-1">
            {formatAmount(Math.abs(stats.remaining))}
          </p>
          {stats.remaining < 0 && (
            <p className="text-white/90 text-sm">
              ⚠️ Dépassement de budget
            </p>
          )}
        </div>
      </div>

      {/* Revenus et Dépenses */}
      <div className="grid grid-cols-2 gap-4">
        {/* Revenus */}
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-green-700">REVENUS</span>
          </div>
          <p className="text-xl font-bold text-green-700">
            {formatAmount(stats.totalIncome)}
          </p>
        </div>

        {/* Dépenses */}
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-xs font-medium text-red-700">DÉPENSES</span>
          </div>
          <p className="text-xl font-bold text-red-700">
            {formatAmount(stats.totalExpense)}
          </p>
        </div>
      </div>

      {/* Dernières transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Dernières transactions
          </h2>
          <Link
            to="/history"
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Aucune transaction ce mois-ci</p>
            <Link
              to="/add"
              className="text-primary font-medium hover:underline"
            >
              Ajouter votre première transaction
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = getCategoryById(
                transaction.category,
                transaction.type
              )
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        transaction.type === 'income'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {category?.icon || '💰'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {category?.name || transaction.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA si pas de transactions */}
      {recentTransactions.length === 0 && (
        <Link
          to="/add"
          className="block bg-primary text-white text-center py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          ➕ Ajouter ma première transaction
        </Link>
      )}
    </div>
  )
}
