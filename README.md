# A JavaScript API that generates HTML to display Geolonia's map

## API

https://geolonia.github.io/get-geolonia/app.js

## Install

```html
<p><button class="launch-get-geolonia">Get Geolonia</button></p>

<script type="text/javascript" src="https://cdn.geolonia.com/v1/embed?geolonia-api-key=YOUR-API-KEY"></script>
<script type="text/javascript" src="https://geolonia.github.io/get-geolonia/app.js"></script>
```

## Options

```html
<button
  class="launch-get-geolonia"

  # see docs.geolonia.com/embed
  data-style="geolonia/midnight"
  data-lng="123.45"
  data-lat="45.67"
  data-zoom="10"
  data-geojson="https://example.com/path/to/geojson"
  data-simple-vector="https://example.com/path/to/simplevector"
  data-marker="off"

  data-demo="on" # 'on' | 'off'
  data-geocoder="community-geocoder" # 'community-geocoder' | 'off'
>Get Geolonia</button>
```

NOTE: `data-geocoder="community-geocoder"` requires community-geocoder API with `<script src="https://cdn.geolonia.com/community-geocoder.js"></script>` at first.
