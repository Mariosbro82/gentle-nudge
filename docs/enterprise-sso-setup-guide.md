# SSO-Einrichtung für Enterprise-Kunden

## Severmore NFCwear – Single Sign-On (SAML 2.0)

Vielen Dank, dass Sie sich für Severmore NFCwear Enterprise entschieden haben. Diese Anleitung führt Ihren IT-Administrator durch die Einrichtung von Single Sign-On (SSO) für Ihr Unternehmen.

---

## Übersicht

Severmore NFCwear unterstützt **SAML 2.0 SSO**, kompatibel mit allen gängigen Identity Providern:

- Microsoft Entra ID (Azure AD)
- Okta
- Google Workspace
- OneLogin
- Ping Identity
- JumpCloud
- und weitere SAML 2.0-kompatible Provider

Nach der Einrichtung können sich alle Mitarbeiter Ihres Unternehmens mit ihren bestehenden Firmen-Zugangsdaten bei NFCwear anmelden – ohne separate Passwörter.

---

## Was wir von Ihnen benötigen

Bitte übermitteln Sie folgende Informationen an Ihren Severmore-Ansprechpartner:

| Information | Beschreibung | Beispiel |
|---|---|---|
| **SAML Metadata URL** | URL zur Metadata-XML Ihres Identity Providers | `https://login.microsoftonline.com/{tenant}/federationmetadata/2007-06/federationmetadata.xml` |
| **E-Mail-Domain(s)** | Die Domain(s), die für SSO aktiviert werden sollen | `siemens.com`, `siemens.de` |
| **Ansprechpartner IT** | Name & E-Mail des technischen Ansprechpartners | `max.mustermann@siemens.com` |

> **Alternativ:** Falls keine Metadata-URL verfügbar ist, benötigen wir die Metadata-XML-Datei direkt.

---

## Was Sie in Ihrem Identity Provider konfigurieren müssen

Erstellen Sie eine neue **SAML Enterprise Application** in Ihrem Identity Provider mit folgenden Werten:

### Service Provider Details (Severmore)

| Feld | Wert |
|---|---|
| **Entity ID (Identifier)** | `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/metadata` |
| **ACS URL (Reply URL)** | `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/acs` |
| **Sign-on URL** | `https://nfcwear.de/login` |
| **Name ID Format** | `emailAddress` |

### Erforderliche SAML-Attribute (Claims)

| Attribut | Wert / Quelle |
|---|---|
| `email` | Benutzer-E-Mail-Adresse (Pflicht) |
| `name` | Vor- und Nachname (Optional, empfohlen) |

---

## Schritt-für-Schritt: Microsoft Entra ID (Azure AD)

1. Öffnen Sie das [Azure Portal](https://portal.azure.com) → **Entra ID** → **Enterprise Applications**
2. Klicken Sie auf **+ New Application** → **Create your own application**
3. Name: `Severmore NFCwear` → Wählen Sie **"Non-gallery application"**
4. Gehen Sie zu **Single sign-on** → Wählen Sie **SAML**
5. Tragen Sie die Werte aus der Tabelle oben ein:
   - **Identifier (Entity ID)**: `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/metadata`
   - **Reply URL (ACS URL)**: `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/acs`
6. Unter **Attributes & Claims**: Stellen Sie sicher, dass `email` als NameID konfiguriert ist
7. Kopieren Sie die **App Federation Metadata URL** und senden Sie diese an Ihren Severmore-Ansprechpartner
8. Unter **Users and groups**: Weisen Sie die Mitarbeiter zu, die Zugang erhalten sollen

---

## Schritt-für-Schritt: Okta

1. Öffnen Sie die **Okta Admin Console** → **Applications** → **Create App Integration**
2. Wählen Sie **SAML 2.0**
3. App Name: `Severmore NFCwear`
4. Tragen Sie ein:
   - **Single sign-on URL**: `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/acs`
   - **Audience URI (SP Entity ID)**: `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/metadata`
   - **Name ID format**: `EmailAddress`
5. Kopieren Sie die **Metadata URL** aus dem Tab **Sign On** und senden Sie diese an Severmore
6. Weisen Sie Benutzer/Gruppen zu

---

## Schritt-für-Schritt: Google Workspace

1. Öffnen Sie die [Google Admin Console](https://admin.google.com) → **Apps** → **Web and mobile apps**
2. Klicken Sie auf **Add App** → **Add custom SAML app**
3. App Name: `Severmore NFCwear`
4. Laden Sie die **Metadata-Datei** herunter (Schritt 2) und senden Sie diese an Severmore
5. Tragen Sie ein:
   - **ACS URL**: `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/acs`
   - **Entity ID**: `https://owxuoejwnxspzuleeyqi.supabase.co/auth/v1/sso/saml/metadata`
   - **Name ID format**: `EMAIL`
6. Aktivieren Sie die App für die gewünschte Organisationseinheit

---

## Nach der Einrichtung

1. **Severmore aktiviert Ihre Domain** – Sie erhalten eine Bestätigung per E-Mail
2. **Testen Sie den Login** – Gehen Sie auf [nfcwear.de/login](https://nfcwear.de/login) und klicken Sie auf **"Mit Single Sign-On (SSO) anmelden"**
3. **Geben Sie Ihre Firmen-E-Mail ein** – Sie werden automatisch zu Ihrem Identity Provider weitergeleitet

---

## Login-Flow für Mitarbeiter

Nach erfolgreicher Einrichtung ist der Login für Ihre Mitarbeiter denkbar einfach:

1. Öffnen Sie `nfcwear.de/login`
2. Klicken Sie auf **"Mit Single Sign-On (SSO) anmelden"**
3. Geben Sie Ihre Firmen-E-Mail-Adresse ein (z.B. `vorname@firma.de`)
4. Sie werden zu Ihrem gewohnten Firmen-Login weitergeleitet
5. Nach erfolgreicher Anmeldung landen Sie direkt im NFCwear Dashboard

> **Hinweis:** Mitarbeiter benötigen kein separates Passwort für NFCwear.

---

## Häufige Fragen

### Können wir mehrere Domains registrieren?
Ja, wir können mehrere E-Mail-Domains pro Organisation registrieren (z.B. `firma.de` und `firma.com`).

### Was passiert mit bestehenden Accounts?
Bestehende Accounts mit E-Mail/Passwort-Login bleiben erhalten. Sobald SSO für die Domain aktiv ist, werden Nutzer mit passender Domain automatisch über SSO eingeloggt.

### Unterstützen Sie SCIM Provisioning?
Automatisches User-Provisioning (SCIM) ist auf Anfrage verfügbar. Kontaktieren Sie uns für Details.

### Welche Informationen verlassen unser Netzwerk?
Nur die E-Mail-Adresse und optional der Name werden über SAML übertragen. Es werden keine Passwörter an Severmore übermittelt.

---

## Kontakt & Support

Bei Fragen zur SSO-Einrichtung kontaktieren Sie uns:

- **E-Mail:** enterprise@severmore.de
- **Telefon:** Nach Vereinbarung
- **Antwortzeit:** Innerhalb von 24 Stunden (Werktage)

---

*Severmore UG – NFCwear Enterprise SSO Setup Guide v1.0*
