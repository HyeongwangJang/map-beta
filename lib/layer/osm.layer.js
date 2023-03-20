import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM.js'

class OsmLayer extends HTMLElement {

  /**
   * @type { Map }
   * @private
   */
  map

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.map = document.querySelector('base-map').map
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div style='display: none;'></div>
    `

    const osmLayer = new TileLayer({
      source: new OSM()
    })
    osmLayer.set('id', 'osm')
    this.map.addLayer(osmLayer)

    this.map.getLayers().forEach((layer) => {
      if(layer.get('id') === 'osm') {
      }
    })
  }

}

customElements.define('osm-layer', OsmLayer)

export default OsmLayer