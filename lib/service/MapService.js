import { Group } from 'ol/layer';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';

/**
 * @class L
 * @augments import('ol/layer/Base').default
 */

/**
 * @classdesc
 * Map Service
 * 맵 공통 기능
 */
class MapService {
  /**
   * @type { import('ol').Map }
   */
  map;

  /**
   * @param { import('ol').Map } map
   */
  constructor(map) {
    this.map = map;
  }

  /**
   * vector layer 생성 후 map에 추가
   * @param {import("ol/layer/BaseVector").Options<import("ol/source/Vector.js").default>} opts 벡터 레이어 생성 옵션
   * @param {string} layerId 레이어 아이디
   * @param {boolean} add map에 레이어 추가할지 여부
   */
  createVectorLayer(opts, layerId, add) {
    const layer = new VectorLayer(opts);
    layer.set('id', layerId);

    if (!add) return;
    this.map.addLayer(layer);
  }

  /**
   * vector tile layer 생성 후 map에 추가
   * @param {import('ol/layer/BaseVector').Options<import("ol/source/VectorTile.js").default>} opts
   * @param {string} layerId
   * @param {boolean} add map에 레이어 추가할지 여부
   */
  createVectorTileLayer(opts, layerId, add) {
    const layer = new VectorTileLayer(opts);
    layer.set('id', layerId);

    if (!add) return;
    this.map.addLayer(layer);
  }

  /**
   * layer id 로 layer 검색
   * @template L
   * @param {string} layerId
   * @returns {L | undefined}
   */

  
  
  /**
   * Returns the layer with the specified ID from the OpenLayers map.
   *
   * @template {import("ol/layer/Base").default} L
   * @param {string} layerId - The ID of the layer to find.
   * @return {L | undefined} The layer with the specified ID, or undefined if not found.
   */
  getLayerById(layerId) {
    /** @type { L | undefined } */
    let result;

    this.map.getLayers().forEach((layer) => {
      if (layer.get('id') === layerId) {
        result = layer;
      } else if (layer instanceof Group) {
        const childLayers = layer.getLayers();
        childLayers.forEach((childLayer) => {
          if (childLayer.get('id') === layerId) {
            result = childLayer;
          }
        });
      }
    });

    return result;
  }

  /**
   * layer id & feature id로 feature 검색
   * @param {string} layerId
   * @param {string} featureId
   * @return {import('ol').Feature}
   */
  getFeatureById(layerId, featureId) {
    const layer = this.getLayerById(layerId);
    return layer.getSource().getFeatureById(featureId);
  }

  /**
   * 레이어 아이디로 레이어 삭제
   * @param {string} layerId
   */
  deleteLayerById(layerId) {
    console.log('delete layer', layerId)
  }
}

export default MapService;
