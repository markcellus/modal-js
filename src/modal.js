import Module from 'module-js';

/**
 * Builds the modal element and its content
 * @param content
 * @returns {HTMLElement} Returns the DOM element
 */
let setupEl = function (content) {
    if (typeof content === 'string') {
        // html!
        let tempParentEl,
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
export default class Modal extends Module {

    /**
     * Sets up the modal.
     * @param {HTMLElement|HTMLTemplateElement|String} el - The content to be used as the modal template
     * @param {object} options - The options
     */
    constructor (el, options) {

        let originalParent = el.parentNode;
        
        options = Object.assign({
            containerEl: document.getElementsByTagName('body')[0],
            onHide: null,
            onShow: null,
            onClickOutside: null,
            activeClass: 'modal-active',
            containerActiveClass: 'modal-container-active'
        }, options);

        el = setupEl(el);

        super(el, options);
        options.onClickOutside = options.onClickOutside || this.hide.bind(this);
        this.options = options;
        this._origModalElParent = originalParent;
        if (!this.options.containerEl.contains(this.el)) {
            this.options.containerEl.appendChild(this.el);
        }

    }

    /**
     * Sets stuff up.
     * @deprecated since 2.1.0
     */
    setup () {}

    /**
     * Shows the modal.
     * @returns {Promise}
     */
    show () {
        this.options.containerEl.classList.add(this.options.containerActiveClass);
        this._onDocClickEventListener = this._onDocClick.bind(this);
        document.addEventListener('click', this._onDocClickEventListener, true);
        return super.show().then(() => {
            if (this.options.onShow) {
                this.options.onShow();
            }
        });
    }

    /**
     * Hides the modal.
     * @returns {Promise}
     */
    hide () {
        document.removeEventListener('click', this._onDocClick.bind(this), true);
        return super.hide().then(() => {
            // do not remove container's active class if other active modals exist
            if (!this.options.containerEl.getElementsByClassName(this.options.activeClass).length) {
                this.options.containerEl.classList.remove(this.options.containerActiveClass);
            }
            if (this.options.onHide) {
                this.options.onHide();
            }
        });
    }

    /**
     * Whether the modal is showing.
     * @deprecated since 2.1.0
     * @returns {boolean} Returns truthy if showing, falsy if not
     */
    isActive () {
        return this.active;
    }

    /**
     * When the document window is clicked.
     * @param {Event} e - The event
     * @private
     */
    _onDocClick (e) {
        let clickedItem = e.target,
            isClickOutside = !this.el.contains(clickedItem);
        if (isClickOutside && this.active) {
            if (this.options.onClickOutside) {
                this.options.onClickOutside();
            }
        }
    }

    /**
     * Destroys the modal.
     */
    destroy () {
        if (this._origModalElParent) {
            this._origModalElParent.appendChild(this.el);
        } else if (this.options.containerEl.contains(this.el)) {
            this.options.containerEl.removeChild(this.el);
        }
        if (!this.options.containerEl.getElementsByClassName(this.options.activeClass).length) {
            this.options.containerEl.classList.remove(this.options.containerActiveClass);
        }
        document.removeEventListener('click', this._onDocClickEventListener, true);
        super.destroy();
    }

}