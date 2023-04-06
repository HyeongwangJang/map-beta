import { Snap, Draw, Modify } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';

import { Subject } from 'rxjs';

import { DRAW_TYPE, STYLES } from '../../constants';

/**
 * 드로우 툴 이벤트 타입
 * @typedef { Object } DrawToolEvent
 * @property { string } type
 * @property { VectorLayer<import('ol/source').Vector> } layer
 * @property { import('ol/interaction/Draw').DrawEvent } [drawEvent]
 * @property { import('ol/interaction/Modify').ModifyEvent } [modifyEvent]
 */

class DrawService {
  /**
   * @type { import('ol/interaction').Snap }
   * @private
   */
  _snap;

  /**
   * @type { import('ol/layer/Vector').default<import('ol/source/Vector').default> }
   * @private
   */
  _layer;

  /**
   * @type { Draw }
   * @private
   */
  _draw;

  /**
   * @type { import('ol/source').Vector<import('ol/geom').Geometry> }
   * @private
   */
  _modifySource;

  /**
   * @type { import('ol/interaction').Modify }
   * @private
   */
  _modify;

  /**
   * @type { import('ol/interaction').Select }
   * @private
   */
  _select;

  /**
   * @type { import('../../constants').DRAW_TYPE }
   * @private
   */
  _status;

  /**
   * @private
   */
  _listener = null;

  /**
   * @type { import('ol/style').Style[] }
   * @private
   */
  _completStyle = STYLES.drawComplete;

  /**
   * @type { MapService }
   * @private
   */
  _mapService;

  /**
   * @type { Subject<DrawToolEvent> }
   */
  drawToolEvent = new Subject();

  /**
   * @param { MapService } mapService
   */
  constructor(mapService) {
    this._mapService = mapService;
  }

  /**
   *
   * @param { VectorLayer<import('ol/source/Vector').default> } layer
   * @param { DRAW_TYPE } drawType
   */
  initDraw(layer, drawType) {
    /** @type { HTMLElement } */
    const target = this._mapService.map.getTargetElement();
    this._layer = layer;
    const source = this._layer.getSource();

    this.setDraw(drawType);

    this._snap = new Snap({
      source: source,
    });
    this._modifySource = new VectorSource({
      features: [],
      wrapX: false,
    });

    this._modify = new Modify({
      source: this._modifySource,
      hitDetection: this._layer,
    });

    source.on('addfeature', (e) => {
      this.onAddFeature('addfeature', e, this._layer);
    });

    this._modify.on(['modifystart', 'modifyend'], (e) => {
      target.style.cursor = e.type === 'modifystart' ? 'grabbing' : 'pointer';
      console.log(target.style.cursor);
      this.onModify(e.type, e, this._layer);
    });

    this._mapService.map.addInteraction(this._draw);
    this._mapService.map.addInteraction(this._modify);
    this._mapService.map.addInteraction(this._snap);
  }

  /**
   * 초기화
   */
  clearAll() {
    this.clearActiveAll();
    this.clearLayer();
    this.clearModifyLayer();
  }

  /**
   * 모든 그리기 도구 활성화 상태 해제
   */
  clearActiveAll() {
    this._draw.setActive(false);
    this._modify.setActive(false);
    this._snap.setActive(false);
    this._status = null;
  }

  /**
   * 레이어 초기화
   */
  clearLayer() {
    const source = this._layer.getSource();
    source.forEachFeature((feature) => {
      const overlay = feature.get('overlay');
      if (overlay) {
        this._mapService.map.removeOverlay(overlay);
        const $overLay = /** @type { HTMLElement } */ (
          document.querySelector(overlay.element)
        );
        $overLay.remove();
      }
    });
    source.clear();
  }

  /**
   * 수정 레이어 초기화
   */
  clearModifyLayer() {
    this._modifySource.clear();
  }

