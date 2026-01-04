# Local Testing Guide

## Quick Start

### 1. Run Development Server

```bash
npm run dev
```

This starts a local server (usually at `http://localhost:5173`)

### 2. Test on Your Phone (Same WiFi)

1. Find your computer's local IP address:
   - **Mac/Linux**: Run `ifconfig | grep "inet "` or `ipconfig getifaddr en0`
   - **Windows**: Run `ipconfig` and look for IPv4 Address

2. On your phone's browser, go to:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
   Example: `http://192.168.1.100:5173`

3. Make sure your phone and computer are on the **same WiFi network**

### 3. Test Production Build Locally

To test the exact production build:

```bash
npm run build
npm run preview
```

This builds and serves the production version locally.

## Vite Configuration for Network Access

The dev server should already allow network access, but if it doesn't work:

1. Check `vite.config.ts` - it should have:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0' to allow network access
    port: 5173,
  },
  // ...
});
```

## Tips

- **Hot Reload**: Changes auto-refresh in browser (no need to restart)
- **Network Testing**: Use your phone to test mobile-specific features
- **Production Build**: Use `npm run preview` to test the exact build that goes to Netlify
- **No Credits Used**: Local testing doesn't use any Netlify credits!

## When to Deploy to Netlify

Only deploy when:
- ✅ You're happy with the changes
- ✅ You want to share with others
- ✅ You need to test on a public URL
- ✅ Ready for production

## Troubleshooting

**Can't access from phone?**
- Make sure firewall allows port 5173
- Check both devices are on same WiFi
- Try disabling VPN if active

**Port already in use?**
- Change port in `vite.config.ts` or use `npm run dev -- --port 3000`

