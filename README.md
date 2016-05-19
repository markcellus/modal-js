[![Build Status](https://travis-ci.org/mkay581/modal-js.svg?branch=master)](https://travis-ci.org/mkay581/modal-js)
[![npm version](https://badge.fury.io/js/modal-js.svg)](https://badge.fury.io/js/modal-js)
[![Bower version](https://badge.fury.io/bo/modal-module.svg)](https://badge.fury.io/bo/modal-module)

# Modal

Create simple (or advanced), high-performant modals with minimal javascript and markup.
This library is built using native vanilla javascript, so it is lightweight and super fast.

## Benefits

* Hide and show modals in any area in the DOM
* Respond to events when modals are shown and hidden
* Respects CSS transitions and delays
* Fully customizable modal containers and content
* Supports multiple modals and modals inside of a modals.. weee!

## Usage

Create one or more modals with a few lines of javascript. With your html and css setup correctly, you can do:

```javascript
let html = '<div class="my-modal">My Modal Content</div>';
let modal = new Modal(html, {
    containerEl: document.getElementById('modals-container'),
    activeClass: 'modal-active'
});

modal.show(); // show the modal
modal.hide(); // hide the modal
```

### Respond when modal is shown (or hidden)

The library respects any css transitions you add to show and hide your modal.
So given the following css:

```css
.my-modal {
    visibility: hidden;
    opacity: 0;
    transition: opacity 1000ms linear;
}

.my-modal.modal-active {
    visibility: visible;
    opacity: 1;
}
```

You can do things after the modal fades in:

```javascript
modal.show().then(function () {
    // fired after 1000 milliseconds, when the modal has been fully faded in
});
```

## Examples

More details and example can be found [here](examples/modal.html).


## Notes

* Always try to place your modals in a high DOM level to prevent other elements from inadvertently
affecting the modal's appearance and/or functionality.
