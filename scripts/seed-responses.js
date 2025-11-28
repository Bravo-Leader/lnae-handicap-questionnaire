const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleResponses = [
  {
    // Informations du répondant
    respondentFirstName: "Marie",
    respondentLastName: "Dubois",
    respondentEmail: "marie.dubois@club-echecs.fr",
    respondentPhone: "0612345678",

    // Section I: Informations Générales
    clubName: "Club d'Échecs de Bordeaux",
    respondentRole: "Président",
    otherRole: null,
    hasLabel: "Oui",
    wantsLabelSupport: "Non",

    // Section II: Expérience d'Accueil
    hasWelcomedDisabled: "Oui",
    handicapTypes: ["Handicap moteur", "Handicap visuel"],
    otherHandicapType: null,
    publicTypes: ["Enfants/Mineurs", "Adultes"],
    adaptationStory: "Nous avons accueilli plusieurs joueurs avec handicap visuel. Nous avons adapté nos échiquiers avec des pièces tactiles et nous avons formé nos animateurs pour accompagner ces joueurs.",

    // Section III: Besoins et Attentes
    supportExpectations: [
      { label: "Formation des encadrants", priority: 1 },
      { label: "Matériel adapté", priority: 2 },
      { label: "Accompagnement personnalisé", priority: 3 }
    ],
    otherExpectation: null,
    adaptedMaterial: ["Pendules adaptées", "Échiquiers adaptés"],
    otherMaterial: null,
    desiredAccess: ["Référent handicap", "Documents pédagogiques", "Formations"],
    additionalComments: "Nous aimerions développer davantage notre accueil pour les personnes en situation de handicap."
  },
  {
    respondentFirstName: "Jean",
    respondentLastName: "Martin",
    respondentEmail: "j.martin@echecs-pau.fr",
    respondentPhone: "0623456789",

    clubName: "Échiquier Palois",
    respondentRole: "Animateur",
    otherRole: null,
    hasLabel: "En cours de démarche",
    wantsLabelSupport: "Oui",

    hasWelcomedDisabled: "Oui",
    handicapTypes: ["Handicap mental/psychique"],
    otherHandicapType: null,
    publicTypes: ["Enfants/Mineurs"],
    adaptationStory: "Nous travaillons avec un IME local et accueillons régulièrement des jeunes en situation de handicap mental pour des séances d'initiation aux échecs.",

    supportExpectations: [
      { label: "Formations", priority: 1 },
      { label: "Liste de professionnels", priority: 2 },
      { label: "Matériel adapté", priority: 3 }
    ],
    otherExpectation: "Mise en réseau avec d'autres clubs ayant cette expérience",
    adaptedMaterial: ["Non"],
    otherMaterial: null,
    desiredAccess: ["Référent handicap", "Liste de professionnels", "Formations"],
    additionalComments: "Nous manquons de matériel adapté et de formation spécifique pour mieux accueillir ces publics."
  },
  {
    respondentFirstName: "Sophie",
    respondentLastName: "Lefebvre",
    respondentEmail: "sophie.lefebvre@echecs-limoges.fr",
    respondentPhone: null,

    clubName: "Cercle d'Échecs de Limoges",
    respondentRole: "Secrétaire",
    otherRole: null,
    hasLabel: "Non",
    wantsLabelSupport: "Oui",

    hasWelcomedDisabled: "Non",
    handicapTypes: [],
    otherHandicapType: null,
    publicTypes: [],
    adaptationStory: null,

    supportExpectations: [
      { label: "Informations sur le label", priority: 1 },
      { label: "Formation des encadrants", priority: 2 },
      { label: "Référent handicap", priority: 3 }
    ],
    otherExpectation: null,
    adaptedMaterial: ["Non"],
    otherMaterial: null,
    desiredAccess: ["Référent handicap", "Documents pédagogiques"],
    additionalComments: "Nous souhaitons nous former pour pouvoir accueillir des personnes en situation de handicap mais nous ne savons pas par où commencer."
  },
  {
    respondentFirstName: "Pierre",
    respondentLastName: "Rousseau",
    respondentEmail: "p.rousseau@echecs-angouleme.fr",
    respondentPhone: "0634567890",

    clubName: "Échiquier d'Angoulême",
    respondentRole: "Entraîneur",
    otherRole: null,
    hasLabel: "Oui",
    wantsLabelSupport: "Non",

    hasWelcomedDisabled: "Oui",
    handicapTypes: ["Handicap moteur", "Handicap auditif"],
    otherHandicapType: null,
    publicTypes: ["Adultes"],
    adaptationStory: "Nous avons plusieurs membres adultes avec des handicaps moteurs et auditifs. Nous avons aménagé notre salle pour l'accessibilité PMR et nous utilisons des supports visuels pour les personnes malentendantes.",

    supportExpectations: [
      { label: "Matériel adapté", priority: 1 },
      { label: "Subventions", priority: 2 },
      { label: "Accompagnement personnalisé", priority: 3 }
    ],
    otherExpectation: null,
    adaptedMaterial: ["Échiquiers adaptés", "Système de notation adapté"],
    otherMaterial: "Table réglable en hauteur",
    desiredAccess: ["Liste de professionnels", "Documents pédagogiques"],
    additionalComments: "Nous cherchons des financements pour acquérir plus de matériel adapté."
  },
  {
    respondentFirstName: "Isabelle",
    respondentLastName: "Bernard",
    respondentEmail: "i.bernard@echecs-niort.fr",
    respondentPhone: "0645678901",

    clubName: "Club d'Échecs de Niort",
    respondentRole: "Autre",
    otherRole: "Responsable jeunes",
    hasLabel: "Je ne sais pas",
    wantsLabelSupport: "Oui",

    hasWelcomedDisabled: "Oui",
    handicapTypes: ["Handicap visuel", "Troubles DYS"],
    otherHandicapType: null,
    publicTypes: ["Enfants/Mineurs"],
    adaptationStory: "Nous accueillons plusieurs enfants dyslexiques et un enfant malvoyant. Nous adaptons nos supports pédagogiques avec des polices adaptées et des contrastes élevés.",

    supportExpectations: [
      { label: "Formation des encadrants", priority: 1 },
      { label: "Documents pédagogiques", priority: 2 },
      { label: "Matériel adapté", priority: 3 }
    ],
    otherExpectation: null,
    adaptedMaterial: ["Échiquiers adaptés"],
    otherMaterial: null,
    desiredAccess: ["Formations", "Documents pédagogiques", "Référent handicap"],
    additionalComments: "Nous avons besoin de plus de formation sur les troubles DYS et l'adaptation de nos méthodes pédagogiques."
  },
  {
    respondentFirstName: "Thomas",
    respondentLastName: "Petit",
    respondentEmail: "thomas.petit@echecs-perigueux.fr",
    respondentPhone: "0656789012",

    clubName: "Cercle d'Échecs de Périgueux",
    respondentRole: "Président",
    otherRole: null,
    hasLabel: "Non",
    wantsLabelSupport: "Non",

    hasWelcomedDisabled: "Non",
    handicapTypes: [],
    otherHandicapType: null,
    publicTypes: [],
    adaptationStory: null,

    supportExpectations: [
      { label: "Informations générales", priority: 1 },
      { label: "Référent handicap", priority: 2 }
    ],
    otherExpectation: null,
    adaptedMaterial: ["Non"],
    otherMaterial: null,
    desiredAccess: ["Référent handicap"],
    additionalComments: "Nous n'avons pas encore été confrontés à cette situation mais nous voulons être prêts si cela arrive."
  },
  {
    respondentFirstName: "Céline",
    respondentLastName: "Moreau",
    respondentEmail: "celine.moreau@echecs-agen.fr",
    respondentPhone: "0667890123",

    clubName: "Échiquier Agenais",
    respondentRole: "Animateur",
    otherRole: null,
    hasLabel: "En cours de démarche",
    wantsLabelSupport: "Oui",

    hasWelcomedDisabled: "Oui",
    handicapTypes: ["Handicap mental/psychique", "Troubles autistiques"],
    otherHandicapType: null,
    publicTypes: ["Enfants/Mineurs", "Adultes"],
    adaptationStory: "Nous travaillons avec plusieurs structures médico-sociales et accueillons des personnes avec autisme et des troubles psychiques. Nous avons adapté notre pédagogie avec des routines claires et un environnement calme.",

    supportExpectations: [
      { label: "Formation des encadrants", priority: 1 },
      { label: "Accompagnement personnalisé", priority: 2 },
      { label: "Liste de professionnels", priority: 3 }
    ],
    otherExpectation: "Supervision par un psychologue spécialisé",
    adaptedMaterial: ["Non"],
    otherMaterial: null,
    desiredAccess: ["Formations", "Liste de professionnels", "Référent handicap"],
    additionalComments: "Nous aimerions avoir un accompagnement régulier par des professionnels pour améliorer nos pratiques."
  },
  {
    respondentFirstName: "Laurent",
    respondentLastName: "Garnier",
    respondentEmail: "l.garnier@echecs-mont-de-marsan.fr",
    respondentPhone: null,

    clubName: "Club d'Échecs de Mont-de-Marsan",
    respondentRole: "Trésorier",
    otherRole: null,
    hasLabel: "Non",
    wantsLabelSupport: "Oui",

    hasWelcomedDisabled: "Oui",
    handicapTypes: ["Handicap moteur"],
    otherHandicapType: null,
    publicTypes: ["Adultes"],
    adaptationStory: "Un de nos membres est en fauteuil roulant. Nous avons rendu notre local accessible et adapté la hauteur des tables.",

    supportExpectations: [
      { label: "Subventions", priority: 1 },
      { label: "Matériel adapté", priority: 2 },
      { label: "Informations sur le label", priority: 3 }
    ],
    otherExpectation: null,
    adaptedMaterial: ["Non"],
    otherMaterial: null,
    desiredAccess: ["Référent handicap", "Documents pédagogiques"],
    additionalComments: "Nous cherchons des aides financières pour continuer à améliorer l'accessibilité de notre local."
  }
]

