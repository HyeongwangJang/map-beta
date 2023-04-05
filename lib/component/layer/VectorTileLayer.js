import { VectorTile as VTLayer } from 'ol/layer'
import { VectorTile as VT } from 'ol/source'
import MVT from 'ol/format/MVT'
import { createXYZ } from 'ol/tilegrid'

/**
 * @deprecated
 */
class VectorTileLayer extends HTMLElement {

  /**
   * @type { import('ol').Map }
   * @private
   */
  _map

  /**
   * @type { import('ol/layer').VectorTile }
   * @private
   */
  _layer
  
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._map = /** @type { import('../map/BaseMap').default } */ (document.querySelector('base-map')).map
  }

  connectedCallback() {
    this.render()
    this.addLayer()
  }

  get id() {
    return this.getAttribute('id')
  }

  get url() {
    return this.getAttribute('url')
  }

  get info() {
    return this.getAttribute('info')
  }

  get proj() {
    return this.getAttribute('proj') || '900913'
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div style='display: none;'></div>
    `
  }

  addLayer() {
    this._layer = new VTLayer({
      source: new VT({
        tileGrid: createXYZ(),
        format: new MVT(),
        url:
          this.url + '/geoserver/gwc/service/tms/1.0.0/'
          + this.info + '@EPSG%3A' + this.proj + '@pbf/{z}/{x}/{-y}.pbf'
      })
    })
    this._layer.set('id', this.id)

    this._map.addLayer(this._layer)
  }
  
}

customElements.define('vector-tile-layer', VectorTileLayer)

export default VectorTileLayer