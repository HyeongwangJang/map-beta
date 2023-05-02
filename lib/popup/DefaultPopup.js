import Overlay from 'ol/Overlay';

/**
 * OpenLayers Popup Overlay.
 */
class DefaultPopup extends Overlay {

  /**
   * 
   * @param {import('ol/Overlay').Options} [opt_options] Options
   */
  constructor(opt_options) {

    var options = opt_options || {};

    if (options.autoPan === undefined) {
      options.autoPan = true;
    }

    if (options.autoPanAnimation === undefined) {
      options.autoPanAnimation = {
        duration: 250
      };
    }

    var element = document.createElement('div');

    options.element = element;
    super(options);

    this.container = element;
    this.container.className = 'ol-popup';

    this.closer = document.createElement('a');
    this.closer.className = 'ol-popup-closer';
    this.closer.href = '#';
    this.container.appendChild(this.closer);

    this.closer.addEventListener('click', (evt) => {
      this.container.style.display = 'none';
      this.closer.blur();
      evt.preventDefault();
    }, false);

    this.content = document.createElement('div');
    this.content.className = 'ol-popup-content';
    this.container.appendChild(this.content);

    // Apply workaround to enable scrolling of content div on touch devices
    DefaultPopup.enableTouchScroll_(this.content);

  }

  /**
  * Show the popup.
  * @param {import('ol/coordinate').Coordinate} coord Where to anchor the popup.
  * @param {string | HTMLElement} html String or element of HTML to display within the popup.
  * @returns {DefaultPopup} The Popup instance
  */
  show(coord, html) {
    if (html instanceof HTMLElement) {
      this.content.innerHTML = "";
      this.content.appendChild(html);
    } else {
      this.content.innerHTML = html;
    }
    this.container.style.display = 'block';
    this.content.scrollTop = 0;
    this.setPosition(coord);
    return this;
  }

  /**
  * @private
  * @desc Determine if the current browser supports touch events. Adapted from
  * https://gist.github.com/chrismbarr/4107472
  */
  static isTouchDevice_() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
  * @private
  * @desc Apply workaround to enable scrolling of overflowing content within an
  * element. Adapted from https://gist.github.com/chrismbarr/4107472
  * @param {HTMLElement} elm
  */
  static enableTouchScroll_(elm) {
    if (DefaultPopup.isTouchDevice_()) {
      var scrollStartPos = 0;
      elm.addEventListener("touchstart", function (event) {
        scrollStartPos = this.scrollTop + event.touches[0].pageY;
      }, false);
      elm.addEventListener("touchmove", function (event) {
        this.scrollTop = scrollStartPos - event.touches[0].pageY;
      }, false);
    }
  }

  /**
  * Hide the popup.
  * @returns {DefaultPopup} The Popup instance
  */
  hide() {
    this.container.style.display = 'none';
    return this;
  }


  /**
  * Indicates if the popup is in open state
  * @returns {boolean} Whether the popup instance is open
  */
  isOpened() {
    return this.container.style.display == 'block';
  }

}

// Expose Popup as ol.Overlay.Popup if using a full build of
// OpenLayers
// if (window.ol && window.ol.Overlay) {
//   window.ol.Overlay.Popup = DefaultPopup;
// }

export default DefaultPopup;