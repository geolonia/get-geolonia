import * as clipboard from 'clipboard-polyfill'

import './style.scss'
import svg from './marker.svg'
import closeSvg from './close.svg'
import stylesControl from './stylesControl'
import { CommunityGeocoderControl } from './communityGeocoderControl'

const defaultLat = 35.6762
const defaultLng = 139.6503
const defaultZoom = 10
const defaultStyle = 'geolonia/basic'

const htmlTemplate = '<div %ATTRIBUTES%></div>'

const camelToKebab = (str) =>  {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase();
}

const buildAttributeText = (options) => {
  const attributeDenyList = ['demo', 'geocoder']

  // data-marker depends on data-lat and data-lng. https://docs.geolonia.com
  // The simpler the snipet, the better.
  const extendedOptions = { ...options }
  if(options.marker && (!options.lat || !options.lng)) {
    delete extendedOptions.marker
  }

  return Object.keys(extendedOptions)
  .filter(key => !attributeDenyList.includes(key))
  .filter(key => extendedOptions[key])
  .map(key => {
    if(key === 'class') {
      return `class="${extendedOptions[key]}"`
    } else {
      return `data-${camelToKebab(key)}="${extendedOptions[key]}"`
    }
  })
  .join(' ') || ''
}

const app = btn => {
  btn.addEventListener('click', () => {
    if (document.getElementById('geolonia-map-outer-container')) {
      document.body.removeChild(document.getElementById('geolonia-map-outer-container'))
    }

    const options = {
      class: 'geolonia',
      lat: defaultLat,
      lng: defaultLng,
      zoom: defaultZoom,
      style: defaultStyle,
      demo: 'off',
      ...btn.dataset,
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
    mapContainer.dataset.gestureHandling = 'off'
    mapContainer.dataset.marker = 'off'
    mapContainer.dataset.maxZoom = '20'

    // if value === "" remove attributes from html and make it simple
    if(options.lat) { mapContainer.dataset.lat = options.lat }
    if(options.lng) { mapContainer.dataset.lng = options.lng }
    if(options.zoom) { mapContainer.dataset.zoom = options.zoom }
    if(options.style) { mapContainer.dataset.style = options.style }
    if (options.geojson) { mapContainer.dataset.geojson = options.geojson }
    if (options.simpleVector) { mapContainer.dataset.simpleVector = options.simpleVector }

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
      input.value = htmlTemplate.replace('%ATTRIBUTES%', buildAttributeText(options))

      const button = document.createElement('button')
      button.className = 'get-geolonia-copy'
      button.textContent = 'Copy to Clipboard'

      /* eslint no-unused-vars: 0 */
      button.addEventListener('click', e => {
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

        const writeCode = (e) => {
          const center = map.getCenter().toArray()
          const zoom = map.getZoom().toFixed(2)
          console.log(e.type, e.target.value)
          if(e.type === 'change' && e.target.value !== defaultStyle) {
            options.style = e.target.value
          }
          const updatedOptions = {
            ...options,
            lng: center[0],
            lat: center[1],
            zoom,
          }
          input.value = htmlTemplate.replace('%ATTRIBUTES%', buildAttributeText(updatedOptions))
        }

        style.getSelect().addEventListener('change', writeCode)
        map.on('moveend', writeCode)
      })
    }

    switch (options.geocoder) {
      case 'community-geocoder':
        map.on('load', () => {
          const communityGeocoderControl = new CommunityGeocoderControl(options)
          map.addControl(communityGeocoderControl, 'bottom-left')
        })
        break;
      default:
        break;
    }
  })
}

const btns = document.getElementsByClassName('launch-get-geolonia')

btns.forEach(btn => {
  app(btn)
})
