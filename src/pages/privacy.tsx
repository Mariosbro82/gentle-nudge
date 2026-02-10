import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 text-foreground">
                        Datenschutz
                    </h1>
                    <div className="prose prose-invert max-w-none space-y-8">
                        {/* Content from _briefing/assets/datenschutz.md */}
                        <p className="text-xl text-muted-foreground mb-8">
                            1) Einleitung und Kontaktdaten des Verantwortlichen
                        </p>
                        <p className="text-muted-foreground">
                            1.1 Wir freuen uns, dass Sie unsere Website besuchen, und bedanken uns für Ihr Interesse. Im Folgenden informieren wir Sie über den Umgang mit Ihren personenbezogenen Daten bei der Nutzung unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit denen Sie persönlich identifiziert werden können.
                        </p>
                        <p className="text-muted-foreground">
                            1.2 Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Severmore UG (haftungsbeschränkt), Ludwig-van-Beethoven-Weg 9, 21423 Winsen (Luhe), Deutschland, Tel.: 015565824919, E-Mail: info@severmore.de. Der für die Verarbeitung von personenbezogenen Daten Verantwortliche ist diejenige natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">2) Datenerfassung beim Besuch unserer Website</h2>
                        <p className="text-muted-foreground">
                            2.1 Bei der bloß informatorischen Nutzung unserer Website, also wenn Sie sich nicht registrieren oder uns anderweitig Informationen übermitteln, erheben wir nur solche Daten, die Ihr Browser an den Seitenserver übermittelt (sog. „Server-Logfiles“). Wenn Sie unsere Website aufrufen, erheben wir die folgenden Daten, die für uns technisch erforderlich sind, um Ihnen die Website anzuzeigen:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground">
                            <li>Unsere besuchte Website</li>
                            <li>Datum und Uhrzeit zum Zeitpunkt des Zugriffes</li>
                            <li>Menge der gesendeten Daten in Byte</li>
                            <li>Quelle/Verweis, von welchem Sie auf die Seite gelangten</li>
                            <li>Verwendeter Browser</li>
                            <li>Verwendetes Betriebssystem</li>
                            <li>Verwendete IP-Adresse (ggf.: in anonymisierter Form)</li>
                        </ul>
                        <p className="text-muted-foreground mt-4">
                            Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website. Eine Weitergabe oder anderweitige Verwendung der Daten findet nicht statt. Wir behalten uns allerdings vor, die Server-Logfiles nachträglich zu überprüfen, sollten konkrete Anhaltspunkte auf eine rechtswidrige Nutzung hinweisen.
                        </p>
                        <p className="text-muted-foreground mt-4">
                            2.2 Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung personenbezogener Daten und anderer vertraulicher Inhalte (z.B. Bestellungen oder Anfragen an den Verantwortlichen) eine SSL-bzw. TLS-Verschlüsselung. Sie können eine verschlüsselte Verbindung an der Zeichenfolge „https://“ und dem Schloss-Symbol in Ihrer Browserzeile erkennen.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">3) Hosting & Content-Delivery-Network</h2>
                        <h3 className="text-xl font-semibold mt-4 mb-2">Shopify</h3>
                        <p className="text-muted-foreground">
                            Für das Hosting unserer Website und die Darstellung der Seiteninhalte nutzen wir das System des folgenden Anbieters: Shopify International Limited, Victoria Buildings, 2. Etage, 1-2 Haddington Road, Dublin 4, D04 XN32, Irland („Shopify“)
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Daten werden zudem übertragen an: Shopify Inc., 150 Elgin St, Ottawa, ON K2P 1L4, Kanada
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Sämtliche auf unserer Website erhobenen Daten werden auf den Servern des Anbieters verarbeitet. Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Bei einer Datenübermittlung nach Kanada ist ein angemessenes Datenschutzniveau durch einen Angemessenheitsbeschluss der Europäischen Kommission gewährleistet.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">4) Cookies</h2>
                        <p className="text-muted-foreground">
                            Um den Besuch unserer Website attraktiv zu gestalten und die Nutzung bestimmter Funktionen zu ermöglichen, verwenden wir Cookies, also kleine Textdateien, die auf Ihrem Endgerät abgelegt werden. Teilweise werden diese Cookies nach Schließen des Browsers automatisch wieder gelöscht (sog. „Session-Cookies“), teilweise verbleiben diese Cookies länger auf Ihrem Endgerät und ermöglichen das Speichern von Seiteneinstellungen (sog. „persistente Cookies“). Im letzteren Fall können Sie die Speicherdauer der Übersicht zu den Cookie-Einstellungen Ihres Webbrowsers entnehmen.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Sofern durch einzelne von uns eingesetzte Cookies auch personenbezogene Daten verarbeitet werden, erfolgt die Verarbeitung gemäß Art. 6 Abs. 1 lit. b DSGVO entweder zur Durchführung des Vertrages, gemäß Art. 6 Abs. 1 lit. a DSGVO im Falle einer erteilten Einwilligung oder gemäß Art. 6 Abs. 1 lit. f DSGVO zur Wahrung unserer berechtigten Interessen an der bestmöglichen Funktionalität der Website sowie einer kundenfreundlichen und effektiven Ausgestaltung des Seitenbesuchs.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und einzeln über deren Annahme entscheiden oder die Annahme von Cookies für bestimmte Fälle oder generell ausschließen können.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Bitte beachten Sie, dass bei Nichtannahme von Cookies die Funktionalität unserer Website eingeschränkt sein kann.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">5) Kontaktaufnahme</h2>
                        <h3 className="text-xl font-semibold mt-4 mb-2">5.1 Shopify Inbox</h3>
                        <p className="text-muted-foreground">
                            Diese Webseite nutzt das Live-Chat-System des folgenden Anbieters: Shopify International Limited, Victoria Buildings, 2nd Floor, 1-2 Haddington Road, Dublin 4, D04 XN32, Irland
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Die Verarbeitung von über den Chat übermittelten personenbezogenen Daten erfolgt entweder gemäß Art. 6 Abs. 1 lit b DSGVO, weil es für die Vertragsanbahnung oder -durchführung erforderlich ist, oder gemäß Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der effektiven Betreuung unserer Seitenbesucher.
                            Ihre so übermittelten Daten werden vorbehaltlich entgegenstehender gesetzlicher Aufbewahrungsfristen gelöscht, wenn der betroffene Sachverhalt abschließend geklärt ist.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Zusätzlich können zum Zwecke der Erstellung pseudonymisierter Nutzungsprofile mithilfe von Cookies weitere Informationen erhoben und ausgewertet werden, die allerdings nicht Ihrer persönlichen Identifikation dienen und nicht mit anderen Datensätzen zusammengeführt werden. Sofern diese Informationen einen Personenbezug aufweisen, erfolgt die Verarbeitung gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der statistischen Analyse des Nutzerverhaltens zu Optimierungszwecken.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Das Setzen von Cookies kann durch entsprechende Browsereinstellungen verhindert werden. Gegebenenfalls wird die Funktionalität unserer Internetseite in diesem Fall aber eingeschränkt.
                            Der Datenerhebung und -speicherung zum Zwecke der Erstellung eines pseudonymisierten Nutzungsprofils können Sie uns gegenüber jederzeit mit Wirkung für die Zukunft widersprechen.
                        </p>

                        <h3 className="text-xl font-semibold mt-4 mb-2">5.2 Judge.me</h3>
                        <p className="text-muted-foreground">
                            Für Bewertungserinnerungen nutzen wir die Dienste des folgenden Anbieters: Judge.me Ltd., c/o Buckworths, 2nd Floor, 1-3 Worship Street, London, England, EC2A 2AB, Vereinigtes Königreich
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Ausschließlich auf Basis Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO übermitteln wir Ihre E-Mailadresse und ggf. weitere Kundendaten an den Anbieter, damit dieser Sie mit einer Bewertungserinnerung per E-Mail kontaktiert.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft uns oder dem Anbieter gegenüber widerrufen.
                        </p>

                        <p className="text-muted-foreground mt-4">
                            5.3 Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder E-Mail) werden – ausschließlich zum Zweck der Bearbeitung und Beantwortung Ihres Anliegens und nur im dafür erforderlichen Umfang – personenbezogene Daten verarbeitet.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Rechtsgrundlage für die Verarbeitung dieser Daten ist unser berechtigtes Interesse an der Beantwortung Ihres Anliegens gemäß Art. 6 Abs. 1 lit. f DSGVO. Zielt Ihre Kontaktierung auf einen Vertrag ab, so ist zusätzliche Rechtsgrundlage für die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO. Ihre Daten werden gelöscht, wenn sich aus den Umständen entnehmen lässt, dass der betroffene Sachverhalt abschließend geklärt ist und sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">6) Datenverarbeitung bei Eröffnung eines Kundenkontos</h2>
                        <p className="text-muted-foreground">
                            Gemäß Art. 6 Abs. 1 lit. b DSGVO werden personenbezogene Daten im jeweils erforderlichen Umfang weiterhin erhoben und verarbeitet, wenn Sie uns diese bei der Eröffnung eines Kundenkontos mitteilen. Welche Daten für die Kontoeröffnung erforderlich sind, entnehmen Sie der Eingabemaske des entsprechenden Formulars auf unserer Website.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Eine Löschung Ihres Kundenkontos ist jederzeit möglich und kann durch eine Nachricht an die o.g. Adresse des Verantwortlichen erfolgen. Nach Löschung Ihres Kundenkontos werden Ihre Daten gelöscht, sofern alle darüber geschlossenen Verträge vollständig abgewickelt sind, keine gesetzlichen Aufbewahrungsfristen entgegenstehen und unsererseits kein berechtigtes Interesse an der Weiterspeicherung fortbesteht.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">7) Nutzung von Kundendaten zur Direktwerbung</h2>
                        {/* Summary of section 7 for brevity, or full content */}
                        <p className="text-muted-foreground">
                            Weitere Informationen zur Nutzung Ihrer Daten für Direktwerbung (Newsletter, Warenverfügbarkeit, Warenkorb-Erinnerungen) und die beteiligten Dienstleister (Klaviyo, Shopify Email) entnehmen Sie bitte der vollständigen Datenschutzerklärung.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">8) Datenverarbeitung zur Bestellabwicklung</h2>
                        <p className="text-muted-foreground">
                            Zur Vertragsabwicklung geben wir personenbezogene Daten an Transportunternehmen und Kreditinstitute weiter.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">12) Rechte des Betroffenen</h2>
                        <p className="text-muted-foreground">
                            12.1 Das geltende Datenschutzrecht gewährt Ihnen gegenüber dem Verantwortlichen hinsichtlich der Verarbeitung Ihrer personenbezogenen Daten die nachstehenden Betroffenenrechte (Auskunfts- und Interventionsrechte), wobei für die jeweiligen Ausübungsvoraussetzungen auf die angeführte Rechtsgrundlage verwiesen wird:
                        </p>
                        <ul className="list-disc pl-5 text-muted-foreground mt-2">
                            <li>Auskunftsrecht gemäß Art. 15 DSGVO;</li>
                            <li>Recht auf Berichtigung gemäß Art. 16 DSGVO;</li>
                            <li>Recht auf Löschung gemäß Art. 17 DSGVO;</li>
                            <li>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO;</li>
                            <li>Recht auf Unterrichtung gemäß Art. 19 DSGVO;</li>
                            <li>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO;</li>
                            <li>Recht auf Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3 DSGVO;</li>
                            <li>Recht auf Beschwerde gemäß Art. 77 DSGVO.</li>
                        </ul>
                        <h3 className="text-xl font-bold mt-4 mb-2">12.2 WIDERSPRUCHSRECHT</h3>
                        <p className="text-muted-foreground font-bold">
                            WENN WIR IM RAHMEN EINER INTERESSENABWÄGUNG IHRE PERSONENBEZOGENEN DATEN AUFGRUND UNSERES ÜBERWIEGENDEN BERECHTIGTEN INTERESSES VERARBEITEN, HABEN SIE DAS JEDERZEITIGE RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIESE VERARBEITUNG WIDERSPRUCH MIT WIRKUNG FÜR DIE ZUKUNFT EINZULEGEN.
                        </p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">13) Dauer der Speicherung personenbezogener Daten</h2>
                        <p className="text-muted-foreground">
                            Die Dauer der Speicherung von personenbezogenen Daten bemisst sich anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und – sofern einschlägig – zusätzlich anhand der jeweiligen gesetzlichen Aufbewahrungsfrist.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
