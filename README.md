# Underwear Corner

React single-page app for an underwear store with English / Arabic support and a dark, modern theme.

## Tech stack

- React 18
- React Router DOM (3 pages: Home, Categories, Contact)
- Vite dev server / bundler

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open the printed localhost URL (for example `http://localhost:5173`) in your browser.

## Image assets

The app expects three images in the Vite public folder:

- `public/logo-underwear-corner.jpeg` – navbar logo  
  Use your image from **WhatsApp Image 2026-02-25 at 3.12.36 PM (1).jpeg**.

- `public/hero-underwear-corner.jpeg` – hero background image on the Home page  
  Use your image from **WhatsApp Image 2026-02-25 at 3.12.36 PM.jpeg**.

- `public/product-placeholder.jpg` – product card placeholder image  
  Use your image from **download (6).jpg**.

Place your files in the `public` folder with exactly those file names so references like `/hero-underwear-corner.jpeg` work correctly.

## Language switch (EN / AR)

- The language toggle button is in the navbar.
- It switches all main labels between English and Arabic.
- Layout direction changes automatically:
  - English → `ltr`
  - Arabic → `rtl`

## Routes / pages

- `/` – Home (hero + featured product grid)
- `/categories` – Categories overview cards
- `/contact` – Simple contact form

