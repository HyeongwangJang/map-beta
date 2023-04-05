import { Group } from "ol/layer"
import VectorLayer from "ol/layer/Vector"
import VectorTileLayer from 'ol/layer/VectorTile'

/**
 * @classdesc
 * Map Service
 * 맵 공통 기능
 * 
 * @template { import("ol/source/Vector.js").default | import("ol/source/VectorTile.js").default } VectorSourceType
 */
class MapService {

  /**
   * @type { import('ol').Map }
   */
  map
  
  /**
   * @param { import('ol').Map } map 
   */
  constructor(map) {
    this.map = map
  }

  /**
   * vector layer 생성 후 map에 추가
   * @param { import("ol/layer/BaseVector").Options<VectorSourceType> } opts 벡터 레이어 생성 옵션
   * @param { string } layerId 레이어 아이디
   */
  createVectorLayer(opts, layerId) {
    const layer = new VectorLayer(opts)
    layer.set('id', layerId)

    this.map.addLayer(layer)
  }

  /**
   * vector tile layer 생성 후 map에 추가
   * @param { import('ol/layer/BaseVector').Options<VectorSourceType> } opts 
   * @param { string } layerId 
   */
  createVectorTileLayer(opts, layerId) {
    const layer = new VectorTileLayer(opts)
    layer.set('id', layerId)

    this.map.addLayer(layer)
  }

  /**
   * layer id 로 layer 검색
   * @param { string } layerId 
   * @returns { * }
   */
  getLayerById(layerId) {
    let result

    this.map.getLayers().forEach((layer) => {
      if (layer.get('id') === layerId) {
        result = layer
      } else if (layer instanceof Group) {
        const childLayers = layer.getLayers()
        childLayers.forEach((childLayer) => {
          if (childLayer.get('id') === layerId) {
            result = childLayer
          }
        })
      }
    })

    return result
  }

  /**
   * layer id & feature id로 feature 검색
   * @param { string } layerId 
   * @param { string } featureId 
   * @return { import('ol').Feature }
   */
  getFeatureById(layerId, featureId) {
    const layer = this.getLayerById(layerId)
    return layer.getSource().getFeatureById(featureId)
  }
  
}

export default MapService