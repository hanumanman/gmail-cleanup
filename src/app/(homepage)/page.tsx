import { CheckSVG } from "@/components/svgs/CheckSVG"
import { CodeSVG } from "@/components/svgs/CodeSVG"
import { LockSVG } from "@/components/svgs/LockSVG"
import { Footer } from "./_components/Footer"
import { Header } from "./_components/Header"

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Clean Gmail
            <span className="block text-blue-600 dark:text-blue-400">
              Instantly
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Delete unwanted emails and reclaim storage. Will it help? Idk
          </p>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Get Started
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
              GitHub
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-6xl mx-auto">
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900">
                <LockSVG />
              </div>
              <h4 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                Private
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Your info? I dont want em
              </p>
            </div>

            <div className="relative rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900">
                <CheckSVG />
              </div>
              <h4 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                Free Forever
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                No fees, no premium tiers. Completely free, always. If you like
                it, buy me a coffee? Im dirt poor really
              </p>
            </div>

            <div className="relative rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900">
                <CodeSVG />
              </div>
              <h4 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                Open Source
              </h4>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Just take it man do whatever u want
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
