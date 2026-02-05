PROJECT BRIEF: "NFCwear by
severmore" – The Wearable SaaS
Platform
1. Executive Summary

NFCwear by severmore is not just a clothing brand; it is a "Wearable Operating System" for
B2B clients. We sell high-quality corporate fashion (Hoodies, Crewnecks) with integrated
NTAG424 DNA chips. These chips connect to a cloud platform ("Severmore Cloud"), allowing
companies to manage the digital function of their employees' clothing dynamically.
Core Value: "One Hoodie. Infinite Modes. Managed in the Cloud."


2. The User Experience (Frontend Modes)

The system must support different "Modes" that the client can activate via their dashboard.
A. The Corporate Mode (Startup/B2B)

Target: Sales Teams, Founders, HR
  ●​ Feature 1: Digital Business Card (vCard):
         ○​ User scans hoodie -> Mobile Landing Page opens.
         ○​ "Save Contact" button (adds to phone contacts).
         ○​ Social Links (LinkedIn, Website).
  ●​ Feature 2: Two-Way Lead Capture (Critical!):
         ○​ "Let's Connect" Button on the profile.
         ○​ A form opens where the scanner enters their email/name.
         ○​ Data is synced to the hoodie owner (e.g., via Email or CRM Webhook).
  ●​ Feature 3: Recruiting:
         ○​ Link to "Jobs" page.
B. The Hospitality Mode (Gastronomy/Hotels)

Target: Restaurants, Bars, Hotels
  ●​ Feature 1: Review Booster:
         ○​ Direct redirect to the Google Maps/TripAdvisor "Write a Review" form.
  ●​ Feature 2: Digital Menu:
         ○​ Opens the current menu (PDF or Image Gallery).
C. The Campaign Mode (Marketing)

  ●​ Central override: Admin redirects all hoodies to a specific URL (e.g., "Black Friday
     Landing Page") for a limited time.
3. Technical Architecture (Backend Requirements)

1. The Chip Integration (Hardware)
   ●​ Chip Type: NTAG424 DNA (Round, Ø35mm).
   ●​ Security: Must use SUN (Secure Unique NFC) authentication to prevent URL cloning.
   ●​ Encoding: The chip stores a dynamic URL pointing to our server (e.g.,
       nfc.severmore.com/t/{UID}?sun={CMAC}).
2. Dynamic Routing Engine
   ●​ The system must not store hardcoded links on the chip.
   ●​ The backend resolves the Chip UID -> Looks up the active "Mode" in the database ->
       Redirects to the target URL.
3. Client Dashboard (Self-Service)
   ●​ Login: Company Admin & Individual User Login.
   ●​ Device Management: List of all active hoodies (e.g., "Max's Hoodie").
   ●​ Profile Editor: Users can update their photo, job title, links, and Review-URLs instantly.
   ●​ Analytics: Dashboard showing:
         ○​ Total Scans.
         ○​ Unique Scans.
         ○​ Lead Conversions (how many people filled out the contact form).


4. Design & Vibe (UI/UX)

  ●​   Aesthetics: "Friendly and blue Mode SaaS". Think Linear, Vercel, Raycast.
  ●​   Colors: white, Stark White, Electric Blue/Yellow accents.
  ●​   Typography: Modern Sans-Serif (Inter, Geist, Clash Display).
  ●​   Feel: Premium, Fast, Futuristic. NOT playful/cartoony.


5. Developer Task List (MVP Scope)

  1.​ Landing Page: Build the marketing front page (based on the provided Lovable/Design
      prompt).
        ○​ Key Sections: Hero (Mockup), Use Cases (Icons), Trust/Social Proof, Contact
           Form.
  2.​ Redirect System: Build the basic logic that takes an NFC scan and redirects it based on
      database rules.
  3.​ Mobile Profile Page: Create a responsive, beautiful mobile template for the "Digital
      Business Card" that looks good on iOS and Android.
        ○​ Must include: Profile Pic, Name, CTA Button ("Save Contact"), and the Lead
           Capture Form.
  4.​ Admin Panel: A simple interface for us to assign Chip IDs to Client Accounts.
Anhang: Prompt für AI-Design (Lovable/V0)

Use this prompt to generate the initial Landing Page Design:
Create a high-end, futuristic B2B landing page for "NFCwear by severmore".aesthetic
(Linear/Vercel style).
Hero: "Don't just wear your brand. Connect it." with a premium hoodie mockup showing a
glowing wrist tag.
Features: Show 3 distinct modes:
   1.​ "Corporate": Digital Business Card & Lead Gen.
   2.​ "Hospitality": Google Reviews & Tipping.
   3.​ "Marketing": Campaign Redirects.​
       Tech: Highlight "NTAG424 DNA Security" and "Cloud Dashboard".​
       Vibe: Expensive, Minimalist, Tech-Focused.
