'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type Admin = {
  id: string
  email: string
  name: string | null
  isSuperAdmin: boolean
  createdAt: string
  updatedAt: string
}

export default function SuperAdminPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    isSuperAdmin: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkSuperAdmin()
  }, [])

  const checkSuperAdmin = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const adminData = localStorage.getItem('adminData')
    if (adminData) {
      const admin = JSON.parse(adminData)
      if (!admin.isSuperAdmin) {
        router.push('/admin/dashboard')
        return
      }
      setIsSuperAdmin(true)
      fetchAdmins(token)
    } else {
      router.push('/admin/login')
    }
  }

  const fetchAdmins = async (token: string) => {
    try {
      const response = await fetch('/api/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAdmins(data.data)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setAdmins([data.data, ...admins])
        setShowCreateModal(false)
        setFormData({ email: '', password: '', name: '', isSuperAdmin: false })
      } else {
        setError(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return
    }

    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch(`/api/admins?id=${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setAdmins(admins.filter((admin) => admin.id !== adminId))
      } else {
        const data = await response.json()
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur de connexion')
    }
  }

  if (!isSuperAdmin || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-base-100 shadow-lg">
        <div className="container-custom py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Panneau Super Administrateur
              </h1>
              <p className="text-gray-600">Gestion des comptes administrateurs</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="btn btn-outline"
              >
                Retour au Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken')
                  localStorage.removeItem('adminData')
                  router.push('/admin/login')
                }}
                className="btn btn-outline btn-error"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Total Admins</div>
              <div className="stat-value text-primary">{admins.length}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Super Admins</div>
              <div className="stat-value text-success">
                {admins.filter((a) => a.isSuperAdmin).length}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Admins Standards</div>
              <div className="stat-value text-info">
                {admins.filter((a) => !a.isSuperAdmin).length}
              </div>
            </div>
          </div>
        </div>

        {/* Admin List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-2xl">Liste des Administrateurs</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer un Admin
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Créé le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="font-semibold">{admin.email}</td>
                      <td>{admin.name || <span className="text-gray-400">-</span>}</td>
                      <td>
                        <span
                          className={`badge ${
                            admin.isSuperAdmin ? 'badge-success' : 'badge-info'
                          }`}
                        >
                          {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td>
                        {format(new Date(admin.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="btn btn-sm btn-error btn-outline"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {admins.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun administrateur trouvé
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Créer un Administrateur</h3>

            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email *</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Mot de passe *</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                />
                <label className="label">
                  <span className="label-text-alt">Minimum 8 caractères</span>
                </label>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nom (optionnel)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-control mb-6">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={formData.isSuperAdmin}
                    onChange={(e) =>
                      setFormData({ ...formData, isSuperAdmin: e.target.checked })
                    }
                  />
                  <span className="label-text font-semibold">Super Administrateur</span>
                </label>
                <label className="label">
                  <span className="label-text-alt text-warning">
                    Les Super Admins peuvent gérer les autres comptes administrateurs
                  </span>
                </label>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setError('')
                    setFormData({ email: '', password: '', name: '', isSuperAdmin: false })
                  }}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Création...
                    </>
                  ) : (
                    'Créer'
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button
              onClick={() => {
                setShowCreateModal(false)
                setError('')
              }}
            >
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  )
}
