import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "SKV CTV - Hệ sinh thái cộng tác viên",
  description:
    "Hệ sinh thái cộng tác viên SKV - Trao quyền chủ động bảo vệ sức khỏe và cơ hội kinh doanh",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SKV CTV",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scrollbar-hide">
      <head>
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta name="apple-mobile-web-app-title" content="SKV CTV" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-72x72.png" />
        <link rel="manifest" href="/manifest.json" />
        {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID && (
          <meta
            name="google-signin-client_id"
            content={process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
          />
        )}
      </head>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        <Providers>
          <div className="mx-auto max-w-md safe-top">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
