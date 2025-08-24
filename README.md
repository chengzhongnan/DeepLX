# DeepLX TypeScript Implementation

This is a TypeScript implementation of the DeepLX translation API, based on the original Go version.

## Features

- Free DeepL translation API
- Support for both free and pro accounts
- Multiple endpoint formats for compatibility
- Token-based authentication
- Proxy support

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Running

```bash
npm start
```

For development:

```bash
npm run dev
```

## Configuration

The application can be configured using environment variables:

- `IP`: IP address to bind to (default: 0.0.0.0)
- `PORT`: Port to listen on (default: 1188)
- `TOKEN`: Access token for authentication
- `DL_SESSION`: DeepL session cookie for pro accounts
- `PROXY`: HTTP proxy URL

## API Endpoints

### GET /

Returns information about the API.

### POST /translate

Free translation endpoint.

Request body:
```json
{
  "text": "Hello World",
  "source_lang": "EN",
  "target_lang": "ZH"
}
```

### POST /v1/translate

Pro account translation endpoint. Requires a valid `dl_session` cookie.

### POST /v2/translate

Free translation endpoint with official API format compatibility.

## Testing

The project includes comprehensive tests to verify API functionality:

```bash
npm test
```

Tests cover:
- All API endpoints
- Authentication mechanisms
- Error handling
- Edge cases

## Cloudflare Workers Deployment

This project can be deployed to Cloudflare Workers for serverless hosting.

### Prerequisites

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

### Configuration

Edit `wrangler.toml` to configure your worker settings.

### Development

Run locally for development:
```bash
npm run cf-dev
```

### Deployment

Deploy to Cloudflare:
```bash
npm run cf-deploy
```

See `CF-DEPLOY.md` for detailed deployment instructions.

## License

MIT