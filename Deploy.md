Had a difficult time deploying this.

Meteor Cloud appears to be broken somehow. I could not sign up for an account. Maybe my account is just broken or something. That was my first plan.

I then was going to deploy to the same instance that I run the discord bot on, but it ran out of space so I walked that back.


The actual first plan was to deploy to a docker container on my Synology NAS and that is what I ended up with and it was a total pain.

I was doing to use one of my domains that I register through Hover with a subdomain pointing to my dyndns address. This was also a bust.

------

# here's the chatgpt thread if it still exists:
https://chatgpt.com/g/g-p-68e5343ad5608191a5ece91ff5895380-feedthekraken/c/68e6d06d-7e1c-832b-b152-0a5705c5c020

## Mongodb Atlas

What ended up working was using the synology DDNS and the docker container on the NAS but building the app locally and deploying it there.

Registered for a free mongodb atlas account and deployed to a free tier instance. Get the link from that instance like:

mongodb+srv://<user>:<pw>@feedthekraken.XXXXX.mongodb.net/?retryWrites=true&w=majority&appName=feedthekraken

then add /meteor to the path (represents the database):

mongodb+srv://<user>:<pw>@feedthekraken.XXXXX.mongodb.net/meteor?retryWrites=true&w=majority&appName=feedthekraken


## Synology NAS DSM Configuration

### Stuff that didn't work

Originally, I was going to deploy to https://home.<name>.com and I would have accepted http or using a port, but I did not get any of those to work properly. home.<name>.com points to pwnb0t.dyndns.org which is my DDNS that I use for the home server. I will probably just dump this at some point and just continue to use the Synology DDNS instead for anything honestly. We'll see. Haven't use the dyndns in quite some time.

I did a bunch of steps from ChatGPT around trying to set up a Let's Encrypt certificate for the home.<name>com domain that I originally wanted to use.

### Stuff that I think worked and is necessary

Control Panel -> External Access -> DDNS
This should already be configured for pwnb0t.synology.me and works great.

Control Panel -> External Access -> Router Configuration

Create -> Custom port
Protocol: TCP
Local Port: 3000
Remote Port: 3000 (I tried 443 at one point and that is not ok, guessing it interferes with Synology)

This should now forward traffic from pwnb0t.synology.me:3000 to local 3000


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

# The command that's currently running while I'm writing this doc (with user/pw stripped):
sudo docker run -d --name feedthekraken --restart unless-stopped   -p 3000:3000   -e ROOT_URL=https://home.<name>.com   -e MONGO_URL='mongodb+srv://<user>:<pw>@feedthekraken.XXXXXX.mongodb.net/meteor?retryWrites=true&w=majority&appName=feedthekraken'   -e PORT=3000 -e HTTP_FORWARDED_COUNT=1   feedthekraken:runtime

# NOTE: yes, it still has the wrong domain, it should be:
sudo docker run -d --name feedthekraken --restart unless-stopped   -p 3000:3000   -e ROOT_URL=https://pwnb0t.synology.me:3000   -e MONGO_URL='mongodb+srv://<user>:<pw>@feedthekraken.XXXXXX.mongodb.net/meteor?retryWrites=true&w=majority&appName=feedthekraken'   -e PORT=3000 -e HTTP_FORWARDED_COUNT=1   feedthekraken:runtime

# It probably has something to do with me still having the dev move or non-secure stuff running in meteor so it allows any URL or something. I also don't care enough right now to change it.


# original from chatgpt
docker rm -f feedthekraken
docker run -d --name feedthekraken --restart unless-stopped \
-p 3000:3000 \
-e ROOT_URL=https://home.<name>.com \
-e MONGO_URL='<<your Atlas URI>>' \
-e PORT=3000 -e HTTP_FORWARDED_COUNT=1 \
feedthekraken:runtime



## Deployed App URL

Ultimate deployed URL:

http://pwnb0t.synology.me:3000/







## Meteor Cloud
I was able to get a Meteor Cloud account going on my alternate email address.
I was able to create an app, but once again, it's not deploying. So not sure what's going on there :(
