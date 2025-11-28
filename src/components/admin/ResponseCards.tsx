'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  wantsLabelSupport?: string
  [key: string]: any
}

export default function ResponseCards({ responses }: { responses: Response[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLabel, setFilterLabel] = useState<string>('all')
  const [filterExperience, setFilterExperience] = useState<string>('all')

  let filteredResponses = responses.filter((r) =>
    r.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (filterLabel !== 'all') {
    filteredResponses = filteredResponses.filter((r) => r.hasLabel === filterLabel)
  }

  if (filterExperience !== 'all') {
    filteredResponses = filteredResponses.filter(
      (r) => r.hasWelcomedDisabled === filterExperience
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Recherche</span>
              </label>
              <input
                type="text"
                placeholder="Nom du club..."
                className="input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Filtre Label</span>
              </label>
              <select
                className="select select-bordered"
                value={filterLabel}
                onChange={(e) => setFilterLabel(e.target.value)}
              >
                <option value="all">Tous</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
                <option value="En cours de démarche">En cours</option>
                <option value="Je ne sais pas">Ne sait pas</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Filtre Expérience</span>
              </label>
              <select
                className="select select-bordered"
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
              >
                <option value="all">Tous</option>
                <option value="Oui">Avec expérience</option>
                <option value="Non">Sans expérience</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResponses.map((response) => (
          <div key={response.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start mb-2">
                <h2 className="card-title text-lg">{response.clubName}</h2>
                <div className="text-xs text-gray-500">
                  {format(new Date(response.createdAt), 'dd/MM/yyyy', { locale: fr })}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Fonction</p>
                  <p className="text-sm font-medium">{response.respondentRole}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`badge badge-sm ${
                      response.hasLabel === 'Oui'
                        ? 'badge-success'
                        : response.hasLabel === 'En cours de démarche'
                        ? 'badge-warning'
                        : 'badge-ghost'
                    }`}
                  >
                    Label: {response.hasLabel}
                  </span>
                  <span
                    className={`badge badge-sm ${
                      response.hasWelcomedDisabled === 'Oui'
                        ? 'badge-info'
                        : 'badge-ghost'
                    }`}
                  >
                    Expérience: {response.hasWelcomedDisabled}
                  </span>
                </div>

                {response.wantsLabelSupport === 'Oui' && (
                  <div className="alert alert-warning py-2 px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-xs">Demande d'accompagnement</span>
                  </div>
                )}

                {response.hasWelcomedDisabled === 'Oui' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Types de handicaps</p>
                      <div className="flex flex-wrap gap-1">
                        {response.handicapTypes.slice(0, 2).map((type: string, idx: number) => (
                          <span key={idx} className="badge badge-sm badge-primary">
                            {type.split('(')[0].trim()}
                          </span>
                        ))}
                        {response.handicapTypes.length > 2 && (
                          <span className="badge badge-sm badge-outline">
                            +{response.handicapTypes.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-1">Besoins principaux</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(response.supportExpectations) &&
                      response.supportExpectations.slice(0, 2).map((exp: string, idx: number) => (
                        <span key={idx} className="badge badge-sm badge-secondary">
                          {exp.split('(')[0].substring(0, 20)}...
                        </span>
                      ))}
                    {Array.isArray(response.supportExpectations) &&
                      response.supportExpectations.length > 2 && (
                        <span className="badge badge-sm badge-outline">
                          +{response.supportExpectations.length - 2}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <label
                  htmlFor={`modal-${response.id}`}
                  className="btn btn-sm btn-primary"
                >
                  Voir détails
                </label>
              </div>
            </div>

            {/* Detail Modal */}
            <input type="checkbox" id={`modal-${response.id}`} className="modal-toggle" />
            <div className="modal">
              <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-2xl mb-4">{response.clubName}</h3>

                <div className="space-y-4">
                  {/* Section I */}
                  <div className="divider">Informations Générales</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Fonction du répondant</p>
                      <p className="font-semibold">{response.respondentRole}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Label Sport Handisport</p>
                      <p className="font-semibold">{response.hasLabel}</p>
                    </div>
                  </div>

                  {/* Section II */}
                  {response.hasWelcomedDisabled === 'Oui' && (
                    <>
                      <div className="divider">Expérience d'Accueil</div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Types de handicaps accueillis</p>
                        <div className="flex flex-wrap gap-2">
                          {response.handicapTypes.map((type: string, idx: number) => (
                            <span key={idx} className="badge badge-primary">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      {response.adaptationStory && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Bonne pratique</p>
                          <p className="bg-base-200 p-4 rounded-lg">
                            {response.adaptationStory}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Section III */}
                  <div className="divider">Besoins et Attentes</div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Matériel adapté</p>
                    <div className="flex flex-wrap gap-2">
                      {response.adaptedMaterial.map((mat: string, idx: number) => (
                        <span key={idx} className="badge badge-accent">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-action">
                  <label htmlFor={`modal-${response.id}`} className="btn">
                    Fermer
                  </label>
                </div>
              </div>
              <label className="modal-backdrop" htmlFor={`modal-${response.id}`}>
                Close
              </label>
            </div>
          </div>
        ))}
      </div>

      {filteredResponses.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-16 text-gray-500">
            Aucune réponse trouvée
          </div>
        </div>
      )}
    </div>
  )
}
