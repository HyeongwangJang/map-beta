import { Feature, Map } from "ol"
import { Group } from "ol/layer"
import BaseLayer from "ol/layer/Base"
import VectorLayer from "ol/layer/Vector"
import VectorTileLayer from 'ol/layer/VectorTile'

class MapService {

  /**
   * @type { Map }
   * @private
   */
  _map
  
  /**
   * @param { Map } map 
   */
  constructor(map) {
    this._map = map
  }

  /**
   * vector layer 생성 후 map에 추가
   * @param { import("ol/layer/BaseVector").Options<VectorSourceType> } opts 벡터 레이어 생성 옵션
   * @param { string } layerId 레이어 아이디
   */
  createVectorLayer(opts, layerId) {
    const layer = new VectorLayer(opts)
    layer.set('id', layerId)

    this._map.addLayer(layer)
  }

  /**
   * vector tile layer 생성 후 map에 추가
   * @param { import('ol/layer/BaseVector').Options<VectorSourceType> } opts 
   * @param { string } layerId 
   */
  createVectorTileLayer(opts, layerId) {
    const layer = new VectorTileLayer(opts)
    layer.set('id', layerId)

    this._map.addLayer(layer)
  }

  /**
   * layer id 로 layer 검색
   * @param { string } layerId 
   * @returns { BaseLayer }
   */
  getLayerById(layerId) {
    let result

    this._map.getLayers().forEach((layer) => {
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
   * @return { Feature }
   */
  getFeatureById(layerId, featureId) {
    const layer = this.getLayerById(layerId)
    return layer.getSource().getFeatureById(featureId)
  }
  
}

export default MapService