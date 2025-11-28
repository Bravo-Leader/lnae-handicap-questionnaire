'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ResponseList from '@/components/admin/ResponseList'
import ResponseCards from '@/components/admin/ResponseCards'
import Statistics from '@/components/admin/Statistics'

type Response = {
  id: string
  createdAt: string
  clubName: string
  respondentRole: string
  hasLabel: string
  hasWelcomedDisabled: string
  handicapTypes: string[]
  supportExpectations: any
  adaptedMaterial: string[]
  desiredAccess: string[]
  [key: string]: any
}

export default function AdminDashboard() {
  const router = useRouter()
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<'list' | 'cards' | 'stats'>('list')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    const adminData = localStorage.getItem('adminData')
    if (adminData) {
      const admin = JSON.parse(adminData)
      setIsSuperAdmin(admin.isSuperAdmin || false)
    }
    setIsAuthenticated(true)
    fetchResponses(token)
  }, [router])

  const fetchResponses = async (token: string) => {
    try {
      const response = await fetch(`/api/responses?token=${token}`)
      if (response.ok) {
        const data = await response.json()
        setResponses(data.data)
      } else {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching responses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-base-100 shadow-lg">
        <div className="container-custom py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Panneau d'Administration
              </h1>
              <p className="text-gray-600">Commission Handicap - Questionnaires</p>
            </div>
            <div className="flex gap-2">
              {isSuperAdmin && (
                <button
                  onClick={() => router.push('/admin/super')}
                  className="btn btn-primary btn-outline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Gestion Admins
                </button>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-error">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Total Réponses</div>
              <div className="stat-value text-primary">{responses.length}</div>
              <div className="stat-desc">Questionnaires collectés</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Clubs Labellisés</div>
              <div className="stat-value text-success">
                {responses.filter((r) => r.hasLabel === 'Oui').length}
              </div>
              <div className="stat-desc">Sport Handisport</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Avec Expérience</div>
              <div className="stat-value text-info">
                {responses.filter((r) => r.hasWelcomedDisabled === 'Oui').length}
              </div>
              <div className="stat-desc">Ont accueilli des PSH</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Demandes Support</div>
              <div className="stat-value text-warning">
                {responses.filter((r) => r.wantsLabelSupport === 'Oui').length}
              </div>
              <div className="stat-desc">Veulent un accompagnement</div>
            </div>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('list')}
            className={`btn ${view === 'list' ? 'btn-primary' : 'btn-outline'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Vue Liste
          </button>
          <button
            onClick={() => setView('cards')}
            className={`btn ${view === 'cards' ? 'btn-primary' : 'btn-outline'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Vue Cartes
          </button>
          <button
            onClick={() => setView('stats')}
            className={`btn ${view === 'stats' ? 'btn-primary' : 'btn-outline'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistiques
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {view === 'list' && <ResponseList responses={responses} />}
            {view === 'cards' && <ResponseCards responses={responses} />}
            {view === 'stats' && <Statistics responses={responses} />}
          </>
        )}
      </div>
    </div>
  )
}
