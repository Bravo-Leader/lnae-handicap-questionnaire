import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Commission Handicap
            </h1>
            <p className="text-xl text-gray-600">
              Ligue Nouvelle-Aquitaine d'Échecs
            </p>
          </div>

          {/* Hero Card */}
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8">
              <h2 className="card-title text-3xl mb-4">
                Questionnaire d'Évaluation des Besoins
              </h2>

              <p className="text-lg text-gray-700 mb-6">
                Ce questionnaire vise à évaluer les besoins d'accompagnement de votre club
                concernant l'accueil des personnes en situation de handicap.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-3">Objectifs de cette enquête :</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Recenser les modalités d'accueil des clubs</li>
                  <li>Identifier les besoins en accompagnement</li>
                  <li>Faciliter l'obtention du label "Sport Handisport"</li>
                  <li>Créer une banque de ressources et de bonnes pratiques</li>
                  <li>Développer des partenariats sur le territoire</li>
                </ul>
              </div>

              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Le questionnaire prend environ 10 minutes à compléter.</span>
              </div>

              <div className="card-actions justify-center mt-8">
                <Link href="/questionnaire" className="btn btn-primary btn-lg">
                  Commencer le questionnaire
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8 text-gray-600">
            <p className="mb-2">
              Pour toute question, contactez :
              <a href="mailto:handicap@echecs-nouvelleaquitaine.fr" className="link link-primary ml-2">
                handicap@echecs-nouvelleaquitaine.fr
              </a>
            </p>
            <p className="text-sm">
              Référent : Hugues GIRAUD
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
