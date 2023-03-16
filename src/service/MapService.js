import { Map } from "ol"
import { Group } from "ol/layer"
import BaseLayer from "ol/layer/Base"

class MapService {

  /**
   * @type { Map }
   */
  map
  
  /**
   * 
   * @param { Map } map 
   */
  constructor(map) {
    this.map = map
  }

  /**
   * 
   * @param { string } layerId 
   * @returns 
   */
  getLayerById(layerId) {

    /**
     * @type { BaseLayer }
     */
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
  
}

export default MapService