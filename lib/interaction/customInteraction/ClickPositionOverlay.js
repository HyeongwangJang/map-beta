import { Overlay } from "ol";
import { toStringHDMS } from "ol/coordinate";
import PointerInteraction from "ol/interaction/Pointer";
import { toLonLat } from "ol/proj";

/**
 * A custom PointerInteraction that displays the clicked location's coordinates as an overlay on the map.
 */
class ClickPositionOverlay extends PointerInteraction {

  /**
   * @param {olx.interaction.PointerOptions=} opt_options Options.
   */
  constructor(opt_options) {
    super({
      handleDownEvent: handleDownEvent,
      handleMoveEvent: handleMoveEvent,
      handleUpEvent: handleUpEvent,
      ...opt_options
    });
  }

}

/**
 * 
 * @param {import("ol/MapBrowserEvent.js").default} e 
 * @returns {boolean}
 */
function handleDownEvent(e) {
  const coordinate = e.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));
  const element = document.createElement('div');
  element.className = 'click-position-overlay';
  element.innerHTML = hdms;
  this.overlay = new Overlay({
    element: element,
    positioning: 'bottom-center',
    offset: [0, -10],
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });
  this.getMap().addOverlay(this.overlay);
  this.overlay.setPosition(coordinate);

  return true;
}

/**
 * 
 * @param {import("ol/MapBrowserEvent.js").default} e 
 */
function handleMoveEvent(e) {
  if (this.overlay !== undefined) {
    const coordinate = e.coordinate;
    const hdms = toStringHDMS(toLonLat(coordinate));
    this.overlay.getElement().innerHTML = hdms;
    this.overlay.setPosition(coordinate);
  }
}

/**
 * 
 * @param {import("ol/MapBrowserEvent.js").default} e 
 */
function handleUpEvent(e) {
  if (this.overlay !== undefined) {
    this.getMap().removeOverlay(this.overlay);
    delete this.overlay;
  }

  return false;
}

export default ClickPositionOverlay