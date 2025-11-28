import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="container-custom max-w-2xl">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body text-center p-12">
            <div className="text-6xl mb-6">✓</div>
            <h1 className="text-4xl font-bold text-success mb-4">
              Merci pour votre participation !
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Votre questionnaire a été envoyé avec succès. Vos réponses nous aideront à mieux
              accompagner les clubs dans l'accueil des personnes en situation de handicap.
            </p>
            <div className="alert alert-info mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>
                La Commission Handicap analysera vos réponses et vous recontactera si nécessaire.
              </span>
            </div>
            <div className="card-actions justify-center">
              <Link href="/" className="btn btn-primary">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
