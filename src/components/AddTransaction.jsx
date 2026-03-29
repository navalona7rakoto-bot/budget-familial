import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../lib/supabase'
import { ArrowLeft, Check } from 'lucide-react'

export default function AddTransaction({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('expense') // 'income' ou 'expense'
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || !category) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from('transactions').insert([
        {
          user_id: session.user.id,
          type,
          amount: parseFloat(amount),
          category,
          date,
          description: description || null,
        },
      ])

      if (error) throw error

      // Rediriger vers le dashboard avec un message de succès
      navigate('/')
    } catch (error) {
      alert('Erreur lors de l\'enregistrement: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Nouvelle transaction
          </h1>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Type de transaction */}
        <div>
          <label className="label">Type de transaction</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategory('')
              }}
              className={`py-3 rounded-lg font-semibold transition-all ${
                type === 'income'
                  ? 'bg-green-500 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
              }`}
            >
              💰 Revenu
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense')
                setCategory('')
              }}
              className={`py-3 rounded-lg font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-red-500 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-red-500'
              }`}
            >
              💸 Dépense
            </button>
          </div>
        </div>

        {/* Montant */}
        <div>
          <label className="label">
            Montant (Ar) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              className="input text-2xl font-bold pr-12"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="1"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
              Ar
            </span>
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label className="label">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  category === cat.id
                    ? type === 'income'
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                    : 'bg-white border border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-900 flex-1">
                    {cat.name}
                  </span>
                  {category === cat.id && (
                    <Check className={`w-5 h-5 ${type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Description (optionnel) */}
        <div>
          <label className="label">Note (optionnel)</label>
          <textarea
            className="input"
            rows="3"
            placeholder="Ex: Shoprite Tana, Taxi aller-retour..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Bouton enregistrer */}
        <button
          type="submit"
          disabled={loading || !amount || !category}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : '✓ Enregistrer la transaction'}
        </button>
      </form>
    </div>
  )
}
