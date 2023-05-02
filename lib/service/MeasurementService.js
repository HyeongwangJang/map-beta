import { Overlay } from 'ol';
import { LineString, Polygon } from 'ol/geom';
import { Group } from 'ol/layer';
import { unByKey } from 'ol/Observable';
import { getArea, getLength } from 'ol/sphere';
import AreaMeasurement from '../interaction/measurement/AreaMeasurement';
import DistanceMeasurement from '../interaction/measurement/DistanceMeasurement';

class MeasurementService {

  /**
   * @type {import('ol').Map}
   */
  _map

  _measurementLayer

  /**
   * Currently drawn feature.
   * @type {import('ol').Feature}
   */
  sketch;
  
  /**
   * The help tooltip element.
   * @type {HTMLElement}
   */
  helpTooltipElement;

  /**
   * Overlay to show the help messages.
   * @type {import('ol').Overlay}
   */
  helpTooltip;
  
  /**
   * The measure tooltip element.
   * @type {HTMLElement}
   */
  measureTooltipElement;

  /**
   * Overlay to show the measurement.
   * @type {import('ol').Overlay}
   */
  measureTooltip;

  /**
   * Message to show when the user is drawing a polygon.
   * @readonly
   */
  continuePolygonMsg = 'Click to continue drawing the polygon';

  /**
   * Message to show when the user is drawing a line.
   * @readonly
   */
  continueLineMsg = 'Click to continue drawing the line';

  /**
   * current measurement
   * @type { import('ol/interaction').Draw }
   */
  _draw;


  /**
   * @type {boolean}
   */
  _useHelpTooltip = false

  /**
   * @type {boolean}
   */
  _useMeasureTooltip = false

  /**
   * @private
   */
  _listener;

  /**
   * 
   * @param {import('ol').Map} map 
   * @param {boolean} useHelpTooltip 
   * @param {boolean} useMeasureTooltip 
   */
  constructor(map, useHelpTooltip, useMeasureTooltip) {
    this._map = map
    this._useHelpTooltip = useHelpTooltip;
    this._useMeasureTooltip = useMeasureTooltip;

    const measurementLayer = this._map.getLayers().forEach((layer) => {
      let result;

      if (layer.get('id') === 'measurement-layer') {
        result = layer;
      } else if (layer instanceof Group) {
        const childLayers = layer.getLayers();
        childLayers.forEach((childLayer) => {
          if (childLayer.get('id') === 'measurement-layer') {
            result = childLayer;
          }
        });
      }

      return result
    });

    this._measurementLayer = measurementLayer
  }

  /**
   * Creates a new help tooltip
   */
  createHelpTooltip() {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'ol-tooltip hidden';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    });
    this._map.addOverlay(this.helpTooltip);
  }

  /**
   * Creates a new measure tooltip
   */
  createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false,
    });
    this._map.addOverlay(this.measureTooltip);
  }

  /**
   * Handle pointer move.
   * @param {import"ol/MapBrowserEvent").default} evt The event.
   */
  pointerMoveHandler(evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    let helpMsg = 'Click to start drawing';
  
    if (this.sketch) {
      const geom = this.sketch.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = this.continuePolygonMsg;
      } else if (geom instanceof LineString) {
        helpMsg = this.continueLineMsg;
      }
    }
  
    this.helpTooltipElement.innerHTML = helpMsg;
    this.helpTooltip.setPosition(evt.coordinate);
  
    this.helpTooltipElement.classList.remove('hidden');
  };

  /**
   * Format length output.
   * @param {LineString} line The line.
   * @return {string} The formatted length.
   */
  formatLength(line) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
  };

  /**
   * Format area output.
   * @param {Polygon} polygon The polygon.
   * @return {string} Formatted area.
   */
  formatArea(polygon) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
  };

  /**
   * @param {'distance'|'area'} type 
   */
  addInteraction(type) {
    this._map.removeInteraction(this._draw);

    const source = this._measurementLayer.getSource();

    switch(type) {
      case 'distance':
        this._draw = new DistanceMeasurement({
          source: source
        })
      break;
        
      case 'area':
        this._draw = new AreaMeasurement({
          source: source,
        })
      break;
    }

    if(this._useHelpTooltip) { this.createHelpTooltip() };
    if(this._useMeasureTooltip) { this.createMeasureTooltip() };

    this._map.addInteraction(this._draw);

    this._draw.on('drawstart', (evt) => {
      // set sketch
      this.sketch = evt.feature;
  
      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      let tooltipCoord = evt.coordinate;
  
      this._listener = this.sketch.getGeometry().on('change', (evt) => {
        const geom = evt.target;
        let output;
        if (geom instanceof Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        this.measureTooltipElement.innerHTML = output;
        this.measureTooltip.setPosition(tooltipCoord);
      });
    });

    this._draw.on('drawend', () => {
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      this.measureTooltip.setOffset([0, -7]);
      // unset sketch
      this.sketch = null;
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null;
      this.createMeasureTooltip();
      unByKey(this._listener);
    });
  }

}

export default MeasurementService