  /**
   * 그리기 도구 설정
   * @param { DRAW_TYPE } drawType
   */
  setDraw(drawType) {
    const source = this._layer.getSource();
    this._status = drawType;

    if (this._draw) {
      this._mapService.map.removeInteraction(this._draw);

      this._draw.un('drawstart', this.onDrawStart.bind(this));
      this._draw.un('drawend', this.onDrawEnd.bind(this));
    }

    switch (drawType) {
      case DRAW_TYPE.drawPolygon:
        this._draw = new Draw({
          source: source,
          type: 'Polygon',
          style: STYLES.drawPolygon(),
        });
        break;
      case DRAW_TYPE.drawPoint:
        this._draw = new Draw({
          source: source,
          type: 'Point',
          style: STYLES.drawPolygon(),
        });
        break;
      case DRAW_TYPE.drawLineString:
        this._draw = new Draw({
          source: source,
          type: 'LineString',
          style: STYLES.drawPolygon(),
        });
        break;
    }
    this._mapService.map.addInteraction(this._draw);

    this._draw.on('drawstart', this.onDrawStart.bind(this));
    this._draw.on('drawend', this.onDrawEnd.bind(this));
  }

  /**
   * 그리기 도구 활성화
   * @param { DRAW_TYPE } drwType
   */
  setActive(drwType) {
    this.clearActiveAll();
    this._status = drwType;

    switch (drwType) {
      case DRAW_TYPE.drawPolygon:
        this._draw.setActive(true);
        this._snap.setActive(true);
        break;
      case DRAW_TYPE.drawPoint:
        this._snap.setActive(true);
        this._draw.setActive(true);
        break;
      case DRAW_TYPE.drawLineString:
        this._snap.setActive(true);
        this._draw.setActive(true);
        break;
      case DRAW_TYPE.edit:
        this._modify.setActive(true);
        this._snap.setActive(true);
        break;
      case DRAW_TYPE.editLineString:
        this._snap.setActive(true);
        this._draw.setActive(true);
        break;
    }
  }

  /**
   * 도형 등록
   * @param { string } type
   * @param { DrawEvent } event
   * @param { VectorLayer<VectorSource> } layer
   */
  onAddFeature(type, event, layer) {
    const feature = event.feature;
    // const attr = feature.getProperties();

    //편집용 도형등록
    // const geom = feature.getGeometry();
    feature.setStyle(this._completStyle);
    feature.set('select', 'select');
    this.onDrawEvent(type, event, layer);
  }

  /**
   * 수정 중 이벤트
   * @param { string } type
   * @param { ModifyEvent } event
   * @param { VectorLayer<import('ol/source/Vector').default> } layer
   */
  onModify(type, event, layer) {
    this.onModifyEvent(type, event, layer);
  }

  /**
   * 그리기 시작
   * @param { import('ol/interaction/Draw').DrawEvent } event
   */
  onDrawStart(event) {
    this.onDrawEvent(event.type, event, this._layer);
  }

  /**
   * 그리기 완료
   * @param { import('ol/interaction/Draw').DrawEvent } event
   */
  onDrawEnd(event) {
    const source = this._layer.getSource();

    /** @type { ol.Feature<Geometry> } */
    const oldFeature = source.getFeatureById('new');
    if (oldFeature) {
      source.removeFeature(oldFeature);
    }

    if (!event.feature.getId()) {
      event.feature.setId('new');
    }
    this.onDrawEvent(event.type, event, this._layer);
  }

  /**
   *
   * @param { string } type
   * @param { import('ol/interaction/Draw').DrawEvent } event
   * @param { VectorLayer<import('ol/source/Vector').default> } layer
   */
  onDrawEvent(type, event, layer) {
    this.drawToolEvent.next({
      type: type,
      drawEvent: event,
      layer: layer,
    });
  }

  /**
   *
   * @param { string } type
   * @param { import('ol/interaction/Modify').ModifyEvent } event
   * @param { VectorLayer<import('ol/source/Vector').default> } layer
   */
  onModifyEvent(type, event, layer) {
    this.drawToolEvent.next({
      type: type,
      modifyEvent: event,
      layer: layer,
    });
  }
}

export default DrawService;
