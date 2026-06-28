import './globals.css'

export const metadata = {
  title: 'Klasifikasi Cabai Rawit Indonesia',
  description: 'Sistem Klasifikasi Cabai Rawit Indonesia menggunakan Deep Learning MobileNetV2',
  icons: {
    icon: '/images/favicon-circle.png',
    apple: '/images/favicon-circle.png',
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/images/favicon-circle.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon-circle.png" />
      </head>
      <body className="min-h-screen bg-stone-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
