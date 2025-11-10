import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Users, Shield, Zap, Copy, Target, Award, BarChart3, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background px-4 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              🚀 Now Live - Join 50,000+ Traders
            </Badge>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Copy Top Traders.
              <br />
              <span className="text-primary">Profit Together.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Join the social trading revolution. Follow expert traders, copy their strategies in real-time, and grow
              your portfolio with confidence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
                <Link href="/discover">Explore Top Traders</Link>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>$2.5B+ Traded</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>50K+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>Bank-Level Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Start Copying in 3 Simple Steps</h2>
            <p className="text-pretty text-lg text-muted-foreground">
              No trading experience required. We handle the complexity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">1. Find Top Traders</h3>
                <p className="text-muted-foreground">
                  Browse verified traders with proven track records. Filter by risk level, returns, and trading style.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Copy className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">2. Set Your Budget</h3>
                <p className="text-muted-foreground">
                  Choose how much to invest. Set stop-loss limits and risk controls to protect your capital.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">3. Auto-Copy Trades</h3>
                <p className="text-muted-foreground">
                  Trades are copied automatically in real-time. Monitor performance and adjust anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Everything You Need to Succeed</h2>
            <p className="text-pretty text-lg text-muted-foreground">Professional trading tools made simple</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <Shield className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Bank-Grade Security</h3>
                <p className="text-sm text-muted-foreground">
                  256-bit encryption, cold storage, and multi-factor authentication protect your assets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Zap className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Real-Time Execution</h3>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast trade copying with minimal slippage. Never miss an opportunity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Target className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Risk Management</h3>
                <p className="text-sm text-muted-foreground">
                  Set stop-loss, take-profit, and position limits. Full control over your risk exposure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Award className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Verified Traders</h3>
                <p className="text-sm text-muted-foreground">
                  All top traders are verified with transparent performance history and real-time stats.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track performance, analyze strategies, and optimize your portfolio with detailed insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Users className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">Social Community</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from the community, share strategies, and grow together with fellow traders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Trusted by Traders Worldwide</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">$2.5B+</div>
              <div className="text-sm text-muted-foreground">Total Volume Traded</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Avg Win Rate (Top Traders)</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">What Our Traders Say</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">3 months copying</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Started with $5,000 and I'm up 28% in 3 months. The platform makes it so easy to follow top traders.
                  Best investment decision I've made."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-semibold">Sarah Williams</div>
                    <div className="text-sm text-muted-foreground">6 months copying</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "As a complete beginner, I was nervous about trading. Copy trading let me learn while earning. My
                  portfolio is now up 45%!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-semibold">David Park</div>
                    <div className="text-sm text-muted-foreground">1 year copying</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "I was spending hours analyzing markets. Now I copy 3 top traders and focus on my business. Returns
                  are better than when I traded myself!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Ready to Start Your Trading Journey?</h2>
          <p className="mb-8 text-pretty text-lg text-muted-foreground">
            Join thousands of traders who are already profiting from copy trading. No fees for the first month.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/">
                Start Copying Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
              <Link href="/discover">View Top Traders</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">No credit card required. Start with as little as $100.</p>
        </div>
      </section>
    </div>
  )
}
