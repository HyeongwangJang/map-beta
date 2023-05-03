import { Group } from 'ol/layer';
import { unByKey } from 'ol/Observable';
import ClickPositionOverlay from '../interaction/customInteraction/ClickPositionOverlay';
import DistanceMeasurement from '../interaction/measurement/DistanceMeasurement';
import DefaultPopup from '../popup/DefaultPopup';
import MeasurementService from './MeasurementService';

/**
 * @classdesc
 * Interaction Service...
 * 
 * 인터랙션 서비스이지만 임시로 만든 거라
 * 인터랙션과 리스너가 혼용되어있음.
 * 
 * 참고
 * 특정 인터랙션 로직을 작성해놓고
 * 사용하는 곳에서는 엘리먼트 이벤트 리스너에 아래의 메서드들을 각각 추가만 하면 되도록 하는 것이 현재 계획.
 * 
 * 문제점 | 생각해볼 점
 * example: example/InteractionService.html
 * 위 예제에서 라디오 버튼 셋이 있을 때
 * 현재 활성화된 인터랙션이나 리스너의 싱크를 어떻게 중앙 관리할 것인가?
 * 
 */
class InteractionService {

  _map
  
  currentInteraction;

  /**
   * @type {string}
   * @private
   */
  _listenerKey;

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

  panningHandler() {
    this._initInteractionOrListener()
  }

  distanceMeasurementHandler() {
    this._initInteractionOrListener()
    
    const measurementService = new MeasurementService(this._map, true, true);
    const interaction = measurementService.createInteraction('distance');
    this.currentInteraction = interaction
    measurementService.addInteraction(interaction)
  }
  
  popupModeHandler() {
    this._initInteractionOrListener()
    
    const interaction = new ClickPositionOverlay();

    this.currentInteraction = interaction;
    this._map.addInteraction(this.currentInteraction);
  }

  __() {
    this._initInteractionOrListener()

    var popup = new DefaultPopup();
    this._map.addOverlay(popup);

    this._listenerKey = this._map.on('click', (e) => {
      // var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
      var prettyCoord = '[1, 2, 3, 4]'
      popup.show(e.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
    });
  }

  _initInteractionOrListener() {
    // init listener
    unByKey(this._listenerKey)
    // init interaction
    this._map.removeInteraction(this.currentInteraction);
  }
}

export default InteractionService