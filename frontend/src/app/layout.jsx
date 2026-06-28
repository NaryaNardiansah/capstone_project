import './globals.css'

export const metadata = {
  title: 'Klasifikasi Cabai Rawit Indonesia',
  description: 'Sistem Klasifikasi Cabai Rawit Indonesia menggunakan Deep Learning MobileNetV2',
  icons: {
    icon: '/images/foto-my.jpg',
    apple: '/images/foto-my.jpg',
    shortcut: '/images/foto-my.jpg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/jpeg" href="/images/foto-my.jpg" />
        <link rel="apple-touch-icon" href="/images/foto-my.jpg" />
        <link rel="shortcut icon" href="/images/foto-my.jpg" />
      </head>
      <body className="min-h-screen bg-stone-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
