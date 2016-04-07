'use strict';
import Module from 'module-js';
import _ from 'lodash';

/**
 * Builds the modal element and its content
 * @param content
 * @returns {HTMLElement} Returns the DOM element
 */
let setupEl = function (content) {
    if (typeof content === 'string') {
        // html!
        var tempParentEl,
            el;
        content = content.trim(content);
        tempParentEl = document.createElement('div');
        tempParentEl.innerHTML = content;
        el = tempParentEl.childNodes[0];
        content = tempParentEl.removeChild(el);
    }
    return content;
};

/**
 * Modal.
 * @class Modal
 * @param options
 * @param {HTMLElement} options.containerEl - The element that should be used as the modal's container
 * @param {HTMLElement|string} options.el - The element (or html string) that contains the modal content which gets nested inside the modal container
 * @param {Function} [options.onHide] - A function that gets fired when the modal hides.
 * @param {Function} [options.onShow] - A function that gets fired when the modal shows.
 * @param {Function} [options.onClickOutside] - When tapping outside of the modal
 * @param {string} [options.activeClass] - The CSS class that gets added to each modal when shown
 * @param {string} [options.containerActiveClass] - The CSS class that gets added to the modal container when there is at least one modal showing
 */
class Modal extends Module {

    /**
     * Sets up the modal.
     * @param {object} options - The options
     */
    constructor (options) {

        options = _.extend({
            containerEl: document.getElementsByTagName('body')[0],
            el: null,
            onHide: null,
            onShow: null,
            onClickOutside: null,
            activeClass: 'modal-active',
            containerActiveClass: 'modal-container-active'
        }, options);

        options.el = setupEl(options.el);

        super(options.el, options);

        options.onClickOutside = options.onClickOutside || this.hide.bind(this);

        this.el = options.el;
        this.options = options;
        this.container = options.containerEl;

        this._origModalElParent = this.el.parentNode || document.createDocumentFragment();

        if (!this.container.contains(this.el)) {
            this.container.appendChild(this.el);
        }

    }

    /**
     * Sets stuff up.
     * @memberOf Modal
     */
    setup () {}

    /**
     * Shows the modal.
     * @memberOf Modal
     */
    show () {
        this.setup();
        this.el.classList.add(this.options.activeClass);
        this.container.classList.add(this.options.containerActiveClass);
        this._onDocClickEventListener = this._onDocClick.bind(this);
        document.addEventListener('click', this._onDocClickEventListener, true);
        if (this.options.onShow) {
            this.options.onShow();
        }
        return super.show();
    }

    /**
     * Hides the modal.
     * @memberOf Modal
     */
    hide () {
        this.el.classList.remove(this.options.activeClass);
        document.removeEventListener('click', this._onDocClick.bind(this), true);

        if (this.options.onHide) {
            this.options.onHide();
        }
        return super.hide().then(() => {
            // do not remove container's active class if other active modals exist
            if (!this.container.getElementsByClassName(this.options.activeClass).length) {
                this.container.classList.remove(this.options.containerActiveClass);
            }
        });
    }

    /**
     * Whether the modal is showing.
     * @returns {boolean} Returns truthy if showing, falsy if not
     * @memberOf Modal
     */
    isActive () {
        return this.active;
    }

    /**
     * When the document window is clicked.
     * @param {Event} e - The event
     * @memberOf Modal
     * @private
     */
    _onDocClick (e) {
        var clickedItem = e.target,
            isClickOutside = !this.el.contains(clickedItem);
        if (isClickOutside && this.isActive()) {
            if (this.options.onClickOutside) {
                this.options.onClickOutside();
            }
        }
    }

    /**
     * Destroys the modal.
     * @memberOf Modal
     */
    destroy () {
        this.el.classList.remove(this.options.activeClass);
        if (this.container.contains(this.el)) {
            this._origModalElParent.appendChild(this.el);
        }
        if (!this.container.getElementsByClassName(this.options.activeClass).length) {
            this.container.classList.remove(this.options.containerActiveClass);
        }
        document.removeEventListener('click', this._onDocClickEventListener, true);
        super.destroy();
    }

}

module.exports = Modal;
