# Deployment Instructions for Netlify

## Option 1: Deploy via Netlify Web Interface (Recommended)

1. **Visit Netlify**: Go to [https://app.netlify.com](https://app.netlify.com)

2. **Import from GitHub**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select the repository: `joshuamtm/meet-the-moment`

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 or higher

4. **Deploy**: Click "Deploy site"

The site will be automatically deployed and you'll receive a URL like:
`https://meet-the-moment.netlify.app`

## Option 2: Deploy via Netlify CLI

If you have Netlify CLI installed and configured:

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Option 3: Drag and Drop

1. Build the project locally:
```bash
npm run build
```

2. Visit [https://app.netlify.com/drop](https://app.netlify.com/drop)

3. Drag the `dist` folder to the browser window

## Continuous Deployment

Once connected via GitHub, Netlify will automatically deploy on every push to the main branch.

## Environment Variables

This app doesn't require any environment variables as it's completely stateless and runs entirely in the browser.

## Custom Domain

To add a custom domain:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow the DNS configuration instructions