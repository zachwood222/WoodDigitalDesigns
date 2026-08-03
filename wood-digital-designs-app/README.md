# Wood Digital Designs Web App

A responsive interactive website built with Node.js, HTML, CSS, and vanilla JavaScript. It has no required third party npm packages.

## Included

* Interactive service selector
* Four question package finder
* Editable package pricing
* Monthly cost estimator
* Filterable portfolio
* Responsive mobile navigation
* Contact form with Resend, Formspree, or another webhook service
* Render blueprint file
* Health check endpoint

## Run locally

1. Install Node.js 20 or newer.
2. Open this folder in a terminal.
3. Run `npm start`.
4. Open `http://localhost:3000`.

To use environment variables locally, start it with your preferred environment manager or set the variables in your terminal before running the app.

## Deploy to Render

### Upload through GitHub

1. Create a new GitHub repository.
2. Upload every file in this folder to the repository.
3. In Render, choose **New** and then **Web Service**.
4. Connect the repository.
5. Use these settings:

   * Runtime: Node
   * Build command: `npm install`
   * Start command: `npm start`
   * Health check path: `/api/health`

6. Add contact form environment variables if desired.
7. Deploy.

### Render Blueprint

The included `render.yaml` can create the web service automatically after the project is connected to GitHub.

## Contact form setup

The site supports two delivery methods. Resend is checked first. A webhook is used second.

### Resend

Add these values in Render under **Environment**:

```env
OWNER_EMAIL=your-email@example.com
FROM_EMAIL=Wood Digital Designs <hello@yourdomain.com>
RESEND_API_KEY=re_your_api_key
```

Your sending domain must be verified in Resend for a custom `FROM_EMAIL`. During testing, Resend may allow its onboarding sender.

### Formspree or another webhook

Add the form endpoint as:

```env
CONTACT_WEBHOOK_URL=https://formspree.io/f/your-form-id
OWNER_EMAIL=your-email@example.com
```

Without either delivery method, the website still runs. When `OWNER_EMAIL` is present, the form opens the visitor's email app with the inquiry filled in.

## Main content to edit

* Homepage text: `public/index.html`
* Colors and layout: `public/styles.css`
* Quiz logic and estimator: `public/app.js`
* Package pricing: search for `$300` and `$500` in `public/index.html`
* Contact delivery: `server.js`

## Add real portfolio images

The current portfolio uses custom graphic placeholders so the site works immediately without external image hosting. Replace each `.portfolio-art` block in `public/index.html` with your own image tag, then add the images to `public/images`.

Example:

```html
<img src="/images/fowhand-campaign.jpg" alt="Furniture promotion designed by Wood Digital Designs" />
```
