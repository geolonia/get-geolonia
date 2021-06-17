export default class stylesControl {
  constructor(defaultStyle = 'geolonia/basic') {
    this.defaultStyle = defaultStyle
    this.styleUrl = 'https://cdn.geolonia.com/style/%s/ja.json'
  }

  onAdd(map) {
    this.map = map
    this.container = document.createElement('div')
    this.select = document.createElement('select')
    this.select.className = 'mapbox-gl-control-select-style'
    this.container.appendChild(this.select)

    this.container.style.margin = '8px'
    this.container.style.pointerEvents = 'auto'

    fetch('https://cdn.geolonia.com/style/styles.json')
      .then(res => {
        return res.json()
      }).then(styles => {
        for (let i = 0; i < styles.length; i++) {
          const style = styles[i]
          const selected = (this.defaultStyle === style)
          this.select[i] = new Option(style, style, false, selected)
        }

        this.select.addEventListener('change', event => {
          this.currentStyle = event.target.value
          const style = this.styleUrl.replace('%s', event.target.value)
          this.map.setStyle(style)
        })
      })

    return this.container
  }

  getSelect() {
    return this.select
  }

  getStyle() {
    if (this.currentStyle) {
      return this.currentStyle
    } else {
      return this.defaultStyle
    }
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container)
    /* eslint no-undefined: 0 */
    this.map = undefined
  }
}
