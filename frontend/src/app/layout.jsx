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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&family=Space+Grotesk:wght@600;700&display=swap" />
        {/* Suppress unhandled errors originated from browser extensions (e.g. IDM / Chrono Download Manager) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isExtensionError(e) {
                  try {
                    var src = (e && e.filename) || (e && e.error && e.error.stack) || '';
                    var msg = (e && e.message) || '';
                    var reason = (e && e.reason && (e.reason.stack || e.reason.message)) || '';
                    return src.indexOf('chrome-extension://') !== -1 ||
                           reason.indexOf('chrome-extension://') !== -1 ||
                           msg.indexOf('M_ID') !== -1 ||
                           reason.indexOf('M_ID') !== -1;
                  } catch (_) { return false; }
                }
                window.addEventListener('error', function(e) {
                  if (isExtensionError(e)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (isExtensionError(e)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-stone-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

