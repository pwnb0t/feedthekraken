Had a difficult time deploying this.

Meteor Cloud appears to be broken somehow. I could not sign up for an account. Maybe my account is just broken or something. That was my first plan.

I then was going to deploy to the same instance that I run the discord bot on, but it ran out of space so I walked that back.


The actual first plan was to deploy to a docker container on my Synology NAS and that is what I ended up with and it was a total pain.

I was doing to use one of my domains that I register through Hover with a subdomain pointing to my dyndns address. This was also a bust.

------

# here's the chatgpt thread if it still exists:
https://chatgpt.com/g/g-p-68e5343ad5608191a5ece91ff5895380-feedthekraken/c/68e6d06d-7e1c-832b-b152-0a5705c5c020

## MongoDB (local on NAS)

Current setup uses a local MongoDB container on the Synology NAS (not Atlas), to avoid public-IP allowlist churn.

- Container: `feedthekraken-mongo`
- Image: `mongo:4.4` (Mongo 5+ requires AVX; this NAS CPU does not support AVX)
- Data path: `/volume1/docker/feedthekraken/mongo-data`
- App DB URL: `mongodb://feedthekraken-mongo:27017/meteor?directConnection=true`

If you ever move back to Atlas, use a standard `mongodb+srv://.../meteor` URI in `MONGO_URL`.


## Synology NAS DSM Configuration

### Stuff that didn't work

Originally, I was going to deploy to https://home.<name>.com and I would have accepted http or using a port, but I did not get any of those to work properly. home.<name>.com points to pwnb0t.dyndns.org which is my DDNS that I use for the home server. I will probably just dump this at some point and just continue to use the Synology DDNS instead for anything honestly. We'll see. Haven't use the dyndns in quite some time.

I did a bunch of steps from ChatGPT around trying to set up a Let's Encrypt certificate for the home.<name>com domain that I originally wanted to use.

### Stuff that I think worked and is necessary

Control Panel -> External Access -> DDNS
This should already be configured for your Synology DDNS and/or custom domain.
Current canonical public host: kraken.pwnb0t.com

Control Panel -> External Access -> Router Configuration

Create -> Custom port
Protocol: TCP
Local Port: 3000
Remote Port: 3000 (I tried 443 at one point and that is not ok, guessing it interferes with Synology)

Use Synology Reverse Proxy so public traffic to kraken.pwnb0t.com is handled on 443 and forwarded to local port 3000.
Also add an HTTP (80) rule that redirects to HTTPS (443) for kraken.pwnb0t.com.


## Build app on dev and copy to Synology NAS

I did this in WebStorm terminal (powershell)

meteor build --directory ../feedthekraken-bundle --server-only

cd ..\feedthekraken-bundle\programs\server
npm install --omit=dev
(chatgpt instructions said npm ci --omit=dev but that caused a conflict/error and did install instead)

Then I just used explorer to copy the bundle folder to the Synology NAS.

It should look like:

pwnb0t@pwnology:/volume1/data/AppHosting/feedthekraken$ ls
bundle  Dockerfile
pwnb0t@pwnology:/volume1/data/AppHosting/feedthekraken$ ls bundle/
main.js  programs  README  server  star.json



## Dockerfile

on NAS:

/volume1/data/AppHosting/feedthekraken$ cat Dockerfile
FROM node:20-bullseye
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY bundle /app
WORKDIR /app/programs/server
RUN npm ci --omit=dev || true
WORKDIR /app
EXPOSE 3000
CMD ["node", "main.js"]


## NAS Docker steps

# I'm not 100% sure on this, but I think it's necessary to build the container first.
sudo docker build -t feedthekraken:runtime .

# Just removes any existing container if they exist.
docker rm -f feedthekraken 2>/dev/null || true

# This is the ORIGINAL command to run to make the app only listen to localhost connections (-p 127.0.0.1:3000:3000)
# sudo docker run -d --name feedthekraken --restart unless-stopped   -p 127.0.0.1:3000:3000   -e ROOT_URL=https://home.evanstenmark.com   -e MONGO_URL='mongodb+srv://<user>:<pw>@feedthekraken.XXXXX.mongodb.net/meteor?retryWrites=true&w=majority&appName=feedthekraken'   -e PORT=3000   -e HTTP_FORWARDED_COUNT=1   feedthekraken:runtime
# Had issues with this I was trying to debug, then ultimately switched to the below command. I don't know that the below command is necessary to remove the localhost restriction. But I also don't care about allowing connections from outside of the Synology NAS, since it's just on the LAN anyway.

# Current recommended run commands (local Mongo on NAS)

docker network create ftk_net 2>/dev/null || true

# Mongo (tiny-ish footprint)
docker rm -f feedthekraken-mongo 2>/dev/null || true
docker run -d --name feedthekraken-mongo --restart unless-stopped \
  --network ftk_net \
  -v /volume1/docker/feedthekraken/mongo-data:/data/db \
  mongo:4.4 \
  --bind_ip_all \
  --wiredTigerCacheSizeGB 0.25 \
  --setParameter diagnosticDataCollectionEnabled=false \
  --profile 0

# App
docker rm -f feedthekraken 2>/dev/null || true
docker run -d --name feedthekraken --restart unless-stopped \
  --network ftk_net \
  -p 127.0.0.1:3000:3000 \
  -e ROOT_URL=https://kraken.pwnb0t.com \
  -e MONGO_URL='mongodb://feedthekraken-mongo:27017/meteor?directConnection=true' \
  -e PORT=3000 \
  -e HTTP_FORWARDED_COUNT=1 \
  feedthekraken:runtime



## Deployed App URL

Canonical deployed URL:

https://kraken.pwnb0t.com/







## Meteor Cloud
I was able to get a Meteor Cloud account going on my alternate email address.
I was able to create an app, but once again, it's not deploying. So not sure what's going on there :(
