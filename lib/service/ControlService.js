class ControlService {

  /**
   * @type { import('ol').Map }
   */
  map
  
  currentControl

  /**
   * 
   * @param { import('ol').Map } map 
   */
  constructor(map) {
    this.map = map
  }

  /**
   * 컨트롤 추가
   * @param { import('ol/interaction').Interaction } interaction
   */
  addControl(interaction) {
    this.map.addInteraction(interaction)
  }

  /**
   * @param { string } controlId
   */
  removeControl(controlId) {
    this.map.getInteractions().forEach(action => {
      if(action.get('id') === controlId) {
        this.map.removeInteraction(action)
      }
    })
  }
  
}

export default ControlService