'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

type FormData = {
  // Personal Info
  respondentFirstName: string
  respondentLastName: string
  respondentEmail: string
  respondentPhone?: string

  // Section I
  clubName: string
  respondentRole: string
  otherRole?: string
  hasLabel: string
  wantsLabelSupport?: string

  // Section II
  hasWelcomedDisabled: string
  handicapTypes: string[]
  otherHandicapType?: string
  publicTypes: string[]
  adaptationStory?: string

  // Section III
  supportExpectations: { item: string; priority: number }[]
  otherExpectation?: string
  adaptedMaterial: string[]
  otherMaterial?: string
  desiredAccess: string[]
  additionalComments?: string
}

const roleOptions = [
  'Président',
  'Responsable Handicap',
  'Entraîneur',
  'Bénévole',
  'Autre',
]

const handicapTypeOptions = [
  'Handicaps moteurs (ex: fauteuil roulant, mobilité réduite)',
  'Handicaps sensoriels (ex: déficience visuelle, déficience auditive)',
  'Handicaps mentaux (ex: déficience intellectuelle)',
  'Handicaps psychiques (ex: troubles bipolaires, schizophrénie)',
  'Handicaps cognitifs (ex: troubles DYS, TDA/H)',
  'Polyhandicap',
  'Autre',
]

const supportExpectationOptions = [
  'Conseils sur l\'accessibilité des locaux et équipements',
  'Aide à la recherche de subventions (ANS, collectivités, etc.)',
  'Aide à la démocratisation du label "Handicap"',
  'Mise à disposition de ressources documentaires (livret d\'accueil, check-list)',
  'Formation des bénévoles et encadrants (DAFFE handicap ou autres)',
  'Aide à la programmation d\'événements de sensibilisation ("Mat ton handicap")',
  'Création d\'un réseau d\'échange entre clubs (type plateforme/blog)',
  'Autre',
]

const materialOptions = [
  'Pendules adaptées (ex: pour déficients visuels ou moteurs)',
  'Échiquiers et pièces spécifiques (ex: avec relief, magnétiques)',
  'Aides à la notation des coups (ex: tablettes, systèmes vocaux)',
  'Non, pas de besoin pour le moment',
  'Autre',
]

const accessOptions = [
  'Un référent/personne-relais au niveau de la ligue pour des questions ponctuelles',
  'Une liste de professionnels/organismes spécialisés dans le handicap sur votre territoire',
  'Des modèles de documents/procédures pour l\'accueil et l\'inclusion (ex: livret d\'accueil, règlement adapté)',
  'Des formations spécifiques sur l\'approche des différents types de handicap',
  'Rien de particulier pour l\'instant',
]

