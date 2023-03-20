import * as ol from 'ol'
import { getArea, getLength } from 'ol/sphere'
import { LineString, Polygon } from 'ol/geom'
import { Draw } from 'ol/interaction'
import { unByKey } from 'ol/Observable'

import { CONTROL } from '../constants'

import MapService from '../service/map.service'
import ControlService from '../service/control.service'

/**
 * @class
 * @constructor
 * @public
 */
class MeasurementControl extends HTMLElement {

  /**
   * @private
   * @type { Map }
   */
  map

  mapService
  /**
   * @private
   * @type { MapService }
   */

  /**
   * @private
   * @type { ControlService }
   */
  controlService

  /**
   * Currently drawn feature.
   * @type { ol.Feature }
   */
  sketch

  /**
   * The help tooltip element.
   * @type { HTMLElement }
   */
  helpTooltipElement

  /**
   * Overlay to show the help messages.
   * @type { ol.Overlay }
   */
  helpTooltip

  /**
   * The measure tooltip element.
   * @type { HTMLElement }
   */
  measureTooltipElement

  /**
   * Overlay to show the measurement.
   * @type { ol.Overlay }
   */
  measureTooltip

  /**
   * Message to show when the user is drawing a polygon.
   * @readonly
   */
  continuePolygonMsg = 'Click to continue drawing the polygon'

  /**
   * Message to show when the user is drawing a line.
   * @readonly
   */
  continueLineMsg = 'Click to continue drawing the line'

  /**
   * global so we can remove it later
   * @type { Draw }
   */
  draw 

  /**
   * @private
   */
  listener
  
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.map = document.querySelector('base-map').map
    this.mapService = new MapService(this.map)
    this.controlService = new ControlService(this.map)
  }

  connectedCallback() {
    this.render()
    this.addEventListner()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: flex; flex-direction: column; }
      </style>
      <button
        id='line-button'
        type='button'
        class='tool-button'
      >
        L
      </button>
      <button
        id='area-button'
        type='button'
        class='tool-button'
      >
        A
      </button>
    `
  }

  addEventListner() {
    const $line = this.shadowRoot.querySelector('button#line-button')
    const $area = this.shadowRoot.querySelector('button#area-button')
    $line.addEventListener('click', (e) => this.measurementHandler(e, 'distance'))
    $area.addEventListener('click', (e) => this.measurementHandler(e, 'area'))
  }

  /**
   * 
   * @param { Event } e 
   * @param { 'area' | 'distance'} tool 
   */
  measurementHandler(e, tool) {
    // toggle active
    e.target.classList.toggle('active')

    switch (tool) {
      case 'area':
        this.map.removeInteraction(this.draw)
        if (this.controlService.currentControl !== CONTROL.areaMeasurement) {
          this.addInteraction('Polygon')
          this.controlService.currentControl = CONTROL.areaMeasurement
        } else {
          this.controlService.currentControl = CONTROL.none
        }
        break
      case 'distance':
        this.map.removeInteraction(this.draw)
        if (this.controlService.currentControl !== CONTROL.distanceMeasurement) {
          this.addInteraction('LineString')
          this.controlService.currentControl = CONTROL.distanceMeasurement
        } else {
          this.controlService.currentControl = CONTROL.none
        }
      break
    }
  }
 
  /**
   * Format length output.
   * @param { LineString } line
   */
  formatLength(line) {
    const length = getLength(line)
    let output
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm'
    }
    return output
  }

  /**
   * Format area output.
   * @param { Polygon } polygon
   */
  formatArea(polygon) {
    const area = getArea(polygon)
    let output
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
    }
    return output
  }

  /**
   * 
   * @param { 'Polygon' | 'LineString' } type 
   */
  addInteraction(type) {
    const measurementLayer = this.mapService.getLayerById('measurement-layer')
    const source = (measurementLayer).getSource()

    this.draw = new Draw({
      source: source,
      type: type,
    })
    this.draw.set('id', type === 'Polygon' ? CONTROL.areaMeasurement : CONTROL.distanceMeasurement)
    this.controlService.addControl(this.draw)

    this.createMeasureTooltip()
    this.createHelpTooltip()

    this.addDrawListener()
  }

  addDrawListener() {
    this.draw.on('drawstart', (evt) => {
      // set sketch
      this.sketch = evt.feature

      /**  @type { import('ol/coordinate').Coordinate | undefined } */
      let tooltipCoord = evt.coordinate

      this.listener = this.sketch.getGeometry().on('change', (evt) => {
        const geom = evt.target
        let output
        if (geom instanceof Polygon) {
          output = this.formatArea(geom)
          tooltipCoord = geom.getInteriorPoint().getCoordinates()
        } else if (geom instanceof LineString) {
          output = this.formatLength(geom)
          tooltipCoord = geom.getLastCoordinate()
        }
        this.measureTooltipElement.innerHTML = output
        this.measureTooltip.setPosition(tooltipCoord)
      })
    })

    this.draw.on('drawend', () => {
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
      this.measureTooltip.setOffset([0, -7])
      // unset sketch
      this.sketch = null
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null
      this.createMeasureTooltip()
      unByKey(this.listener)
    })
  }

  /**
   * Creates a new help tooltip
   */
  createHelpTooltip() {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement)
    }
    this.helpTooltipElement = document.createElement('div')
    this.helpTooltipElement.className = 'ol-tooltip hidden'
    this.helpTooltip = new ol.Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    })
    this.map.addOverlay(this.helpTooltip)
  }

  /**
   * Creates a new measure tooltip
   */
  createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(
        this.measureTooltipElement
      )
    }
    this.measureTooltipElement = document.createElement('div')
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    this.measureTooltip = new ol.Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false,
    })
    this.map.addOverlay(this.measureTooltip)
  }

}

customElements.define('measurement-control', MeasurementControl)

export default MeasurementControl