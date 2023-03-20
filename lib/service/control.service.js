import { Map } from "ol"
import { Interaction } from "ol/interaction"

class ControlService {

  /**
   * @type { Map }
   */
  map
  
  currentControl

  /**
   * 
   * @param { Map } map 
   */
  constructor(map) {
    this.map = map
  }

  /**
   * 컨트롤 추가
   * @param { Interaction } interaction
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