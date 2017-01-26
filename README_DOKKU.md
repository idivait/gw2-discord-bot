# Deploy on Dokku
## Set Up A Digital Ocean Droplet
1. [Sign up for a $5/mo droplet.](https://m.do.co/c/cc2efdf43c80) Using my link will get you two months free - And help pay for further development.
2. At the `Choose an Image` section, click `One-Click Apps` then `Dokku 0.7.2 on 16.04` or `Dokku 0.6.5 on 14.04`.
3. [Associate your SSH key with your droplet](https://www.digitalocean.com/community/tutorials/how-to-connect-to-your-droplet-with-ssh).
## Update Dokku and Install Plugins
1. SSH to the root of your Droplet (find the IP on the droplet dashboard).
2. Run the following to update dokku.
```
sudo apt-get update
sudo apt-get install -qq -y dokku herokuish
```
3. Install Dokku-Redis and LetsEncrypt for SSL. Set LetsEncrypt to auto-renew.
```
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku letsencrypt:cron-job --add
```
## Set Up A Domain Name
1. Go buy a domain. [I use google domains because they have pretty decent email forwarding built in.](https://domains.google) And no stupid upsells. Technically you can do without, but it will be a huge pain. 
2. Change the nameservers to `ns1.digitalocean.com`, `ns2.digitalocean.com` and `ns3.digitalocean.com`. Wait a bit for the name servers to transfer over.
3. Got your [Droplet dashboard](https://cloud.digitalocean.com/droplets) and click on `More` then `Add a Domain`.
4. Type in your domain name, then select your bot's droplet.
5. Add an entry: Host name is `*`. Will Direct To is your droplet from the dropdown.
6. Go to your domain - When you see the Dokku Setup screen, you're ready to go.
7. Verify your SSH key is correct.
8. Change HostName from the IP address to your domain name.
9. Check `Use virtualhost for naming apps.`
10. Click Setup.
## Get Your App Running
### Create the App
1. SSH to the root of your droplet again. 
2. Make the app. Make the database. Link them to eachother.
```
dokku app:create gw2-discord-bot
dokku redis:create gw2-discord-bot-db
dokku redis:link gw2-discord-bot-db gw2-discord-bot
```
3. Set up LetsEncrypt for the app.
```
dokku config:set --no-restart gw2-discord-bot DOKKU_LETSENCRYPT_EMAIL=your@email.tld
dokku letsencrypt gw2-discord-bot
```
## From Your Local Machine
### Set your SSH key as a deploy user.
```
cat ~/.ssh/id_rsa.pub | ssh root@YOURDOMAIN.COM "sudo sshcommand acl-add dokku root"
```
### Deploy from Local
1. Go back to your local machine.
2. Clone this repo into a local folder.
3. Set up your `local.toml` with 'alternate' as a feature. View the README for more info.
4. Add your droplet as a git remote. Commit and push to to Dokku.
```
git remote add dokku dokku@YOURDOMAIN.COM:gw2-discord-bot
git commit -a -m "First Dokku deploy."
git push dokku master
```
5. Go to gw2-discord-bot.YOURDOMAIN.COM . If you see the message 'This is the home of the GW2 Discord Bot.', congratulations, you're deployed!
## Extras
1. To make changes. Save your changes then:
```
git commit -a -m "YOUR MESSAGE HERE"
git push dokku master
```
2. Install docker-toolbelt. `dt logs` will show you what's going on on your droplet.
```
npm install -g docker-toolbelt
dt logs
```
3. SSH into your server and [harden your security](https://www.digitalocean.com/community/tutorials/an-introduction-to-securing-your-linux-vps).