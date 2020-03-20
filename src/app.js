import 'babel-polyfill'
import './style.scss'

import svg from './marker.svg'
import closeSvg from './close.svg'
import stylesControl from './stylesControl'

const defaultLat = 35.6762
const defaultLng = 139.6503
const defaultZoom = 10
const defaultStyle = 'geolonia/basic'

const html = '<div class="geolonia" data-lat=":lat" data-lng=":lng" data-zoom=":zoom" data-style=":style"></div>'

const btn = document.getElementById('get-geolonia')

btn.addEventListener('click', () => {
  if (document.getElementById('geolonia-map-outer-container')) {
    document.body.removeChild(document.getElementById('geolonia-map-outer-container'))
  }

  const outer = document.createElement('div')
  outer.id = 'geolonia-map-outer-container'
  const inner = document.createElement('div')
  inner.id = 'geolonia-map-inner-container'
  outer.appendChild(inner)

  const mapContainer = document.createElement('div')
  mapContainer.className = 'map-container'
  mapContainer.dataset.geolocateControl = 'on'
  mapContainer.dataset.lat = defaultLat
  mapContainer.dataset.lng = defaultLng
  mapContainer.dataset.zoom = defaultZoom
  mapContainer.dataset.marker = 'off'

  const codeContainer = document.createElement('div')
  codeContainer.className = 'code-container'
  codeContainer.textContent = html.replace(':lat', defaultLat).replace(':lng', defaultLng)
      .replace(':zoom', defaultZoom).replace(':style', defaultStyle)
  codeContainer.addEventListener('click', (e) => {
    const range = document.createRange()
    range.selectNodeContents(e.target)
    window.getSelection().addRange(range)
  })

  const marker = document.createElement('div')
  marker.innerHTML = svg
  marker.className = 'marker'

  const close = document.createElement('a')
  close.innerHTML = closeSvg
  close.className = 'close'

  close.addEventListener('click', () => {
    const outer = document.getElementById('geolonia-map-outer-container')
    document.body.removeChild(outer)
  })

  inner.appendChild(codeContainer)
  inner.appendChild(mapContainer)
  inner.appendChild(marker)
  inner.appendChild(close)

  document.body.appendChild(outer)

  const map = new window.geolonia.Map('.map-container')

  map.on('load', () => {
    const style = new stylesControl()
    map.addControl(style, 'top-left')

    map.on('moveend', () => {
      const center = map.getCenter().toArray()
      const zoom = map.getZoom()

      codeContainer.textContent = html.replace(':lat', center[1]).replace(':lng', center[0])
          .replace(':zoom', zoom).replace(':style', style.getStyle())
    })
  })
})
