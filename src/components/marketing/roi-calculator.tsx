import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Clock, PiggyBank, Users, CreditCard, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLANS = {
  starter: { name: "Starter", monthlyPrice: 29, maxTags: 5 },
  business: { name: "Business", monthlyPrice: 99, maxTags: 50 },
  enterprise: { name: "Enterprise", monthlyPrice: 0, maxTags: Infinity },
} as const;

type PlanKey = keyof typeof PLANS;

export function RoiCalculator() {
  const [plan, setPlan] = useState<PlanKey>("business");
  const [teamSize, setTeamSize] = useState(10);
  const [paperCostPerPerson, setPaperCostPerPerson] = useState(45);
  const [printRunsPerYear, setPrintRunsPerYear] = useState(2);
  const [eventsPerYear, setEventsPerYear] = useState(4);
  const [avgLeadsPerEvent, setAvgLeadsPerEvent] = useState(30);
  const [manualEntryMinutes, setManualEntryMinutes] = useState(5);
  const [hourlyLaborCost, setHourlyLaborCost] = useState(35);
  const [hoodieCount, setHoodieCount] = useState(6);
  const [crewneckCount, setCrewneckCount] = useState(4);

  const results = useMemo(() => {
    const selectedPlan = PLANS[plan];

    // === Aktuelle Kosten (Papier) ===
    const annualPrintCost = teamSize * paperCostPerPerson * printRunsPerYear;
    const totalLeadsPerYear = teamSize * eventsPerYear * avgLeadsPerEvent;
    const manualEntryHours = (totalLeadsPerYear * manualEntryMinutes) / 60;
    const manualEntryCost = manualEntryHours * hourlyLaborCost;
    const totalPaperCost = annualPrintCost + manualEntryCost;

    // === NFCwear Kosten ===
    const nfcSubscription = selectedPlan.monthlyPrice * 12;
    const nfcHoodieHardware = hoodieCount * 39.95;   // €39,95 per Hoodie
    const nfcCrewneckHardware = crewneckCount * 24.95; // €24,95 per T-Shirt
    const nfcOneTimeHardware = nfcHoodieHardware + nfcCrewneckHardware;
    const totalNfcCostYear1 = nfcSubscription + nfcOneTimeHardware;
    const totalNfcCostYear2 = nfcSubscription; // no hardware

    // === Einsparungen ===
    const savingsYear1 = totalPaperCost - totalNfcCostYear1;
    const savingsYear2 = totalPaperCost - totalNfcCostYear2;

    // === Amortisation ===
    const monthlySaving = totalPaperCost / 12 - selectedPlan.monthlyPrice;
    const amortMonths = monthlySaving > 0
      ? nfcOneTimeHardware / monthlySaving
      : Infinity;

    // === Zeitersparnis ===
    const timeSavedHours = manualEntryHours; // NFC = 0 manual entry

    // === ROI ===
    const roiYear1 = totalNfcCostYear1 > 0
      ? ((totalPaperCost - totalNfcCostYear1) / totalNfcCostYear1) * 100
      : 0;

    return {
      annualPrintCost,
      manualEntryCost,
      totalPaperCost,
      nfcSubscription,
      nfcOneTimeHardware,
      totalNfcCostYear1,
      totalNfcCostYear2,
      savingsYear1,
      savingsYear2,
      amortMonths: amortMonths === Infinity ? null : amortMonths,
      timeSavedHours,
      roiYear1,
    };
  }, [plan, teamSize, paperCostPerPerson, printRunsPerYear, eventsPerYear, avgLeadsPerEvent, manualEntryMinutes, hourlyLaborCost, hoodieCount, crewneckCount]);

  const fmt = (v: number) => v.toLocaleString("de-DE");
  const isPositive = results.savingsYear1 > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20 px-4 sm:px-6"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm font-medium mb-4">
            ROI berechnen
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
            Lohnt sich der Umstieg <span className="text-primary/60">für Sie?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Geben Sie Ihre realen Kosten ein und sehen Sie, ab wann sich NFCwear für Ihr Unternehmen rechnet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Ihre aktuellen Kosten */}
          <Card className="p-5 border border-border bg-card space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Ihre aktuellen Kosten</h3>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <Label className="text-sm text-foreground">Mitarbeitende mit Visitenkarte</Label>
                <span className="text-xl font-bold text-foreground tabular-nums">{teamSize}</span>
              </div>
              <Slider value={[teamSize]} onValueChange={(v) => setTeamSize(v[0])} min={1} max={200} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>200</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs text-muted-foreground">Druckkosten / Person (€)</Label>
                <Input type="number" value={paperCostPerPerson} onChange={(e) => setPaperCostPerPerson(Number(e.target.value) || 0)} className="mt-1 text-right font-mono" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Druckläufe / Jahr</Label>
                <Input type="number" value={printRunsPerYear} onChange={(e) => setPrintRunsPerYear(Number(e.target.value) || 0)} className="mt-1 text-right font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs text-muted-foreground">Events / Jahr</Label>
                <Input type="number" value={eventsPerYear} onChange={(e) => setEventsPerYear(Number(e.target.value) || 0)} className="mt-1 text-right font-mono" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Leads / Event</Label>
                <Input type="number" value={avgLeadsPerEvent} onChange={(e) => setAvgLeadsPerEvent(Number(e.target.value) || 0)} className="mt-1 text-right font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label className="text-xs text-muted-foreground">Min. / Lead-Eingabe</Label>
                <Input type="number" value={manualEntryMinutes} onChange={(e) => setManualEntryMinutes(Number(e.target.value) || 0)} className="mt-1 text-right font-mono" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Stundenlohn (€)</Label>
                <Input type="number" value={hourlyLaborCost} onChange={(e) => setHourlyLaborCost(Number(e.target.value) || 0)} className="mt-1 text-right font-mono" />
              </div>
            </div>

            <div className="pt-3 border-t border-border space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Druckkosten / Jahr</span>
                <span className="font-medium text-foreground tabular-nums">{fmt(results.annualPrintCost)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Personalkosten Dateneingabe</span>
                <span className="font-medium text-foreground tabular-nums">{fmt(Math.round(results.manualEntryCost))} €</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="font-semibold text-foreground">Gesamtkosten / Jahr</span>
                <span className="font-bold text-foreground tabular-nums">{fmt(Math.round(results.totalPaperCost))} €</span>
              </div>
            </div>
          </Card>

          {/* Column 2: NFCwear Kosten */}
          <Card className="p-5 border border-primary/20 bg-primary/5 space-y-4">
            <div className="flex items-center gap-2">
              <BadgePercent className="h-4 w-4 text-primary/60" />
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">NFCwear Kosten</h3>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Plan auswählen</Label>
              <Select value={plan} onValueChange={(v) => setPlan(v as PlanKey)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter – €29/Monat</SelectItem>
                  <SelectItem value="business">Business – €99/Monat</SelectItem>
                  <SelectItem value="enterprise">Enterprise – auf Anfrage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {plan !== "enterprise" ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Abo ({PLANS[plan].name})</span>
                  <span className="font-medium text-foreground tabular-nums">{fmt(results.nfcSubscription)} € / Jahr</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <Label className="text-xs text-muted-foreground">Hoodies (à 39,95 €)</Label>
                    <Input type="number" value={hoodieCount} onChange={(e) => setHoodieCount(Math.max(0, Number(e.target.value) || 0))} className="mt-1 text-right font-mono" min={0} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">T-Shirts (à 24,95 €)</Label>
                    <Input type="number" value={crewneckCount} onChange={(e) => setCrewneckCount(Math.max(0, Number(e.target.value) || 0))} className="mt-1 text-right font-mono" min={0} />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hardware gesamt</span>
                  <span className="font-medium text-foreground tabular-nums">{fmt(results.nfcOneTimeHardware)} € einmalig</span>
                </div>

                <div className="pt-3 border-t border-border space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-foreground">Jahr 1 (inkl. Hardware)</span>
                    <span className="font-bold text-foreground tabular-nums">{fmt(results.totalNfcCostYear1)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ab Jahr 2 (nur Abo)</span>
                    <span className="font-medium text-foreground tabular-nums">{fmt(results.totalNfcCostYear2)} €</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Enterprise-Preise werden individuell kalkuliert. Kontaktieren Sie uns für ein Angebot.
              </p>
            )}

            {plan !== "enterprise" && (
              <div className="pt-3 border-t border-border space-y-1.5">
                <p className="text-xs text-muted-foreground">Enthalten im Plan:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>✓ Automatische Lead-Erfassung (0 Min. Dateneingabe)</li>
                  <li>✓ CRM-Integration & Analytics</li>
                  <li>✓ Keine Nachdruckkosten – Profil jederzeit digital änderbar</li>
                </ul>
              </div>
            )}
          </Card>

          {/* Column 3: Ergebnis */}
          <div className="space-y-3">
            {plan !== "enterprise" ? (
              <>
                <Card className={`p-4 border text-center ${isPositive ? "border-green-500/20 bg-green-500/5" : "border-destructive/20 bg-destructive/5"}`}>
                  <PiggyBank className={`h-5 w-5 mx-auto mb-1.5 ${isPositive ? "text-green-500" : "text-destructive"}`} />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Ersparnis Jahr 1</p>
                  <p className={`text-2xl font-bold tabular-nums ${isPositive ? "text-green-500" : "text-destructive"}`}>
                    {results.savingsYear1 >= 0 ? "+" : ""}{fmt(Math.round(results.savingsYear1))} €
                  </p>
                </Card>

                <Card className="p-4 border border-green-500/20 bg-green-500/5 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1.5 text-green-500" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Ersparnis ab Jahr 2</p>
                  <p className="text-2xl font-bold text-green-500 tabular-nums">
                    +{fmt(Math.round(results.savingsYear2))} €
                  </p>
                </Card>

                <Card className="p-4 border border-border bg-card text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Amortisation</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {results.amortMonths !== null ? `${results.amortMonths.toFixed(1)} Monate` : "–"}
                  </p>
                </Card>

                <Card className="p-4 border border-border bg-card text-center">
                  <Users className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Zeitersparnis</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {fmt(Math.round(results.timeSavedHours))} Std.
                  </p>
                  <p className="text-xs text-muted-foreground">keine manuelle Dateneingabe</p>
                </Card>

                <Button asChild variant="default" className="w-full gap-2 mt-1">
                  <a href="/contact">
                    Demo anfragen <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </>
            ) : (
              <Card className="p-6 border border-border bg-card text-center h-full flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-3">Enterprise-ROI wird individuell kalkuliert.</p>
                <Button asChild variant="default" className="gap-2">
                  <a href="mailto:contact@severmore.com">
                    Gespräch vereinbaren <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </Card>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Berechnung basiert auf Ihren Eingaben. Druckkosten = Mitarbeitende × Kosten/Person × Druckläufe. 
          Personalkosten = Leads × Minuten/Lead × Stundenlohn ÷ 60. Hardware: Hoodie à €39,95, T-Shirt à €24,95.
        </p>
      </div>
    </motion.section>
  );
}
