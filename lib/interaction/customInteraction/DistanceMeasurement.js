import { Overlay } from "ol";
import PointerInteraction from "ol/interaction/Pointer";
import { getLength } from "ol/sphere";

class DistanceMeasurement extends PointerInteraction {
  /**
   * @param {import("ol/Map").default} map 지도 객체
   */
  constructor(map) {
    super({
      handleDownEvent: handleDownEvent,
      handleMoveEvent: handleMoveEvent,
      handleUpEvent: handleUpEvent,
    });

    const source = map.getLayerById("measurement-layer").getSource();

    /**
     * @param {import("ol/MapBrowserEvent").default} evt
     * @return {boolean} `false`를 반환하면 PointerInteraction이 계속 진행됩니다.
     */
    function handleDownEvent(evt) {
      evt.preventDefault();
      return true;
    }

    let sketch;
    let helpTooltipElement;
    let helpTooltip;
    let measureTooltipElement;
    let measureTooltip;

    /**
     * @param {import("ol/MapBrowserEvent").default} evt
     */
    function handleMoveEvent(evt) {
      if (!sketch) {
        return;
      }
      const output = formatLength(getLength(sketch.getGeometry()), "m");
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(evt.coordinate);
    }

    /**
     * @param {import("ol/MapBrowserEvent").default} evt
     */
    function handleUpEvent(evt) {
      const coordinates = sketch.getGeometry().getCoordinates();
      const geom = sketch.getGeometry();
      const output = formatLength(getLength(geom), "m");

      if (geom.getType() === "LineString") {
        source.addFeature(sketch);
      }
      measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      measureTooltip.setOffset([0, -7]);
      sketch = null;
      measureTooltipElement = null;
      createMeasureTooltip();

      return false;
    }

    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip() {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
      helpTooltipElement = document.createElement("div");
      helpTooltipElement.className = "ol-tooltip hidden";
      helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
      });
      map.addOverlay(helpTooltip);
    }

    /**
     * Creates a new measure tooltip
     */
    function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement("div");
      measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
      measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
      });
      map.addOverlay(measureTooltip);
    }

    /**
     * Format length output.
     * @param {number} length The length in meters.
     * @param {string} unit The unit system to use. Default is 'metric'.
     *   Use 'imperial' for miles.
     * @return {string} The formatted length.
     */
    function formatLength(line) {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
      }
      return output;
    }
  }
}