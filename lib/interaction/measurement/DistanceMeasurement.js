import { Draw } from 'ol/interaction'

/**
 * @classdesc
 * DistanceMeasurement description...
 */
class DistanceMeasurement extends Draw {

  /**
   * 
   * @param {import('ol/interaction/Draw').Options} [options] 
   */
  constructor(options) {    
    super({
      type: 'LineString',
      ...options,
    })
  }
  
}

export default DistanceMeasurement