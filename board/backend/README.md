# Tutrex SPA Backend #

## Prerequisites ##

- unoconv
    - libreoffice
- kurento
- ffmpeg

## Start development ##

Copy all `*.js.in` files to `*.js` in **src/config** folder, change it for your needs and run

```
node src/index.js --config local
```

### Config ###

There are 3 layer of configs:

1. Default and common - `src/config/default.js`
2. Local config or external
    2.1. Local `src/config/config_local.js` - for development purpose only
    2.2. External `/etc/tutrex/config.json` or file specified in **CONFIG** environment variable

To add new config property one need add it to only **default config** or to **all** `config_*` files (including `config_local.js.in` for other developers)

### Local config ###

There are some development parameters in local config:

- **noSSL** - do not use secure websockets
- **simpleAuth** - do not use auth with server api, token is `base64(json(authInfo))`
- **simpleAuthDelay** - how long sleep before do simple auth (simulation delay)
- **simpleRoomNotifier** - do not use server api for room notifications (ex.: user enter/left room, finishLesson)

### New controller ###

Add file with suffux `Controller.js` to `src/controllers` and listen events from socket channel

## Deploy production ##

- create config file `/etc/tutrex/config.json`
    - add **port**
    - add ssl keys - (**sslKey, sslCert, sslCa**)
    - add api server base url **apiURL**
    - add **kurentoURL** (for, example **ws://localhost:8888/kurento**)
    - add **filesPath**
    - add **filesURL**


TODO...
