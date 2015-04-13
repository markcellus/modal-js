var TestUtils = require('test-utils');
var Modal = require('../src/modal');
var assert = require('assert');

var modalsContainer;

describe('Modals', function () {

    before(function () {
        var fixture = document.getElementById('qunit-fixture');
        modalsContainer = document.createElement('div');
        modalsContainer.className = 'modal-container';
    });

    it('should be added and removed from DOM correctly on setup and destroy when a modal container is passed to instantiation', function () {
        var fixture = document.getElementById('qunit-fixture');
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            containerEl: modalsContainer,
            el: modalEl
        });
        assert.ok(!modalsContainer.contains(modalEl), 'upon instantiation, modal element has NOT yet been added as a child node of the modal container because setup() has not been called');
        modalInstance.setup();
        assert.ok(modalsContainer.contains(modalEl), 'after setup() has been called, modal element has been added as a child node of the modal container');
        modalInstance.destroy();
        assert.ok(!modalsContainer.contains(modalEl), 'upon destruction, modal element has been removed as a child node of modal container');
    });

    it('should be added and removed from DOM correctly on setup and destroy when NO modal container is passed to instantiation', function () {
        var fixture = document.getElementById('qunit-fixture');
        var bodyEl = document.getElementsByTagName('body')[0];
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            el: modalEl
        });
        assert.ok(!bodyEl.contains(modalEl), 'upon instantiation, modal element has NOT yet been added as a child node of the document body because setup() has not been called');
        modalInstance.setup();
        assert.ok(bodyEl.contains(modalEl), 'after setup() has been called, modal element has been added as a child node of document body');
        modalInstance.destroy();
        assert.ok(!bodyEl.contains(modalEl), 'upon destruction, modal element has been removed as a child node of document body');
    });

    it('should add and remove appropriate classes when showing and hiding a modal', function () {
        var fixture = document.getElementById('qunit-fixture');
        var defaultActiveClass = 'modal-active';
        var defaultContainerActiveClass = 'modal-container-active';
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            el: modalEl,
            containerEl: modalsContainer,
            activeClass: defaultActiveClass,
            containerActiveClass: defaultContainerActiveClass
        });
        modalInstance.setup();
        modalInstance.show();
        assert.ok(modalEl.classList.contains(defaultActiveClass), 'default active class was added to modal element after calling show()');
        assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was added to modal container calling show()');
        modalInstance.hide();
        assert.ok(!modalEl.classList.contains(defaultActiveClass), 'default active class was removed from modal element when hide() is called');
        assert.ok(!modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was removed from modal container');
        modalInstance.show();
        assert.ok(modalEl.classList.contains(defaultActiveClass), 'default active class was added back to modal element when show() is called again');
        assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was added to modal container');
        modalInstance.destroy();
        assert.ok(!modalEl.classList.contains(defaultActiveClass), 'default active class was removed from modal element when destroy() is called');
        assert.ok(!modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was removed from modal container');
    });

    it('custom classes should be added and removed appropriately when showing and hiding multiple modals with custom active classes', function () {
        var fixture = document.getElementById('qunit-fixture');
        var activeClass = 'my-custom-modal-active';
        var containerActiveClass = 'my-custom-modal-container-active';
        var firstModalEl = document.createElement('div');
        var secondModalEl = document.createElement('div');
        var firstModalInstance = new Modal({
            el: firstModalEl,
            containerEl: modalsContainer,
            activeClass: activeClass,
            containerActiveClass: containerActiveClass
        });
        var secondModalInstance = new Modal({
            el: secondModalEl,
            containerEl: modalsContainer,
            activeClass: activeClass,
            containerActiveClass: containerActiveClass
        });
        firstModalInstance.setup();
        secondModalInstance.setup();
        firstModalInstance.show();
        assert.ok(firstModalEl.classList.contains(activeClass), 'after calling show() on first modal, active class was added to it');
        assert.ok(!secondModalEl.classList.contains(activeClass), 'second modal does NOT yet have an active class');
        assert.ok(modalsContainer.classList.contains(containerActiveClass), 'active class was added to modal container');
        secondModalInstance.show();
        assert.ok(secondModalEl.classList.contains(activeClass), 'after calling show() on second modal, active class was added to it');
        assert.ok(firstModalEl.classList.contains(activeClass), 'first modal still now has its active class');
        assert.ok(modalsContainer.classList.contains(containerActiveClass), 'modal container still has active class');
        firstModalInstance.hide();
        assert.ok(!firstModalEl.classList.contains(activeClass), 'hiding first modal removes its active class');
        assert.ok(secondModalEl.classList.contains(activeClass), 'second modal still has its active class');
        assert.ok(modalsContainer.classList.contains(containerActiveClass), 'modal container still has active class because second modal hasnt been hidden yet');
        secondModalInstance.hide();
        assert.ok(!secondModalEl.classList.contains(activeClass), 'hiding second modal removes its active class');
        assert.ok(!firstModalEl.classList.contains(activeClass), 'first modal still does NOT have an active class');
        assert.ok(!modalsContainer.classList.contains(containerActiveClass), 'modal container\'s active class has been removed since there are modals showing');
        firstModalInstance.destroy();
        secondModalInstance.destroy();
    });
});
