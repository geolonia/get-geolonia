import * as clipboard from 'clipboard-polyfill'

import './style.scss'
import svg from './marker.svg'
import closeSvg from './close.svg'
import stylesControl from './stylesControl'

const defaultLat = 35.6762
const defaultLng = 139.6503
const defaultZoom = 10
const defaultStyle = 'geolonia/basic'

const html = '<div class="geolonia" data-lat=":lat" data-lng=":lng" data-zoom=":zoom" data-style=":style"></div>'

const app = (btn) => {
  btn.addEventListener('click', () => {
    if (document.getElementById('geolonia-map-outer-container')) {
      document.body.removeChild(document.getElementById('geolonia-map-outer-container'))
    }

    const options = {
      lat: defaultLat,
      lng: defaultLng,
      zoom: defaultZoom,
      style: defaultStyle,
      demo: 'off',
      ...btn.dataset
    }

    const outer = document.createElement('div')
    outer.id = 'geolonia-map-outer-container'

    if ('on' === options.demo) {
      outer.classList.add('demonstration-mode')
    }

    const inner = document.createElement('div')
    inner.className = 'geolonia-map-inner-container'
    outer.appendChild(inner)

    const mapContainer = document.createElement('div')
    mapContainer.className = 'map-container'
    mapContainer.dataset.geolocateControl = 'on'
    mapContainer.dataset.lat = defaultLat
    mapContainer.dataset.lng = defaultLng
    mapContainer.dataset.zoom = defaultZoom
    mapContainer.dataset.gestureHandling = 'off'
    mapContainer.dataset.marker = 'off'
    mapContainer.dataset.style = options.style
    mapContainer.dataset.maxZoom = "20"

    const close = document.createElement('a')
    close.innerHTML = closeSvg
    close.className = 'get-geolonia-close'

    close.addEventListener('click', () => {
      const outer = document.getElementById('geolonia-map-outer-container')
      document.body.removeChild(outer)
    })

    inner.appendChild(mapContainer)
    document.body.appendChild(outer)
    const map = new window.geolonia.Map('.map-container')
    inner.appendChild(close)

    if ('on' === options.demo) {
      map.on('load', () => {
        const style = new stylesControl(options.style)
        map.addControl(style, 'top-left')
      })
    } else if ('off' === options.demo) {
      const codeContainer = document.createElement('div')
      codeContainer.className = 'code-container'

      const input = document.createElement('input')
      input.className = 'get-geolonia-html'
      input.value = html.replace(':lat', options.lat).replace(':lng', options.lng)
          .replace(':zoom', options.zoom).replace(':style', options.style)

      const button = document.createElement('button')
      button.className = 'get-geolonia-copy'
      button.textContent = 'Copy to Clipboard'
      button.addEventListener('click', (e) => {
        input.select()
        clipboard.writeText(input.value)
      })

      codeContainer.appendChild(input)
      codeContainer.appendChild(button)

      const marker = document.createElement('div')
      marker.innerHTML = svg
      marker.className = 'get-geolonia-marker'

      const link = document.createElement('a')
      link.href = 'https://app.geolonia.com/#/signup'
      link.textContent = 'Do you have an API key?'
      codeContainer.appendChild(link)

      inner.appendChild(codeContainer)
      inner.appendChild(marker)

      map.on('load', () => {
        const style = new stylesControl(options.style)
        map.addControl(style, 'top-left')

        const writeCode = () => {
          const center = map.getCenter().toArray()
          const zoom = map.getZoom().toFixed(2)

          input.value = html.replace(':lat', center[1]).replace(':lng', center[0])
              .replace(':zoom', zoom).replace(':style', style.getStyle())
        }

        style.getSelect().addEventListener('change', writeCode)
        map.on('moveend', writeCode)
      })
    }
  })
}

const btns = document.getElementsByClassName('launch-get-geolonia')

btns.forEach(btn => {
  app(btn)
})
