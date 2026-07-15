import './globals.css'

export const metadata = {
  title: 'Klasifikasi Cabai Rawit Indonesia',
  description: 'Sistem Klasifikasi Cabai Rawit Indonesia menggunakan Deep Learning MobileNetV2',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌶️</text></svg>" />
      </head>
      <body className="min-h-screen bg-stone-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
