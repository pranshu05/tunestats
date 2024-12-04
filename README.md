# Display your Spotify listening activity in a unique way! Follow steps below to get started

## Preview

![image](https://cdn.discordapp.com/attachments/1106636184425345224/1106776421726167060/image.png)

<a href="https://www.producthunt.com/posts/spotify-activity?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-spotify&#0045;activity" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=396383&theme=light" alt="Spotify&#0032;Activity - Display&#0032;your&#0032;Spotify&#0032;activity&#0032;in&#0032;a&#0032;unique&#0032;way | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Spotify API

* Create a [Spotify Application](https://developer.spotify.com/dashboard/applications)
* Take note of:
    * `Client ID`
    * `Client Secret`
* Click on **Edit Settings**
* In **Redirect URIs**:
    * Add `http://localhost/callback/`

## Refresh Token

* Navigate to the following URL:

```
https://accounts.spotify.com/authorize?client_id={SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-currently-playing,user-read-recently-played&redirect_uri=http://localhost/callback/
```

* After logging in, save the {CODE} portion of: `http://localhost/callback/?code={CODE}`

* Create a string combining `{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}` (e.g. `5n7o4v5a3t7o5r2e3m1:5a8n7d3r4e2w5n8o2v3a7c5`) and **encode** into [Base64](https://base64.io/).

* Then run a [curl command](https://httpie.org/run) in the form of:
```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic {BASE64}" -d "grant_type=authorization_code&redirect_uri=http://localhost/callback/&code={CODE}" https://accounts.spotify.com/api/token
```

* Save the Refresh token

* Watch [video tutorial](https://www.youtube.com/watch?v=yAXoOolPvjU) by API-University

## Deployment

### Deploy to Vercel

* Register on [Vercel](https://vercel.com/)

* Fork this repo, then create a vercel project linked to it

* Add Environment Variables:
    * `https://vercel.com/<YourName>/<ProjectName>/settings/environment-variables`
        * `REACT_APP_SPOTIFY_REFRESH_TOKEN`
        * `REACT_APP_SPOTIFY_CLIENT_ID`
        * `REACT_APP_SPOTIFY_CLIENT_SECRET`

* Deploy!
