import { Map } from "ol"
import VLayer from "ol/layer/Vector"
import { Vector } from "ol/source"
import Fill from "ol/style/Fill"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"

/**
 * @class
 */
class VectorLayer extends HTMLElement {

  layerStyle = [
    new Style({
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.8)',
        width: 6,
      }),
    }),
    new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: 'rgba(197, 150, 25, 0.8)',
        width: 2,
      }),
    }),
  ]

  layer

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
    this.addLayer()
  }

  get id() {
    return this.getAttribute('id')
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div style='display: none;'></div>
    `
  }

  addLayer() {
    this.layer = new VLayer({
      source: new Vector({
        features: [],
        wrapX: false,
      }),
      style: this.layerStyle
    })
    this.layer.set('id', this.id)

    this.map.addLayer(this.layer)
  }
  
}

customElements.define('vector-layer', VectorLayer)

export default VectorLayer