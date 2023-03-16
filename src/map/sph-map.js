import { Map, View } from 'ol'
import { FullScreen } from 'ol/control'
import { defaults } from 'ol/control/defaults'

import ControlService from '../service/ControlService'
import MapService from '../service/MapService'

class SphMap extends HTMLElement {

  /**
   * @type { Map }
   */
  map

  /**
   * @type { MapService }
   */
  mapService

  /**
   * @type { ControlService }
   */
  controlService

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
    this.createMap()

    this.mapService = new MapService(this.map)
    this.controlService = new ControlService(this.map)
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
  
}

customElements.define('sph-map', SphMap)

export default SphMap

