# Cloudflare DDNS

This is a small Dynamic DNS client for [Cloudflare's Free DNS Service](https://cloudflare.com/dns) inspired by [oznu's](https://github.com/oznu) [cloudflare-ddns](https://github.com/oznu/docker-cloudflare-ddns) project. oznu's client is no longer maintained, so this project is intended to offer an alternative.

## Usage

Docker CLI:

```shell
docker run \
  --restart=unless-stopped \
  -e API_TOKEN=cloudflare-token \
  -e ZONE=example.com \
  --name cloudflare-ddns-ts \
  ghcr.io/pragma8123/cloudflare-ddns-ts
```

Docker Compose:

```yaml
---
services:
  cloudflare-ddns-ts:
    image: ghcr.io/pragma8123/cloudflare-ddns-ts
    container_name: cloudflare-ddns-ts
    restart: unless-stopped
    environment:
      - API_KEY=cloudflare-api-token
      - ZONE=example.com
```

## Parameters

- `API_TOKEN` - Cloudflare API Token. See instructions below if you need help.
- `ZONE` - Cloudflare DNS zone. This is your root domain (i.e. example.com)

## Optional Parameters

- `RECORDS` - Comma-separated list of DNS records (subdomains) to update. Include @ in your list to update the root domain. Defaults to `@` (just the root DNS record).
- `PROXIED` - Set to `true` if you want to use Cloudflare's security proxy. Defaults to `false`.
- `TZ` - Set timezone for DNS update cron job. Can be any TZ Database name (i.e. America/New_York) - Defaults to `UTC`.
- `CRON` - [Cron schedule](https://crontab.guru/) for updating DNS records. Defaults to `@daily`.

## Cloudflare API Token

To use this DDNS client, you will need a Cloudflare API token with edit permissions for your zone's DNS settings.

To create a token, navigate to your [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens).

1. Click 'Create Token'.
2. Use the "Edit zone DNS" API token template.
3. Under "Zone Resources" use the drop-down to select a specific zone (your domain). Then click "Continue to summary"
4. You should see your domain with **DNS:Edit** to the right.
5. Click "Create Token" and you should now see your API token.
