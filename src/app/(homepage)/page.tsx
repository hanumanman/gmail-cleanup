import { CheckSVG } from "@/components/svgs/CheckSVG"
import { CodeSVG } from "@/components/svgs/CodeSVG"
import { LockSVG } from "@/components/svgs/LockSVG"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Clean Gmail Instantly
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Delete unwanted emails and reclaim storage space. Simple, fast, and
            effective email management.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="text-base">
            <Link href="/clean">Go to Cleanup</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent text-base"
          >
            View on GitHub
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">Why Choose Clean Gmail?</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Built with privacy, simplicity, and your needs in mind
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
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
            <CardContent className="space-y-4 p-6">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                <CheckSVG />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Free Forever</h3>
                <p className="text-muted-foreground">
                  No fees, no premium tiers, no hidden costs. Completely free to
                  use, always.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardContent className="space-y-4 p-6">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
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
        <Card className="mx-auto max-w-2xl">
          <CardContent className="space-y-6 p-8 text-center">
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
  )
}
