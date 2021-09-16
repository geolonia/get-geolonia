import geojsonExtent from '@mapbox/geojson-extent'

export class CommunityGeocoderControl {
  constructor(options) {
    this.lat = options.lat
    this.lng = options.lng
  }

  onAdd(map) {
    const onsubmit = this._onsubmit.bind(this)

    const container = document.createElement('form')
    container.style.margin = '8px'
    container.style.pointerEvents = 'auto'
    container.onsubmit = onsubmit

    const input = document.createElement('input')
    input.className = 'mapbox-gl-control-community-geocoder-text-input'
    input.type = 'text'
    input.placeholder = '住所を入力してください。'
    container.appendChild(input)

    const button = document.createElement('button')
    button.className = 'mapbox-gl-control-community-geocoder-button'
    button.type = 'button'
    button.innerText = '検索'
    button.disabled = 'disabled'
    button.addEventListener('click', onsubmit)
    container.appendChild(button)

    const message = document.createElement('p')
    message.className = 'mapbox-gl-control-community-geocoder-message'
    message.style.display = 'none'
    container.appendChild(message)

    input.addEventListener('keyup', (e) => {
      if(e.target.value) {
        button.removeAttribute('disabled')
      } else {
        button.setAttribute('disabled', 'disabled')
      }
    })
    input.addEventListener('keydown', (e) => {
      this.showMessage(false)
    })

    this.map = map
    this.container = container
    this.input = input
    this.button = button
    this.message = message
    return container
  }

  showMessage(value) {
    if(value === false) {
      this.message.style.display = 'none'
    } else {
      this.message.innerText = value
      this.message.style.display = 'block'
    }
  }

  _onsubmit() {
    const address = this.input.value
    if(address) {
      window.getLatLng(
        address,
        latlng => {
          // eslint-disable-next-line no-console
          console.log(latlng)
          if (latlng.level === 1) {
            console.log({latlng})
            const endpoint = 'https://geolonia.github.io/japanese-prefectural-capitals/index.json'
            fetch(endpoint).then(res => {
              return res.json()
            }).then(data => {
              this.map.flyTo({ center: data[latlng.pref], zoom: 9, essential: true })
              this.showMessage(`住所の判定ができなかったので「${latlng.pref}」に移動します。`)
            })
          } else if (latlng.level === 2) {
            const endpoint = 'https://geolonia.github.io/jisx0402/api/v1/all.json'
            fetch(endpoint).then(res => {
              return res.json()
            }).then(data => {
              const keys = Object.keys(data)
              const values = Object.values(data)
              const index = values.findIndex(value => value.prefecture === latlng.pref && value.city === latlng.city)
              const code = keys[index].substr(0, 5)

              const endpoint = `https://geolonia.github.io/japanese-admins/${code.substr(0, 2)}/${code}.json`
              fetch(endpoint).then(res => {
                return res.json()
              }).then(data => {
                this.map.fitBounds(geojsonExtent(data))
                this.showMessage(`住所の判定ができなかったので「${data.features[0].properties.name}」に移動します。`)
              })
            })
          } else {
            this.map.flyTo({ center: latlng, zoom: 16, essential: true })
          }
        },
        (err) => {
          console.error(err)
          this.showMessage(err.message || '不明なエラーです。')
        }
      )
    }
    return false
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container)
    /* eslint no-undefined: 0 */
    this.map = undefined
  }
}

export default CommunityGeocoderControl
