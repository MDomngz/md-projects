# Marker Mile

A mobile-first prototype for planning road trips around American historical road markers.

## Open

Run a local static server from this folder, then open the URL in a browser:

```sh
python3 -m http.server --bind 127.0.0.1 4173
```

Then visit:

```text
http://127.0.0.1:4173/index.html
```

## What It Does

- Plans between two selected U.S. cities.
- Shows markers within the route corridor.
- Orders stops by route progress.
- Opens marker details with historical context.
- Saves uploaded marker photos as collectible stamps in the browser.
- Includes a web app manifest and service worker for installable-app behavior.

## Data Note

This prototype ships with a curated sample marker dataset. A production app should connect the same interface to a fuller source, such as state historical marker databases, DOT datasets, or a licensed national marker index.
