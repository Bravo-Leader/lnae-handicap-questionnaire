import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Commission Handicap - Questionnaire',
  description: 'Questionnaire d\'évaluation des besoins pour la Commission Handicap de la Ligue Nouvelle-Aquitaine d\'Échecs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" data-theme="light">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
