import VLayer from 'ol/layer/Vector';
import { Vector } from 'ol/source';

import { STYLES } from '../../constants';

/**
 * @deprecated
 * @class
 */
class VectorLayer extends HTMLElement {
  layerStyle = STYLES.layer.vector

  /**
   * @type { import('ol/layer').Vector }
   * @private
   */
  _layer;

  /**
   * @type { import('ol').Map }
   * @private
   */
  _map;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._map = /** @type { import('../map/BaseMap').default } */ (
      document.querySelector('base-map')
    ).map;
  }

  connectedCallback() {
    this.render();
    this.addLayer();
  }

  get id() {
    return this.getAttribute('id');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div style='display: none;'></div>
    `;
  }

  addLayer() {
    this._layer = new VLayer({
      source: new Vector({
        features: [],
        wrapX: false,
      }),
      style: this.layerStyle,
    });
    this._layer.set('id', this.id);

    this._map.addLayer(this._layer);
  }
}

customElements.define('vector-layer', VectorLayer);

export default VectorLayer;
