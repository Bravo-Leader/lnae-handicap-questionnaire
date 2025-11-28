'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

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

export default function Statistics({ responses }: { responses: Response[] }) {
  // Label Statistics
  const labelStats = {
    oui: responses.filter((r) => r.hasLabel === 'Oui').length,
    non: responses.filter((r) => r.hasLabel === 'Non').length,
    enCours: responses.filter((r) => r.hasLabel === 'En cours de démarche').length,
    neSaisPas: responses.filter((r) => r.hasLabel === 'Je ne sais pas').length,
  }

  const labelChartData = {
    labels: ['Oui', 'Non', 'En cours', 'Ne sait pas'],
    datasets: [
      {
        label: 'Clubs labellisés',
        data: [labelStats.oui, labelStats.non, labelStats.enCours, labelStats.neSaisPas],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(251, 191, 36)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Experience Statistics
  const experienceStats = {
    oui: responses.filter((r) => r.hasWelcomedDisabled === 'Oui').length,
    non: responses.filter((r) => r.hasWelcomedDisabled === 'Non').length,
  }

  const experienceChartData = {
    labels: ['Avec expérience', 'Sans expérience'],
    datasets: [
      {
        label: "Clubs ayant accueilli des personnes en situation de handicap",
        data: [experienceStats.oui, experienceStats.non],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(156, 163, 175, 0.8)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(156, 163, 175)'],
        borderWidth: 1,
      },
    ],
  }

  // Handicap Types Statistics
  const handicapTypesCount: { [key: string]: number } = {}
  responses.forEach((r) => {
    r.handicapTypes.forEach((type) => {
      const shortType = type.split('(')[0].trim()
      handicapTypesCount[shortType] = (handicapTypesCount[shortType] || 0) + 1
    })
  })

  const handicapTypesData = {
    labels: Object.keys(handicapTypesCount),
    datasets: [
      {
        label: 'Types de handicaps accueillis',
        data: Object.values(handicapTypesCount),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  }

  // Support Expectations Statistics
  const supportExpectationsCount: { [key: string]: number } = {}
  responses.forEach((r) => {
    if (Array.isArray(r.supportExpectations)) {
      r.supportExpectations.forEach((exp) => {
        const shortExp = exp.substring(0, 40) + (exp.length > 40 ? '...' : '')
        supportExpectationsCount[shortExp] = (supportExpectationsCount[shortExp] || 0) + 1
      })
    }
  })

  const supportExpectationsData = {
    labels: Object.keys(supportExpectationsCount),
    datasets: [
      {
        label: "Attentes d'accompagnement",
        data: Object.values(supportExpectationsCount),
        backgroundColor: 'rgba(6, 182, 212, 0.8)',
        borderColor: 'rgb(6, 182, 212)',
        borderWidth: 1,
      },
    ],
  }

  // Material Statistics
  const materialCount: { [key: string]: number } = {}
  responses.forEach((r) => {
    r.adaptedMaterial.forEach((mat) => {
      const shortMat = mat.split('(')[0].trim()
      materialCount[shortMat] = (materialCount[shortMat] || 0) + 1
    })
  })

  const materialData = {
    labels: Object.keys(materialCount),
    datasets: [
      {
        label: 'Matériel adapté souhaité',
        data: Object.values(materialCount),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  }

  // Chart Options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  // Interpretations
  const totalResponses = responses.length
  const labeledPercentage = ((labelStats.oui / totalResponses) * 100).toFixed(1)
  const experiencePercentage = ((experienceStats.oui / totalResponses) * 100).toFixed(1)
  const wantSupportCount = responses.filter((r) => r.wantsLabelSupport === 'Oui').length

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">📊 Analyses et Interprétations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Labellisation</h3>
              <p className="text-sm">
                Seulement <span className="font-bold text-xl">{labeledPercentage}%</span> des clubs
                sont actuellement labellisés "Sport Handisport".{' '}
                <span className="font-bold">{wantSupportCount} clubs</span> souhaitent être
                accompagnés dans cette démarche.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Expérience d'accueil</h3>
              <p className="text-sm">
                <span className="font-bold text-xl">{experiencePercentage}%</span> des clubs ont
                déjà accueilli des personnes en situation de handicap, ce qui montre un engagement
                existant mais perfectible.
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Besoins prioritaires</h3>
              <p className="text-sm">
                Les clubs demandent principalement :{' '}
                {Object.entries(supportExpectationsCount)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 2)
                  .map(([key], idx, arr) => (
                    <span key={key}>
                      <span className="font-bold">{key.substring(0, 30)}</span>
                      {idx < arr.length - 1 ? ' et ' : ''}
                    </span>
                  ))}
              </p>
            </div>

            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Recommandations</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Intensifier l'accompagnement à la labellisation</li>
                <li>Créer un réseau d'échange entre clubs</li>
                <li>Développer des ressources documentaires</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Label Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Statut de labellisation</h3>
            <div className="h-64">
              <Pie data={labelChartData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Experience Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Expérience d'accueil</h3>
            <div className="h-64">
              <Doughnut data={experienceChartData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Handicap Types Chart */}
        {Object.keys(handicapTypesCount).length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Types de handicaps accueillis</h3>
              <div className="h-64">
                <Bar data={handicapTypesData} options={barOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Support Expectations Chart */}
        {Object.keys(supportExpectationsCount).length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Attentes d'accompagnement</h3>
              <div className="h-64">
                <Bar data={supportExpectationsData} options={barOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Material Chart */}
        {Object.keys(materialCount).length > 0 && (
          <div className="card bg-base-100 shadow-xl lg:col-span-2">
            <div className="card-body">
              <h3 className="card-title">Matériel adapté souhaité</h3>
              <div className="h-64">
                <Bar data={materialData} options={barOptions} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Statistics Tables */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-4">Statistiques détaillées</h3>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Métrique</th>
                  <th>Nombre</th>
                  <th>Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total de réponses</td>
                  <td className="font-bold">{totalResponses}</td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td>Clubs labellisés</td>
                  <td className="font-bold">{labelStats.oui}</td>
                  <td>{labeledPercentage}%</td>
                </tr>
                <tr>
                  <td>Clubs avec expérience d'accueil</td>
                  <td className="font-bold">{experienceStats.oui}</td>
                  <td>{experiencePercentage}%</td>
                </tr>
                <tr>
                  <td>Clubs demandant un accompagnement</td>
                  <td className="font-bold">{wantSupportCount}</td>
                  <td>{((wantSupportCount / totalResponses) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td>Clubs en cours de labellisation</td>
                  <td className="font-bold">{labelStats.enCours}</td>
                  <td>{((labelStats.enCours / totalResponses) * 100).toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-4">Export des données</h3>
          <p className="text-gray-600 mb-4">
            Exportez les données pour une analyse approfondie ou pour partager avec la commission.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const dataStr = JSON.stringify(responses, null, 2)
                const dataBlob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `questionnaire-handicap-${new Date().toISOString().split('T')[0]}.json`
                link.click()
              }}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter en JSON
            </button>
            <button
              onClick={() => {
                const csv = [
                  ['Club', 'Fonction', 'Label', 'Expérience', 'Date'].join(','),
                  ...responses.map((r) =>
                    [
                      `"${r.clubName}"`,
                      `"${r.respondentRole}"`,
                      `"${r.hasLabel}"`,
                      `"${r.hasWelcomedDisabled}"`,
                      new Date(r.createdAt).toLocaleDateString('fr-FR'),
                    ].join(',')
                  ),
                ].join('\n')
                const csvBlob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(csvBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `questionnaire-handicap-${new Date().toISOString().split('T')[0]}.csv`
                link.click()
              }}
              className="btn btn-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter en CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
