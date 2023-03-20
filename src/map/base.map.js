import { Map, View } from 'ol'
import { FullScreen } from 'ol/control'
import { defaults } from 'ol/control/defaults'

class BaseMap extends HTMLElement {

  /**
   * @type { Map }
   */
  map

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
    this.createMap()
    this.createLayers()
  }

  get width() {
    return this.getAttribute('width')
  }

  get height() {
    return this.getAttribute('height')
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        #map {
          position: relative;
          width: ${this.width};
          height: ${this.height};
        }
      </style>
      <div id='map'>
        <slot></slot>
      </div>
    `
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/ol@v7.3.0/ol.css')
    this.shadowRoot.appendChild(link)
  }
  
  createMap() {
    const $map = this.shadowRoot.querySelector('#map')
    this.map = new Map({
      target: $map,
      controls: defaults({ rotate: false }).extend([new FullScreen()]),
      view: new View({
        center: [0, 0],
        zoom: 2,
      })
    })
  }

  /**
   * db에서 layer 목록 호출 & 생성 & 추가
   */
  createLayers() {
    
  }
  
}

customElements.define('base-map', BaseMap)

export default BaseMap

