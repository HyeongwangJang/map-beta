import VectorLayer from 'ol/layer/Vector'

/**
 * @classdesc
 * Write class description...
 * 
 * @template {import('ol/source/Vector').default} VectorSourceType
 */
class BasicVectorLayer extends VectorLayer {

  /**
   * @param {import('ol/layer/BaseVector').Options<VectorSourceType>} [options] Options.
   */
  constructor(options) {
    const defaultOptions = {};

    options = {
      ...defaultOptions,
      ...options,
    }
    super(options)
  }
}

export default BasicVectorLayer