/**
 * @classdesc
 * Interaction Service desc...
 * 
 * example: example/InteractionService.html
 */
class InteractionService {

  _map
  
  currentInteraction;

  /**
   * 
   * @param {import('ol').Map} [map] 
   */
  constructor(map) {
    this._map = map
  }
  
  firstHandler() {
    console.log('기존::', this.currentInteraction);
    console.log('Clicked::', 'First');
    this.currentInteraction = 'First'
    console.log('New::', this.currentInteraction);
  }

  secondHandler() {
    console.log('기존::', this.currentInteraction);
    console.log('Clicked::', 'Second');
    this.currentInteraction = 'Second'
    console.log('New::', this.currentInteraction);
  }
  
  thirdHandler() {
    console.log('기존::', this.currentInteraction);
    console.log('Clicked::', 'Third');
    this.currentInteraction = 'Third'
    console.log('New::', this.currentInteraction);
  }
  
}

export default InteractionService