async function main() {
  console.log('🌱 Début du seed de la base de données...\n')

  // Compter les réponses existantes
  const existingCount = await prisma.response.count()
  console.log(`📊 Nombre de réponses existantes: ${existingCount}\n`)

  let created = 0
  let skipped = 0

  for (const responseData of sampleResponses) {
    try {
      // Vérifier si une réponse avec cet email existe déjà
      const existing = await prisma.response.findFirst({
        where: { respondentEmail: responseData.respondentEmail }
      })

      if (existing) {
        console.log(`⏭️  Réponse de ${responseData.respondentFirstName} ${responseData.respondentLastName} (${responseData.respondentEmail}) existe déjà`)
        skipped++
      } else {
        await prisma.response.create({
          data: responseData
        })
        console.log(`✅ Créé: ${responseData.respondentFirstName} ${responseData.respondentLastName} - ${responseData.clubName}`)
        created++
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${responseData.respondentFirstName} ${responseData.respondentLastName}:`, error.message)
    }
  }

  console.log(`\n📊 Résumé:`)
  console.log(`   ✅ ${created} réponses créées`)
  console.log(`   ⏭️  ${skipped} réponses ignorées (déjà existantes)`)
  console.log(`   📈 Total dans la base: ${existingCount + created}\n`)
  console.log(`🎉 Seed terminé!\n`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
