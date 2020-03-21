export default class stylesControl {
  constructor(defaultStyle = 'geolonia/basic') {
    this.styles = [
      'geolonia/basic',
      'geolonia/midnight',
      'geolonia/red-planet',
      'geolonia/notebook',
    ]

    this.defaultStyle = defaultStyle

    this.styleUrl = 'https://raw.githubusercontent.com/%s/master/style.json'
  }

  onAdd(map) {
    this.map = map
    this.container = document.createElement('div')
    this.select = document.createElement('select')
    this.container.appendChild(this.select)

    this.container.style.margin = '8px'
    this.container.style.pointerEvents = 'auto'

    this.select.style.fontSize = '120%'
    this.select.style.padding = '8px'

    for (let i = 0; i < this.styles.length; i++) {
      const style = this.styles[i]
      const selected = (this.defaultStyle === style)
      this.select[i] = new Option(style, style, false, selected)
    }

    this.select.addEventListener('change', (event) => {
      this.currentStyle = event.target.value
      const style = this.styleUrl.replace('%s', event.target.value)
      this.map.setStyle(style)
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
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
