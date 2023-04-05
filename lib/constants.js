import { Circle } from "ol/geom";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

/**
 * 고정 레이어명 목록
 * @readonly
 * @enum { string }
 */
export const LAYER = {
  measurement: 'measurement-layer'
}

/**
 * 고정 컨트롤명 목록
 * @readonly
 * @enum { string }
 */
export const CONTROL = {
  none: 'none',
  distanceMeasurement: 'distance-measurement',
  areaMeasurement: 'area-measurement',
}

/**
 * @readonly
 * @enum { string }
 */
export const DRAW_TYPE = {
  draw: 'draw',
  drawPolygon: 'draw-polygon',
  drawLineString: 'draw-line-string',
  drawPoint: 'draw-point',

  edit: 'edit',
  editPolygon: 'edit-polygon',
  editLineString: 'edit-line-string',
  editPoint: 'edit-point',
}

export const STYLES = {

  layer: {
    vector: () => {
      return [
        new Style({
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.8)',
            width: 6,
          }),
        }),
        new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: 'rgba(197, 150, 25, 0.8)',
            width: 2,
          }),
        }),
      ]
    }
  },

  /**
   * 그리기 중, 폴리곤 스타일
   */
  drawPolygon: () => {
    return [
      new Style({
        stroke: new Stroke({
          color: 'rgba(255, 255, 255, 0.8)',
          lineDash: [10, 10],
          width: 4
        })
      }),
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 0.8)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new Circle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(241, 168, 31, 0.7)'
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    ];
  },

  /**
   * 그리기 완료된 피쳐 스타일
   */
  drawComplete: () => {
    return [
      new Style({
        stroke: new Stroke({
          color: 'rgba(255, 255, 255, 0.8)',
          width: 6
        })
      }),
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 0.8)',
          width: 2
        })
      }),
      new Style({
        image: new Circle({
          radius: 7,
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.8)'
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.8)'
          })
        })
      })
    ]
  }
}