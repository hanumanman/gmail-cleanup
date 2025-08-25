import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { Footer } from "./(homepage)/_components/Footer"
import { Header } from "./(homepage)/_components/Header"
import "./globals.css"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gmail Cleanup",
  description: "Cleanup your Gmail inbox with ease",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="bg-background flex min-h-screen flex-col justify-between">
            <Header />
            <div className="flex grow flex-col">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
