var Modal = require('../src/modal');
var assert = require('assert');
var Module = require('module-js');
var sinon = require('sinon');
var Promise = require('promise');

var modalsContainer;

describe('Modal', function () {

    before(function () {
        var fixture = document.getElementById('qunit-fixture');
        modalsContainer = document.createElement('div');
        modalsContainer.className = 'modal-container';
    });

    beforeEach(function () {
        sinon.stub(Module.prototype, 'show').returns(Promise.resolve());
        sinon.stub(Module.prototype, 'hide').returns(Promise.resolve());
    });

    afterEach(function () {
        Module.prototype.show.restore();
        Module.prototype.hide.restore();
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
        modalInstance.hide();
        assert.ok(!modalEl.classList.contains(defaultActiveClass), 'default active class was removed from modal element when hide() is called');
        modalInstance.show();
        assert.ok(modalEl.classList.contains(defaultActiveClass), 'default active class was added back to modal element when show() is called again');
        modalInstance.destroy();
        assert.ok(!modalEl.classList.contains(defaultActiveClass), 'default active class was removed from modal element when destroy() is called');
    });

    it('should add and remove appropriate classes to modal container when showing and hiding a modal', function () {
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
        return modalInstance.show().then(function () {
            assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was added to modal container calling show()');
            return modalInstance.hide().then(function () {
                assert.ok(!modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was removed from modal container');
                return modalInstance.show().then(function () {
                    assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was added to modal container');
                    modalInstance.destroy();
                    assert.ok(!modalsContainer.classList.contains(defaultContainerActiveClass), 'default active class was removed from modal container');
                });

            });
        });
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
        secondModalInstance.show();
        assert.ok(secondModalEl.classList.contains(activeClass), 'after calling show() on second modal, active class was added to it');
        assert.ok(firstModalEl.classList.contains(activeClass), 'first modal still now has its active class');
        firstModalInstance.hide();
        assert.ok(!firstModalEl.classList.contains(activeClass), 'hiding first modal removes its active class');
        assert.ok(secondModalEl.classList.contains(activeClass), 'second modal still has its active class');
        secondModalInstance.hide();
        assert.ok(!secondModalEl.classList.contains(activeClass), 'hiding second modal removes its active class');
        assert.ok(!firstModalEl.classList.contains(activeClass), 'first modal still does NOT have an active class');
        firstModalInstance.destroy();
        secondModalInstance.destroy();
    });

    it('if modal element passed has a parent, it should be added back on destroy', function () {
        var fixture = document.getElementById('qunit-fixture');
        var bodyEl = document.getElementsByTagName('body')[0];
        var modalElParent = document.createElement('div');
        var modalEl = document.createElement('div');
        modalElParent.appendChild(modalEl);
        var modalInstance = new Modal({
            el: modalEl
        });
        modalInstance.setup();
        modalInstance.destroy();
        assert.ok(modalElParent.contains(modalEl), 'modal element has been appended back to its original parent');
        assert.ok(!bodyEl.contains(modalEl), 'modal element has been removed as a child node of document body');
    });

    it('initializing should call Module.prototype.initialize() with correct options', function () {
        var fixture = document.getElementById('qunit-fixture');
        var modalEl = document.createElement('div');
        sinon.stub(Module.prototype, 'initialize');
        var activeClass = 'my-custom-active';
        var modalInstance = new Modal({
            el: modalEl,
            containerEl: modalsContainer,
            activeClass: activeClass
        });
        assert.equal(Module.prototype.initialize.args[0][0].activeClass, activeClass, 'activeClass was passed to Module.prototype initialize call');
        modalInstance.destroy();
        Module.prototype.initialize.restore();
    });


    it('show() should call Module.prototype.show()', function () {
        var fixture = document.getElementById('qunit-fixture');
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            el: modalEl,
            containerEl: modalsContainer
        });
        modalInstance.setup();
        modalInstance.show();
        assert.equal(Module.prototype.show.callCount, 1, 'Module.prototype.show() was called when show() was called');
        modalInstance.destroy();
    });

    it('show() and hide() should call Module.prototype methods', function () {
        var fixture = document.getElementById('qunit-fixture');
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({
            el: modalEl,
            containerEl: modalsContainer
        });
        modalInstance.setup();
        modalInstance.hide();
        assert.equal(Module.prototype.hide.callCount, 1, 'Module.prototype.hide() was called when show() was called');
        modalInstance.destroy();
    });

    it('should make element passed in as initialize options available via \"el\" property', function () {
        var fixture = document.getElementById('qunit-fixture');
        var modalEl = document.createElement('div');
        var modalInstance = new Modal({el: modalEl, containerEl: modalsContainer});
        modalInstance.setup();
        assert.deepEqual(modalInstance.el, modalEl);
        modalInstance.destroy();
    });

    it('passing an html string as the el should make it accessible as a DOM element via el property', function () {
        var fixture = document.getElementById('qunit-fixture');
        var modalClass = 'my-modal';
        var modalHtml = '<div class="' + modalClass + '"></div>';
        var modalInstance = new Modal({el: modalHtml, containerEl: modalsContainer});
        modalInstance.setup();
        assert.deepEqual(modalInstance.el, modalsContainer.getElementsByClassName(modalClass)[0]);
        modalInstance.destroy();
    });
});
