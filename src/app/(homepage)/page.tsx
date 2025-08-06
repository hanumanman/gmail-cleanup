import { CheckSVG } from "@/components/svgs/CheckSVG"
import { CodeSVG } from "@/components/svgs/CodeSVG"
import { LockSVG } from "@/components/svgs/LockSVG"
import { Footer } from "./_components/Footer"
import { Header } from "./_components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Clean Gmail Instantly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Delete unwanted emails and reclaim storage space. Simple, fast,
              and effective email management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href={"/clean"}>Get Started Free</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base bg-transparent"
            >
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Why Choose Clean Gmail?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with privacy, simplicity, and your needs in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <LockSVG />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">100% Private</h3>
                  <p className="text-muted-foreground">
                    Your data stays yours. We don't store, track, or sell your
                    information.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <CheckSVG />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Free Forever</h3>
                  <p className="text-muted-foreground">
                    No fees, no premium tiers, no hidden costs. Completely free
                    to use, always.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <CodeSVG />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Open Source</h3>
                  <p className="text-muted-foreground">
                    Fully open source and transparent. Fork it, modify it,
                    contribute to it.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                  Ready to clean up your Gmail?
                </h2>
                <p className="text-muted-foreground">
                  Join thousands of users who have already reclaimed their inbox
                  space
                </p>
              </div>
              <Button size="lg">Start Cleaning Now</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
