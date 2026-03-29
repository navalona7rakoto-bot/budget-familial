import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, User, Mail, Calendar, LogOut, AlertCircle } from 'lucide-react'

export default function Profile({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      alert('Erreur lors de la déconnexion: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const userMetadata = session?.user?.user_metadata || {}
  const createdAt = session?.user?.created_at
    ? new Date(session.user.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Non disponible'

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
          <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Avatar et nom */}
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-white rounded-full text-3xl font-bold mb-4">
            {userMetadata.name?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {userMetadata.name || 'Utilisateur'}
          </h2>
          <p className="text-gray-600">{session?.user?.email}</p>
        </div>

        {/* Informations du compte */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-900 mb-3">Informations du compte</h3>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium text-gray-900">
                {userMetadata.name || 'Non renseigné'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Membre depuis</p>
              <p className="font-medium text-gray-900">{createdAt}</p>
            </div>
          </div>
        </div>

        {/* À propos de l'application */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">À propos</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Budget Familial</strong> - Version 1.0.0
            </p>
            <p>
              Application de gestion des finances familiales, simple et intuitive.
            </p>
            <p className="pt-2">
              Made with ❤️ pour Madagascar et l'Afrique francophone
            </p>
          </div>
        </div>

        {/* Note importante */}
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Version de test</p>
              <p>
                Cette application est en phase de test. Vos données sont stockées
                de manière sécurisée mais peuvent être réinitialisées pendant la
                phase de développement.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de déconnexion */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-5 h-5" />
          {loading ? 'Déconnexion...' : 'Se déconnecter'}
        </button>

        {/* Espace pour la navigation */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
