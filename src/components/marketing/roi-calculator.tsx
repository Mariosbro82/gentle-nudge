import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Zap, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export function RoiCalculator() {
  const [teamSize, setTeamSize] = useState(20);
  const [eventsPerYear, setEventsPerYear] = useState(6);
  const [leadsPerEventPaper, setLeadsPerEventPaper] = useState(15);

  const results = useMemo(() => {
    // Paper baseline
    const paperLeadsTotal = teamSize * eventsPerYear * leadsPerEventPaper;
    const paperConversionRate = 0.044; // 4.4%
    const paperConversions = Math.round(paperLeadsTotal * paperConversionRate);

    // NFCwear (3x conversion rate)
    const nfcConversionRate = 0.132; // 13.2%
    const nfcLeadsTotal = Math.round(paperLeadsTotal * 1.6); // 60% more leads captured
    const nfcConversions = Math.round(nfcLeadsTotal * nfcConversionRate);

    // Revenue impact (avg deal value €2,500)
    const avgDealValue = 2500;
    const additionalConversions = nfcConversions - paperConversions;
    const additionalRevenue = additionalConversions * avgDealValue;

    // Cost (€24/person/month)
    const annualCost = teamSize * 24 * 12;
    const roi = annualCost > 0 ? Math.round((additionalRevenue / annualCost) * 100) : 0;

    return {
      paperLeadsTotal,
      paperConversions,
      nfcLeadsTotal,
      nfcConversions,
      additionalConversions,
      additionalRevenue,
      annualCost,
      roi,
    };
  }, [teamSize, eventsPerYear, leadsPerEventPaper]);

  const fmt = (v: number) => v.toLocaleString("de-DE");

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-24 px-6"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full border border-border bg-muted/50 text-sm font-medium mb-6">
            ROI berechnen
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Was bringt NFCwear <span className="text-primary/60">Ihrem Team?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Berechnen Sie den Mehrwert durch digitales Lead-Capturing vs. klassische Papierkarten.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sliders - Left */}
          <Card className="lg:col-span-2 p-6 md:p-8 space-y-8 border border-border bg-card">
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <label className="text-sm font-medium text-foreground">Teamgröße</label>
                <span className="text-2xl font-bold text-foreground tabular-nums">{teamSize}</span>
              </div>
              <Slider
                value={[teamSize]}
                onValueChange={(v) => setTeamSize(v[0])}
                min={1}
                max={200}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span><span>200</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-4">
                <label className="text-sm font-medium text-foreground">Events / Jahr</label>
                <span className="text-2xl font-bold text-foreground tabular-nums">{eventsPerYear}</span>
              </div>
              <Slider
                value={[eventsPerYear]}
                onValueChange={(v) => setEventsPerYear(v[0])}
                min={1}
                max={24}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1</span><span>24</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-4">
                <label className="text-sm font-medium text-foreground">Leads / Event (Papier)</label>
                <span className="text-2xl font-bold text-foreground tabular-nums">{leadsPerEventPaper}</span>
              </div>
              <Slider
                value={[leadsPerEventPaper]}
                onValueChange={(v) => setLeadsPerEventPaper(v[0])}
                min={5}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5</span><span>100</span>
              </div>
            </div>
          </Card>

          {/* Results - Right */}
          <div className="lg:col-span-3 space-y-4">
            {/* Comparison Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Papier-Visitenkarten</p>
                <p className="text-3xl font-bold text-foreground tabular-nums">{fmt(results.paperConversions)}</p>
                <p className="text-sm text-muted-foreground mt-1">Conversions / Jahr</p>
                <p className="text-xs text-muted-foreground mt-2">{fmt(results.paperLeadsTotal)} Leads × 4,4% Rate</p>
              </Card>

              <Card className="p-5 border border-primary/20 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Zap className="h-5 w-5 text-primary/40" />
                </div>
                <p className="text-xs text-primary/60 mb-1 uppercase tracking-wider">Mit NFCwear</p>
                <p className="text-3xl font-bold text-foreground tabular-nums">{fmt(results.nfcConversions)}</p>
                <p className="text-sm text-muted-foreground mt-1">Conversions / Jahr</p>
                <p className="text-xs text-muted-foreground mt-2">{fmt(results.nfcLeadsTotal)} Leads × 13,2% Rate</p>
              </Card>
            </div>

            {/* Impact metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 border border-border bg-card text-center">
                <TrendingUp className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground tabular-nums">+{fmt(results.additionalConversions)}</p>
                <p className="text-xs text-muted-foreground mt-1">Mehr Abschlüsse</p>
              </Card>

              <Card className="p-5 border border-border bg-card text-center">
                <BarChart3 className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground tabular-nums">{fmt(results.additionalRevenue)} €</p>
                <p className="text-xs text-muted-foreground mt-1">Zusätzlicher Umsatz</p>
              </Card>

              <Card className="p-5 border border-primary/20 bg-primary/5 text-center">
                <p className="text-xs text-primary/60 mb-1 uppercase tracking-wider">ROI</p>
                <p className="text-3xl font-bold text-foreground tabular-nums">{results.roi}%</p>
                <p className="text-xs text-muted-foreground mt-1">bei {fmt(results.annualCost)} € / Jahr</p>
              </Card>
            </div>

            {/* CTA */}
            <Card className="p-5 border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Basierend auf Ø Dealwert von 2.500 € und branchenüblichen Conversion-Rates.
              </p>
              <Button asChild variant="default" className="shrink-0 gap-2">
                <a href="/contact">
                  Demo anfragen <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
