import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 text-foreground">
                        Allgemeine Geschäftsbedingungen
                    </h1>
                    <div className="prose prose-invert max-w-none space-y-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Inhaltsverzeichnis</h2>
                            <ol className="list-decimal pl-5 text-muted-foreground">
                                <li>Geltungsbereich</li>
                                <li>Vertragsschluss</li>
                                <li>Widerrufsrecht</li>
                                <li>Preise und Zahlungsbedingungen</li>
                                <li>Liefer- und Versandbedingungen</li>
                                <li>Eigentumsvorbehalt</li>
                                <li>Mängelhaftung (Gewährleistung)</li>
                                <li>Haftung</li>
                                <li>Besondere Bedingungen für die Verarbeitung von Waren nach bestimmten Vorgaben des Kunden</li>
                                <li>Einlösung von Aktionsgutscheinen</li>
                                <li>Einlösung von Geschenkgutscheinen</li>
                                <li>Anwendbares Recht</li>
                                <li>Gerichtsstand</li>
                                <li>Alternative Streitbeilegung</li>
                            </ol>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">1) Geltungsbereich</h2>
                            <p className="text-muted-foreground mb-4">
                                1.1 Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB“) der Severmore UG (haftungsbeschränkt) (nachfolgend „Verkäufer"), gelten für alle Verträge zur Lieferung von Waren, die ein Verbraucher oder Unternehmer (nachfolgend „Kunde“) mit dem Verkäufer hinsichtlich der vom Verkäufer in seinem Online-Shop dargestellten Waren abschließt. Hiermit wird der Einbeziehung von eigenen Bedingungen des Kunden widersprochen, es sei denn, es ist etwas anderes vereinbart.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                1.2 Für Verträge zur Lieferung von Gutscheinen gelten diese AGB entsprechend, sofern insoweit nicht etwas Abweichendes geregelt ist.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                1.3 Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                1.4 Unternehmer im Sinne dieser AGB ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">2) Vertragsschluss</h2>
                            <p className="text-muted-foreground mb-4">
                                2.1 Die im Online-Shop des Verkäufers enthaltenen Produktbeschreibungen stellen keine verbindlichen Angebote seitens des Verkäufers dar, sondern dienen zur Abgabe eines verbindlichen Angebots durch den Kunden.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                2.2 Der Kunde kann das Angebot über das in den Online-Shop des Verkäufers integrierte Online-Bestellformular abgeben. Dabei gibt der Kunde, nachdem er die ausgewählten Waren in den virtuellen Warenkorb gelegt und den elektronischen Bestellprozess durchlaufen hat, durch Klicken des den Bestellvorgang abschließenden Buttons ein rechtlich verbindliches Vertragsangebot in Bezug auf die im Warenkorb enthaltenen Waren ab.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                2.3 Der Verkäufer kann das Angebot des Kunden innerhalb von fünf Tagen annehmen,
                                <ul className="list-disc pl-5 mt-2">
                                    <li>indem er dem Kunden eine schriftliche Auftragsbestätigung oder eine Auftragsbestätigung in Textform (Fax oder E-Mail) übermittelt, wobei insoweit der Zugang der Auftragsbestätigung beim Kunden maßgeblich ist, oder</li>
                                    <li>indem er dem Kunden die bestellte Ware liefert, wobei insoweit der Zugang der Ware beim Kunden maßgeblich ist, oder</li>
                                    <li>indem er den Kunden nach Abgabe von dessen Bestellung zur Zahlung auffordert.</li>
                                </ul>
                            </p>
                            <p className="text-muted-foreground mb-4">
                                Liegen mehrere der vorgenannten Alternativen vor, kommt der Vertrag in dem Zeitpunkt zustande, in dem eine der vorgenannten Alternativen zuerst eintritt. Die Frist zur Annahme des Angebots beginnt am Tag nach der Absendung des Angebots durch den Kunden zu laufen und endet mit dem Ablauf des fünften Tages, welcher auf die Absendung des Angebots folgt. Nimmt der Verkäufer das Angebot des Kunden innerhalb vorgenannter Frist nicht an, so gilt dies als Ablehnung des Angebots mit der Folge, dass der Kunde nicht mehr an seine Willenserklärung gebunden ist.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">3) Widerrufsrecht</h2>
                            <p className="text-muted-foreground mb-4">
                                3.1 Verbrauchern steht grundsätzlich ein Widerrufsrecht zu.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                3.2 Nähere Informationen zum Widerrufsrecht ergeben sich aus der Widerrufsbelehrung des Verkäufers.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">4) Preise und Zahlungsbedingungen</h2>
                            <p className="text-muted-foreground mb-4">
                                4.1 Sofern sich aus der Produktbeschreibung des Verkäufers nichts anderes ergibt, handelt es sich bei den angegebenen Preisen um Gesamtpreise, die die gesetzliche Umsatzsteuer enthalten. Gegebenenfalls zusätzlich anfallende Liefer- und Versandkosten werden in der jeweiligen Produktbeschreibung gesondert angegeben.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                4.2 Die Zahlungsmöglichkeit/en wird/werden dem Kunden im Online-Shop des Verkäufers mitgeteilt.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">5) Liefer- und Versandbedingungen</h2>
                            <p className="text-muted-foreground mb-4">
                                5.1 Bietet der Verkäufer den Versand der Ware an, so erfolgt die Lieferung innerhalb des vom Verkäufer angegebenen Liefergebietes an die vom Kunden angegebene Lieferanschrift, sofern nichts anderes vereinbart ist. Bei der Abwicklung der Transaktion ist die in der Bestellabwicklung des Verkäufers angegebene Lieferanschrift maßgeblich.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                5.2 Scheitert die Zustellung der Ware aus Gründen, die der Kunde zu vertreten hat, trägt der Kunde die dem Verkäufer hierdurch entstehenden angemessenen Kosten. Dies gilt im Hinblick auf die Kosten für die Hinsendung nicht, wenn der Kunde sein Widerrufsrecht wirksam ausübt. Für die Rücksendekosten gilt bei wirksamer Ausübung des Widerrufsrechts durch den Kunden die in der Widerrufsbelehrung des Verkäufers hierzu getroffene Regelung.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">6) Eigentumsvorbehalt</h2>
                            <p className="text-muted-foreground mb-4">
                                Tritt der Verkäufer in Vorleistung, behält er sich bis zur vollständigen Bezahlung des geschuldeten Kaufpreises das Eigentum an der gelieferten Ware vor.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">7) Mängelhaftung (Gewährleistung)</h2>
                            <p className="text-muted-foreground mb-4">
                                Soweit sich aus den nachfolgenden Regelungen nichts anderes ergibt, gelten die Vorschriften der gesetzlichen Mängelhaftung.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">8) Haftung</h2>
                            <p className="text-muted-foreground mb-4">
                                Der Verkäufer haftet dem Kunden aus allen vertraglichen, vertragsähnlichen und gesetzlichen, auch deliktischen Ansprüchen auf Schadens- und Aufwendungsersatz wie folgt:
                            </p>
                            <p className="text-muted-foreground mb-4">
                                8.1 Der Verkäufer haftet aus jedem Rechtsgrund uneingeschränkt<br />
                                - bei Vorsatz oder grober Fahrlässigkeit,<br />
                                - bei vorsätzlicher oder fahrlässiger Verletzung des Lebens, des Körpers oder der Gesundheit,<br />
                                - aufgrund eines Garantieversprechens, soweit diesbezüglich nichts anderes geregelt ist,<br />
                                - aufgrund zwingender Haftung wie etwa nach dem Produkthaftungsgesetz.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">12) Anwendbares Recht</h2>
                            <p className="text-muted-foreground mb-4">
                                Für sämtliche Rechtsbeziehungen der Parteien gilt das Recht der Bundesrepublik Deutschland unter Ausschluss der Gesetze über den internationalen Kauf beweglicher Waren. Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der gewährte Schutz durch zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, entzogen wird.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">13) Gerichtsstand</h2>
                            <p className="text-muted-foreground mb-4">
                                Handelt der Kunde als Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen mit Sitz im Hoheitsgebiet der Bundesrepublik Deutschland, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag der Geschäftssitz des Verkäufers.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4">14) Alternative Streitbeilegung</h2>
                            <p className="text-muted-foreground mb-4">
                                Der Verkäufer ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
