# SendFox opt-in setup (checklist delivery)

Form: https://sendfox.com/form/1jgope/3oyw99 (SendFox hosts it; I could not open it from the build environment, so check each item below in your SendFox account).

## 1. Host the PDF
Upload `year-end-appeal-checklist.pdf` somewhere with a public, direct link (your website, or Google Drive set to "Anyone with the link can view"). SendFox emails carry a link, so people need a URL that opens without signing in. Put that URL in the welcome email below.

## 2. Form (in SendFox: Forms)
- Headline: Free 30-Day Year-End Appeal Checklist
- Button: Send me the checklist
- Consent line under the button: "You'll get the checklist by email, plus occasional nonprofit tips from Nonprofitsdaily. You can unsubscribe at any time."
- Collect first name and email only. Turn on double opt-in if you want confirmed subscribers (the checklist then goes out after confirmation).
- Put the people who sign up on one list (for example "Year-End Checklist") so you can tell where they came from.

## 3. Welcome email (SendFox: Automations, send on joining that list)
Subject: Your 30-day year-end appeal checklist

Hi {first_name},

Here's your checklist: [PDF LINK]

It's one page, four weeks: plan, write, launch, follow up. Mail before Giving Tuesday (December 1, 2026) and thank every donor within 48 hours.

Your one step today: write down your goal and your story.

Subscribe to my YouTube channel for more nonprofit tips.

[Your name, Philips Nonprofit Consulting, your mailing address]
Unsubscribe link (SendFox adds this)

Notes: use SendFox's own merge tag for the first name (check its exact syntax in the editor), and include your physical mailing address, which anti-spam law (CAN-SPAM) requires in marketing email.

## 4. Where the link goes
- YouTube description and pinned comment: the form link.
- Facebook, Instagram, LinkedIn captions: the form link (Instagram: put it in the bio, since captions don't make links clickable).
- `optin-page.html` is a branded landing page with your SendFox embed code (`data-form="3oyw99"`) inside it, so the form shows on the page itself; browsers with scripts off get a link to the hosted form. Host it on your site (or any static host) if you want a page under your own domain. I could not load SendFox from the build environment, so the embedded form is untested: open the page once in a browser and sign up with your own email.

## 5. Test it
Sign up once with your own email, confirm the welcome email arrives with a working PDF link, and open it on a phone.
