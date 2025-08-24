# DeepLX Cloudflare Workers Deployment

This directory contains the configuration and code needed to deploy DeepLX to Cloudflare Workers.

## Prerequisites

1. Install [Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update) CLI tool:
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

## Configuration

Edit `wrangler.toml` to configure your worker:

```toml
name = "deeplx"  # Your worker name
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[vars]
TOKEN = "your-secret-token"  # Set your access token
DL_SESSION = "your-dl-session"  # Set your DeepL session (for Pro accounts)
PROXY = ""  # Set proxy URL if needed
```

## Development

Run the worker locally for development:

```bash
npm run cf-dev
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run cf-deploy
```

For a preview deployment without actually deploying:

```bash
npm run cf-deploy-preview
```

## Environment Variables

You can set environment variables in the Cloudflare dashboard or using Wrangler:

```bash
wrangler secret put TOKEN
wrangler secret put DL_SESSION
```

## Usage

After deployment, your API will be available at:
`https://<worker-name>.<your-subdomain>.workers.dev`

Endpoints:
- `GET /` - API information
- `POST /translate` - Free translation
- `POST /v1/translate` - Pro account translation
- `POST /v2/translate` - Official API format