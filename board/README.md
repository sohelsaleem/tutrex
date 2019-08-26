# Learnium Webinar SPA #

## Production Deploy ##

- git
    - create **release-1.0** branch
    - increase version to **1.0.0** in two `package.json` and commit it
    - merge it to **master**, **develop**
    - set tag **v1.0.0** to **master** branch
    - remove **release** branch and push all
- install apache, nodejs (5.6.0)
- install ffmpeg, unoconv and etc (see **backend/README.md**)
- create jenkins job **learnium_client_production** built from **master** branch
    - place backend in **/var/node/learnium**
    - add backend config to **/etc/learnium/config.json** (see **backend/README.md**)
    - place frontend in **/var/www/learnium_board**
    - check for the frontend webpack build and add **code minifier**
    - add and commit frontend production config
    - add apache config from demoserver to sure all alias are installed (see below)

### Apache config ###

Look at demoserver apache config first.

One need override some routes
- `/board/*` to `/var/www/learnium_board/current`
- `/boardFiles/*` to `/var/www/learnium_board/files`
- `/board` itself need own to **php** !

