class ControlService {

  /**
   * @type { import('ol').Map }
   */
  _map
  
  /**
   * @type { import('ol/interaction').Interaction }
   */
  currentControl

  /**
   * 
   * @param { import('ol').Map } map 
   */
  constructor(map) {
    this._map = map
  }

  /**
   * 컨트롤 추가
   * @param { import('ol/interaction').Interaction } interaction
   */
  addControl(interaction) {
    this._map.addInteraction(interaction)
  }

  /**
   * @param { string } controlId
   */
  removeControl(controlId) {
    this._map.getInteractions().forEach(action => {
      if(action.get('id') === controlId) {
        this._map.removeInteraction(action)
      }
    })
  }
  
}

export default ControlService