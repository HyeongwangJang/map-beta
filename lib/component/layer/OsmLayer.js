import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM.js';

/**
 * @deprecated
 */
class OsmLayer extends HTMLElement {
  /**
   * @type { import('ol').Map }
   * @private
   */
  _map;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._map = document.querySelector('base-map').map;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div style='display: none;'></div>
    `;

    const osmLayer = new TileLayer({
      source: new OSM(),
    });
    osmLayer.set('id', 'osm');
    this._map.addLayer(osmLayer);
  }
}

customElements.define('osm-layer', OsmLayer);

export default OsmLayer;
