import VectorTileLayer from "ol/layer/VectorTile";

/**
 * @classdesc
 * Write class description...
 */
class BasicVectorTileLayer extends VectorTileLayer {

  /**
   * @param {import('ol/layer/VectorTile').Options} [options] Options 
   */
  constructor(options) {
    const defaultOptions = {}

    options = {
      ...defaultOptions,
      ...options,
    }
    
    super(options)
  }
  
}

export default BasicVectorTileLayer