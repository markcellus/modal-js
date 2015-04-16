'use strict';
var ElementKit = require('element-kit');
var utils = ElementKit.utils;
var Module = require('module.js');

/**
 * Modal.
 * @constructor Modal
 * @param options
 * @param {HTMLElement} options.containerEl - The element that should be used as the modal's container
 * @param {HTMLElement} options.el - The element that contains the modal content which gets nested inside the modal container
 * @param {Function} [options.onHide] - A function that gets fired when the modal hides.
 * @param {Function} [options.onShow] - A function that gets fired when the modal shows.
 * @param {Function} [options.onClickOutside] - When tapping outside of the modal
 * @param {string} [options.activeClass] - The CSS class that gets added to each modal when shown
 * @param {string} [options.containerActiveClass] - The CSS class that gets added to the modal container when there is at least one modal showing
 */
var Modal = Module.extend({

    /**
     * Sets up the modal.
     * @param {object} options - The options
     */
    initialize: function (options) {

        this.options = utils.extend({
            containerEl: document.getElementsByTagName('body')[0],
            el: null,
            onHide: null,
            onShow: null,
            onClickOutside: this.hide.bind(this),
            activeClass: 'modal-active',
            containerActiveClass: 'modal-container-active'
        }, options);

        this.container = this.options.containerEl;
        this.content = this.options.el;

        this._origModalElParent = this.content.parentNode || document.createDocumentFragment();


        Module.prototype.initialize.call(this, this.options);
    },

    /**
     * Sets stuff up.
     * @memberOf Modal
     */
    setup: function () {
        if (!this.container.contains(this.content)) {
            this.container.appendChild(this.content);
        }
    },

    /**
     * Shows the modal.
     * @memberOf Modal
     */
    show: function () {
        this.setup();
        this.content.kit.classList.add(this.options.activeClass);
        document.addEventListener('click', this._onDocClick.bind(this), true);
        this.container.kit.classList.add(this.options.containerActiveClass);
        if (this.options.onShow) {
            this.options.onShow();
        }
    },

    /**
     * Hides the modal.
     * @memberOf Modal
     */
    hide: function () {
        this.content.kit.classList.remove(this.options.activeClass);
        document.removeEventListener('click', this._onDocClick.bind(this), true);

        // do not remove container's active class if other active modals exist
        if (!this.container.getElementsByClassName(this.options.activeClass).length) {
            this.container.kit.classList.remove(this.options.containerActiveClass);
        }

        if (this.options.onHide) {
            this.options.onHide();
        }
    },

    /**
     * Whether the modal is showing.
     * @returns {boolean} Returns truthy if showing, falsy if not
     * @memberOf Modal
     */
    isActive: function () {
        return this.content.classList.contains(this.options.activeClass);
    },

    /**
     * When the document window is clicked.
     * @param {Event} e - The event
     * @memberOf Modal
     * @private
     */
    _onDocClick: function (e) {
        var clickedItem = e.target,
            isClickOutside = !this.content.contains(clickedItem);
        if (isClickOutside && this.isActive()) {
            if (this.options.onClickOutside) {
                this.options.onClickOutside();
            }
        }
    },

    /**
     * Destroys the modal.
     * @memberOf Modal
     */
    destroy: function () {
        this.content.kit.classList.remove(this.options.activeClass);
        if (this.container.contains(this.content)) {
            this._origModalElParent.appendChild(this.content);
        }
        if (!this.container.getElementsByClassName(this.options.activeClass).length) {
            this.container.kit.classList.remove(this.options.containerActiveClass);
        }
        document.removeEventListener('click', this._onDocClick.bind(this), true);
        Module.prototype.destroy.call(this);
    }

});

module.exports = Modal;