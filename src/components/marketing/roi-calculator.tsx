import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function RoiCalculator() {
  const [employees, setEmployees] = useState(20);
  const [paperCost, setPaperCost] = useState(49);
  const [digitalCost, setDigitalCost] = useState(24);
  const [oneTimeCost, setOneTimeCost] = useState(0);
  const [extraMargin, setExtraMargin] = useState(0);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const savingsPaper = employees * paperCost;
    const extraBenefit = employees * extraMargin;
    const costYear1 = employees * (digitalCost + oneTimeCost);
    const costYear2 = employees * digitalCost;
    const netYear1 = savingsPaper + extraBenefit - costYear1;
    const netYear2 = savingsPaper + extraBenefit - costYear2;
    const roiYear1 = costYear1 > 0 ? (netYear1 / costYear1) * 100 : 0;
    const amortMonths = costYear1 > 0 && (savingsPaper + extraBenefit) > 0
      ? (costYear1 / ((savingsPaper + extraBenefit) / 12))
      : 0;
    const benefitRatio = costYear1 > 0
      ? ((savingsPaper + extraBenefit) / (savingsPaper + extraBenefit + costYear1)) * 100
      : 0;

    return { savingsPaper, costYear1, netYear1, netYear2, roiYear1, amortMonths, benefitRatio };
  }, [employees, paperCost, digitalCost, oneTimeCost, extraMargin]);

  const reset = () => {
    setEmployees(20);
    setPaperCost(49);
    setDigitalCost(24);
    setOneTimeCost(0);
    setExtraMargin(0);
  };

  const copyResults = () => {
    const text = `ROI-Rechner Ergebnisse:\nErsparnis Papier/Jahr: ${results.savingsPaper} €\nDigitalkosten (Jahr 1): ${results.costYear1} €\nNetto-Vorteil Jahr 1: ${results.netYear1} €\nNetto-Vorteil ab Jahr 2: ${results.netYear2} €\nROI Jahr 1: ${results.roiYear1.toFixed(0)} %\nAmortisation: ${results.amortMonths.toFixed(1)} Monate`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (v: number) => v.toLocaleString("de-DE");

  const fields = [
    { label: "Mitarbeitende mit Visitenkarte", value: employees, set: setEmployees },
    { label: "Ø Papierkosten pro Person/Jahr (€)", value: paperCost, set: setPaperCost },
    { label: "Lizenzkosten digital pro Person/Jahr (€)", value: digitalCost, set: setDigitalCost },
    { label: "Optional: Einmalkosten Karte/Träger pro Person (€)", value: oneTimeCost, set: setOneTimeCost },
    { label: "Optional: Mehrmarge pro Person/Jahr (€)", value: extraMargin, set: setExtraMargin, hint: "z. B. durch bessere Lead-Erfassung" },
  ];

  const resultCards = [
    { label: "Ersparnis Papier/Jahr", value: `${fmt(results.savingsPaper)} €` },
    { label: "Digitalkosten (Jahr 1)", value: `${fmt(results.costYear1)} €` },
    { label: "Netto-Vorteil Jahr 1", value: `${fmt(results.netYear1)} €`, highlight: results.netYear1 > 0 },
    { label: "Netto-Vorteil ab Jahr 2", value: `${fmt(results.netYear2)} €`, highlight: results.netYear2 > 0 },
    { label: "ROI Jahr 1", value: `${results.roiYear1.toFixed(0)} %`, highlight: results.roiYear1 > 0 },
    { label: "Amortisation", value: `${results.amortMonths.toFixed(1)} Monate` },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-24 px-6"
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <Card className="p-6 md:p-8 mb-6 border-l-4 border-l-primary bg-card">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="text-primary" size={28} />
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              ROI-Rechner für digitale Visitenkarten
            </h2>
          </div>
          <p className="text-muted-foreground">
            Konzentriert auf das Wesentliche: Papiereinsparung vs. Digitalkosten. Optional kannst du Mehrertrag ergänzen.
          </p>
        </Card>

        {/* Input Fields */}
        <Card className="p-6 md:p-8 mb-6 border-l-4 border-l-primary/30 bg-card">
          <div className="space-y-5">
            {fields.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm md:text-base text-foreground font-medium">{f.label}</span>
                  {f.hint && <span className="text-xs text-muted-foreground ml-2">{f.hint}</span>}
                </div>
                <Input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.set(Number(e.target.value) || 0)}
                  className="w-full sm:w-28 text-right font-mono bg-muted/50"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="destructive" size="sm" onClick={reset} className="gap-2">
              <RotateCcw size={14} /> Zurücksetzen
            </Button>
            <Button variant="outline" size="sm" onClick={copyResults} className="gap-2">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Kopiert!" : "Ergebnisse kopieren"}
            </Button>
          </div>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {resultCards.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`p-5 border-l-4 ${r.highlight ? "border-l-green-500" : "border-l-primary/20"} bg-card`}>
                <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                <p className={`text-2xl md:text-3xl font-bold ${r.highlight ? "text-green-500" : "text-foreground"}`}>
                  {r.value}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefit Bar */}
        <Card className="p-5 border-l-4 border-l-primary bg-card">
          <p className="font-semibold text-foreground mb-3">Nutzen vs. Kosten (Jahr 1)</p>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(results.benefitRatio, 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Formeln: Ersparnis = Mitarbeitende × Papierkosten. Mehrnutzen = Mitarbeitende × Mehrmarge. Kosten (Jahr 1) = Mitarbeitende × (Lizenz + Einmalkosten). Netto Jahr 1 = Ersparnis + Mehrnutzen − Kosten. ROI = Netto ÷ Kosten.
          </p>
        </Card>
      </div>
    </motion.section>
  );
}