export default function QuestionnairePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm<FormData>()

  const watchRole = watch('respondentRole')
  const watchHasLabel = watch('hasLabel')
  const watchHasWelcomedDisabled = watch('hasWelcomedDisabled')

  // Validate current section before proceeding
  const validateAndProceed = async (nextSection: number) => {
    let fieldsToValidate: (keyof FormData)[] = []

    // Define which fields to validate for each section
    if (currentSection === 0) {
      fieldsToValidate = ['respondentFirstName', 'respondentLastName', 'respondentEmail']
    } else if (currentSection === 1) {
      fieldsToValidate = ['clubName', 'respondentRole', 'hasLabel']
    } else if (currentSection === 2) {
      fieldsToValidate = ['hasWelcomedDisabled']
    }

    // Trigger validation for the current section's fields
    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      setCurrentSection(nextSection)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/questionnaire/merci')
      } else {
        alert('Erreur lors de l\'envoi du questionnaire. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Erreur lors de l\'envoi du questionnaire. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Questionnaire Accessibilité et Inclusion Handicap
          </h1>
          <p className="text-gray-600">
            Commission Handicap - Ligue Nouvelle-Aquitaine d'Échecs
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <ul className="steps w-full">
            <li className={`step ${currentSection >= 0 ? 'step-primary' : ''}`}>
              Vos informations
            </li>
            <li className={`step ${currentSection >= 1 ? 'step-primary' : ''}`}>
              Informations club
            </li>
            <li className={`step ${currentSection >= 2 ? 'step-primary' : ''}`}>
              Expérience
            </li>
            <li className={`step ${currentSection >= 3 ? 'step-primary' : ''}`}>
              Besoins
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Section 0: Personal Information */}
              {currentSection === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Vos Informations Personnelles
                  </h2>

                  <div className="alert alert-info mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Ces informations nous permettront de vous recontacter si nécessaire.</span>
                  </div>

                  {/* Prénom */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Prénom *</span>
                    </label>
                    <input
                      type="text"
                      {...register('respondentFirstName', { required: 'Le prénom est requis' })}
                      className="input input-bordered w-full"
                      placeholder="Jean"
                    />
                    {errors.respondentFirstName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.respondentFirstName.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Nom */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Nom *</span>
                    </label>
                    <input
                      type="text"
                      {...register('respondentLastName', { required: 'Le nom est requis' })}
                      className="input input-bordered w-full"
                      placeholder="Dupont"
                    />
                    {errors.respondentLastName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.respondentLastName.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Email *</span>
                    </label>
                    <input
                      type="email"
                      {...register('respondentEmail', {
                        required: 'L\'email est requis',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email invalide'
                        }
                      })}
                      className="input input-bordered w-full"
                      placeholder="jean.dupont@example.com"
                    />
                    {errors.respondentEmail && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.respondentEmail.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Téléphone (optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      {...register('respondentPhone')}
                      className="input input-bordered w-full"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => validateAndProceed(1)}
                      className="btn btn-primary"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* Section I: Informations Générales */}
              {currentSection === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">
                    I. Informations Générales sur le Club
                  </h2>

                  {/* Nom du club */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Quel est le nom de votre club d'échecs ? *
                      </span>
                    </label>
                    <input
                      type="text"
                      {...register('clubName', { required: 'Ce champ est requis' })}
                      className="input input-bordered w-full"
                      placeholder="Nom du club"
                    />
                    {errors.clubName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.clubName.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Fonction */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Quelle est votre fonction au sein du club ? *
                      </span>
                    </label>
                    <select
                      {...register('respondentRole', { required: 'Ce champ est requis' })}
                      className="select select-bordered w-full"
                    >
                      <option value="">Sélectionnez une option</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {errors.respondentRole && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.respondentRole.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Autre fonction */}
                  {watchRole === 'Autre' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Précisez votre fonction :</span>
                      </label>
                      <input
                        type="text"
                        {...register('otherRole')}
                        className="input input-bordered w-full"
                        placeholder="Précisez..."
                      />
                    </div>
                  )}

                  {/* Label Handisport */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Votre club est-il actuellement labellisé "Sport Handisport" ou équivalent ? *
                      </span>
                    </label>
                    <div className="space-y-2">
                      {['Oui', 'Non', 'En cours de démarche', 'Je ne sais pas'].map((option) => (
                        <label key={option} className="label cursor-pointer justify-start gap-4">
                          <input
                            type="radio"
                            {...register('hasLabel', { required: 'Ce champ est requis' })}
                            value={option}
                            className="radio radio-primary"
                          />
                          <span className="label-text">{option}</span>
                        </label>
                      ))}
                    </div>
                    {errors.hasLabel && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.hasLabel.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Accompagnement label */}
                  {watchHasLabel === 'Non' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Si non, souhaitez-vous être accompagné dans la démarche d'obtention du label ?
                        </span>
                      </label>
                      <div className="space-y-2">
                        {['Oui', 'Non'].map((option) => (
                          <label key={option} className="label cursor-pointer justify-start gap-4">
                            <input
                              type="radio"
                              {...register('wantsLabelSupport')}
                              value={option}
                              className="radio radio-primary"
                            />
                            <span className="label-text">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="card-actions justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentSection(0)}
                      className="btn btn-outline"
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      onClick={() => validateAndProceed(2)}
                      className="btn btn-primary"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* Section II: Expérience d'Accueil */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">
                    II. Expérience d'Accueil des Personnes en Situation de Handicap
                  </h2>

                  {/* A déjà accueilli */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Votre club a-t-il déjà accueilli des personnes en situation de handicap
                        (régulièrement ou ponctuellement) ? *
                      </span>
                    </label>
                    <div className="space-y-2">
                      {['Oui', 'Non'].map((option) => (
                        <label key={option} className="label cursor-pointer justify-start gap-4">
                          <input
                            type="radio"
                            {...register('hasWelcomedDisabled', { required: 'Ce champ est requis' })}
                            value={option}
                            className="radio radio-primary"
                          />
                          <span className="label-text">{option}</span>
                        </label>
                      ))}
                    </div>
                    {errors.hasWelcomedDisabled && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.hasWelcomedDisabled.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {watchHasWelcomedDisabled === 'Oui' && (
                    <>
                      {/* Types de handicaps */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Si oui, quel(s) type(s) de handicap(s) avez-vous majoritairement accueilli ?
                            (Plusieurs réponses possibles)
                          </span>
                        </label>
                        <div className="space-y-2">
                          {handicapTypeOptions.map((type) => (
                            <label key={type} className="label cursor-pointer justify-start gap-4">
                              <input
                                type="checkbox"
                                {...register('handicapTypes')}
                                value={type}
                                className="checkbox checkbox-primary"
                              />
                              <span className="label-text">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Autre type de handicap */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Si "Autre", précisez :
                          </span>
                        </label>
                        <input
                          type="text"
                          {...register('otherHandicapType')}
                          className="input input-bordered w-full"
                          placeholder="Précisez..."
                        />
                      </div>

                      {/* Public accueilli */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Quel public avez-vous accueilli ? (Plusieurs réponses possibles)
                          </span>
                        </label>
                        <div className="space-y-2">
                          {['Enfants / Mineurs', 'Adultes'].map((type) => (
                            <label key={type} className="label cursor-pointer justify-start gap-4">
                              <input
                                type="checkbox"
                                {...register('publicTypes')}
                                value={type}
                                className="checkbox checkbox-primary"
                              />
                              <span className="label-text">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Histoire d'adaptation */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Pourriez-vous partager brièvement une adaptation ou une bonne pratique que
                            vous avez mise en place pour accueillir une personne en situation de handicap ?
                          </span>
                        </label>
                        <textarea
                          {...register('adaptationStory')}
                          className="textarea textarea-bordered h-32"
                          placeholder="Partagez votre expérience..."
                        />
                      </div>
                    </>
                  )}

                  <div className="card-actions justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentSection(1)}
                      className="btn btn-outline"
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      onClick={() => validateAndProceed(3)}
                      className="btn btn-primary"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* Section III: Besoins et Attentes */}
              {currentSection === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">
                    III. Besoins et Attentes en Accompagnement
                  </h2>

                  {/* Attentes d'accompagnement */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Quelles sont vos principales attentes en termes d'accompagnement de la part
                        de la Commission Handicap de la ligue ? (Plusieurs réponses possibles)
                      </span>
                    </label>
                    <div className="space-y-2">
                      {supportExpectationOptions.map((option) => (
                        <label key={option} className="label cursor-pointer justify-start gap-4">
                          <input
                            type="checkbox"
                            {...register('supportExpectations')}
                            value={option}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Autre attente */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Si "Autre", précisez :</span>
                    </label>
                    <input
                      type="text"
                      {...register('otherExpectation')}
                      className="input input-bordered w-full"
                      placeholder="Précisez..."
                    />
                  </div>

                  {/* Matériel adapté */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Êtes-vous intéressé par des informations concernant le matériel adapté pour
                        la pratique des échecs ? (Plusieurs réponses possibles)
                      </span>
                    </label>
                    <div className="space-y-2">
                      {materialOptions.map((option) => (
                        <label key={option} className="label cursor-pointer justify-start gap-4">
                          <input
                            type="checkbox"
                            {...register('adaptedMaterial')}
                            value={option}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Autre matériel */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Si "Autre", précisez :</span>
                    </label>
                    <input
                      type="text"
                      {...register('otherMaterial')}
                      className="input input-bordered w-full"
                      placeholder="Précisez..."
                    />
                  </div>

                  {/* Accès souhaités */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Pour mieux répondre à vos besoins, votre club souhaiterait-il avoir accès à :
                        (Plusieurs réponses possibles)
                      </span>
                    </label>
                    <div className="space-y-2">
                      {accessOptions.map((option) => (
                        <label key={option} className="label cursor-pointer justify-start gap-4">
                          <input
                            type="checkbox"
                            {...register('desiredAccess')}
                            value={option}
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Commentaires additionnels */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Avez-vous d'autres difficultés ou suggestions à partager avec la Commission Handicap ?
                      </span>
                    </label>
                    <textarea
                      {...register('additionalComments')}
                      className="textarea textarea-bordered h-32"
                      placeholder="Partagez vos commentaires..."
                    />
                  </div>

                  <div className="card-actions justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentSection(2)}
                      className="btn btn-outline"
                    >
                      Précédent
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer le questionnaire'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
