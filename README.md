# Modal

Create simple or advanced, high performant Modals with minimal javascript and markup.
This library is built using native vanilla javascript. 
Which means super fast performance. Supports IE10+, all major browsers and even mobile.

## Usage

Create one or more modals with a few lines of javascript. With your html and css setup correctly, you can do:

```javascript
var modal = new Modal({
    el: $('<div class="my-modal">My Modal Content</div>')[0],
    containerEl: $('modals-container')[0],
    activeClass: 'modal-active'
});

modal.setup(); // inject the modal's html into the modal container
modal.show(); // show the modal
modal.hide(); // hide the modal
```

More details and example can be found [here](examples/modal.html).