# PWA Setup Instructions

Your Drona POS application is now configured as a Progressive Web App! 

## What's Been Added

1. **PWA Plugin**: Vite PWA plugin installed and configured
2. **Service Worker**: Automatic caching and offline support
3. **Web Manifest**: App metadata for installation
4. **Icons**: PWA icons configuration (you need to generate actual icons)

## Generate Icons

To create the PWA icons:

1. Open `generate-icons.html` in your browser
2. The icons will automatically download
3. Move the downloaded files to the `/public` folder:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png`
   - `favicon.ico`

Alternatively, you can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## Testing the PWA

1. Build the app: `npm run build`
2. Preview the build: `npm run preview`
3. Open in Chrome and check:
   - DevTools > Application > Manifest
   - DevTools > Application > Service Workers
   - Install prompt should appear (desktop/mobile)

## PWA Features

✓ **Offline Support**: Service worker caches assets for offline use
✓ **Install Prompt**: Users can install the app on their device
✓ **App-like Experience**: Runs in standalone mode without browser UI
✓ **Auto-updates**: Service worker updates automatically
✓ **Optimized Caching**: Smart caching for fonts, CDN resources, and Firebase

## Deployment

When deploying to production:
- Ensure HTTPS is enabled (required for PWA)
- Icons are in the `/public` folder
- Build and deploy the `/dist` folder

## Development Mode

PWA features are enabled in dev mode too. You can test installation and service worker during development.
