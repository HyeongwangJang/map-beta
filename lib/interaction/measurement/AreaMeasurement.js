import { Draw } from "ol/interaction";

/**
 * @classdesc
 * AreaMeasurement description...
 */
class AreaMeasurement extends Draw {

  /**
   * 
   * @param {import('ol/interaction/Draw').Options} [options] 
   */
  constructor(options) {    
    super({
      type: 'Polygon',
      ...options,
    })
  }

}

export default AreaMeasurement