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
  [key: string]: any
}

export default function ResponseList({ responses }: { responses: Response[] }) {
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredResponses = responses.filter((r) =>
    r.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Search */}
          <div className="form-control mb-4">
            <input
              type="text"
              placeholder="Rechercher un club..."
              className="input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Club</th>
                  <th>Fonction</th>
                  <th>Label</th>
                  <th>Expérience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map((response) => (
                  <tr key={response.id}>
                    <td>
                      {format(new Date(response.createdAt), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="font-semibold">{response.clubName}</td>
                    <td>{response.respondentRole}</td>
                    <td>
                      <span
                        className={`badge ${
                          response.hasLabel === 'Oui'
                            ? 'badge-success'
                            : response.hasLabel === 'En cours de démarche'
                            ? 'badge-warning'
                            : 'badge-ghost'
                        }`}
                      >
                        {response.hasLabel}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          response.hasWelcomedDisabled === 'Oui'
                            ? 'badge-info'
                            : 'badge-ghost'
                        }`}
                      >
                        {response.hasWelcomedDisabled}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedResponse(response)}
                        className="btn btn-sm btn-primary"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResponses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune réponse trouvée
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedResponse && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-2xl mb-4">{selectedResponse.clubName}</h3>

            <div className="space-y-4">
              {/* Section I */}
              <div className="divider">Informations Générales</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fonction du répondant</p>
                  <p className="font-semibold">{selectedResponse.respondentRole}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Label Sport Handisport</p>
                  <p className="font-semibold">{selectedResponse.hasLabel}</p>
                </div>
                {selectedResponse.wantsLabelSupport && (
                  <div>
                    <p className="text-sm text-gray-500">Souhaite un accompagnement</p>
                    <p className="font-semibold">{selectedResponse.wantsLabelSupport}</p>
                  </div>
                )}
              </div>

              {/* Section II */}
              {selectedResponse.hasWelcomedDisabled === 'Oui' && (
                <>
                  <div className="divider">Expérience d'Accueil</div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Types de handicaps accueillis</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedResponse.handicapTypes.map((type: string, idx: number) => (
                        <span key={idx} className="badge badge-primary">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Public accueilli</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedResponse.publicTypes.map((type: string, idx: number) => (
                        <span key={idx} className="badge badge-info">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedResponse.adaptationStory && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Bonne pratique partagée</p>
                      <p className="bg-base-200 p-4 rounded-lg">
                        {selectedResponse.adaptationStory}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Section III */}
              <div className="divider">Besoins et Attentes</div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Attentes d'accompagnement</p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedResponse.supportExpectations) &&
                    selectedResponse.supportExpectations.map((exp: string, idx: number) => (
                      <span key={idx} className="badge badge-secondary">
                        {exp}
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Matériel adapté souhaité</p>
                <div className="flex flex-wrap gap-2">
                  {selectedResponse.adaptedMaterial.map((mat: string, idx: number) => (
                    <span key={idx} className="badge badge-accent">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Accès souhaités</p>
                <div className="flex flex-wrap gap-2">
                  {selectedResponse.desiredAccess.map((access: string, idx: number) => (
                    <span key={idx} className="badge badge-warning">
                      {access}
                    </span>
                  ))}
                </div>
              </div>
              {selectedResponse.additionalComments && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Commentaires additionnels</p>
                  <p className="bg-base-200 p-4 rounded-lg">
                    {selectedResponse.additionalComments}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button onClick={() => setSelectedResponse(null)} className="btn">
                Fermer
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedResponse(null)}>close</button>
          </form>
        </dialog>
      )}
    </>
  )
}
