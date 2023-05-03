import ClickPositionOverlay from '../interaction/ClickPositionOverlay';
import DefaultPopup from '../popup/DefaultPopup';
import MeasurementService from './MeasurementService';

/**
 * @classdesc
 * Interaction Service...
 * 
 * 참고
 * 특정 인터랙션 로직을 작성해놓고
 * 사용하는 곳에서는 엘리먼트 이벤트 리스너에 아래의 메서드들을 각각 추가만 하면 되도록 하는 것이 현재 계획.
 * 
 * example: example/InteractionService.html
 * 
 */
class InteractionService {

  /**
   * @type {import('ol').Map}
   * @private
   */
  _map
  
  /**
   * @type {import('ol/interaction').Interaction}
   * @private
   */
  _currentInteraction;

  /**
   * 
   * @param {import('ol').Map} [map] 
   */
  constructor(map) {
    this._map = map
  }
  
  firstHandler() {
  }

  secondHandler() {
  }
  
  thirdHandler() {
  }

  panningHandler() {
    this._initInteraction()
  }

  distanceMeasurementHandler() {
    this._initInteraction()
    
    const measurementService = new MeasurementService(this._map, true, true);
    const interaction = measurementService.createInteraction('distance');
    this._currentInteraction = interaction
    measurementService.addInteraction(interaction)
  }
  
  positionOverlayHandler() {
    this._initInteraction()
    
    const interaction = new ClickPositionOverlay();

    this._currentInteraction = interaction;
    this._map.addInteraction(this._currentInteraction);
  }

  /**
   * @deprecated
   */
  __() {
    this._initInteraction()

    var popup = new DefaultPopup();
    this._map.addOverlay(popup);

    this._listenerKey = this._map.on('click', (e) => {
      // var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
      var prettyCoord = '[1, 2, 3, 4]'
      popup.show(e.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
    });
  }

  /**
   * 다른 인터랙션 추가하기 전 반드시 실행
   * 기존의 사용중인 인터랙션 제거
   * @private
   */
  _initInteraction() {
    this._map.removeInteraction(this._currentInteraction);
  }
}

export default InteractionService