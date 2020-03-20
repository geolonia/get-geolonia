export default class stylesControl {
  constructor() {
    this.styles = [
      'geolonia/basic',
      'geolonia/midnight',
      'geolonia/red-planet',
      'geolonia/notebook',
    ]

    this.styleUrl = 'https://raw.githubusercontent.com/%s/master/style.json'
  }

  onAdd(map) {
    this.map = map
    this.container = document.createElement('div')
    const select = document.createElement('select')
    this.container.appendChild(select)

    this.container.style.margin = '8px'
    this.container.style.pointerEvents = 'auto'

    select.style.fontSize = '120%'
    select.style.padding = '8px'

    for (let i = 0; i < this.styles.length; i++) {
      const style = this.styles[i]
      select[i] = new Option(style, style)
    }

    select.addEventListener('change', (event) => {
      this.currentStyle = event.target.value
      const style = this.styleUrl.replace('%s', event.target.value)
      this.map.setStyle(style)
    })

    return this.container
  }

  getStyle() {
    if (this.currentStyle) {
      return this.currentStyle
    } else {
      return this.styles[0]
    }
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
