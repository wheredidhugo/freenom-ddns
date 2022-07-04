# freenom-ddns

Dynamic DNS (DDNS) service for Freenom! Inspired by cloudflare-ddns.

# Get your domain id

On your browser, go to the dashboard of your domain. Copy the id in the url next to ?domainid=

# Installation

Copy .env-example and change it to your Freenom email and password.

Copy config-example.json and change it to your domain and domainId.

You can change the checking time (in hours) by changing the hoursChecking object or removing it.

Then:

```bash
npm install
```

# Docker

Build the Docker image:

```bash
docker build -t freenom-ddns .
```

Then compose the container:

```bash
docker compose up -d
```
