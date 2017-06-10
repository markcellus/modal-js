import Modal from '../src/modal';
import assert from 'assert';
import sinon from 'sinon';
import Module from 'module-js';
import _ from 'lodash';

let Promise = require('es6-promise').Promise;

let modalsContainer;

describe('Modal', function () {

    before(function () {
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
        let modalEl = document.createElement('div');
        let modalInstance = new Modal(modalEl, {containerEl: modalsContainer});
        assert.ok(modalsContainer.contains(modalEl), 'after setup() has been called, modal element has been added as a child node of the modal container');
        modalInstance.destroy();
        assert.ok(!modalsContainer.contains(modalEl), 'upon destruction, modal element has been removed as a child node of modal container');
    });

    it('should be added and removed from DOM correctly on setup and destroy when NO modal container is passed to instantiation', function () {
        let bodyEl = document.getElementsByTagName('body')[0];
        let modalEl = document.createElement('div');
        let modalInstance = new Modal(modalEl);
        assert.ok(bodyEl.contains(modalEl), 'after setup() has been called, modal element has been added as a child node of document body');
        modalInstance.destroy();
        assert.ok(!bodyEl.contains(modalEl), 'upon destruction, modal element has been removed as a child node of document body');
    });

    it('should remove active class from modal container only when AFTER hide() resolves', function (done) {
        let defaultContainerActiveClass = 'modal-container-active';
        let moduleHidePromise = {};
        let p = new Promise((resolve) => {
            moduleHidePromise.resolve = resolve;
        });
        Module.prototype.hide.returns(p);
        let modalInstance = new Modal(document.createElement('div'), {containerEl: modalsContainer});
        modalInstance.show().then(function () {
            assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'active class was added to modal container calling show()');
            let modalHidePromise = modalInstance.hide();
            _.defer(() => {
                assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'still has active class after call stack has cleared');
                moduleHidePromise.resolve();
                modalHidePromise.then(function () {
                    assert.ok(!modalsContainer.classList.contains(defaultContainerActiveClass), 'active class is removed after hide promise resolves');
                    modalInstance.destroy();
                    done();
                });
            });
        });
    });

    it('should add active class to modal container BEFORE show() resolves', function (done) {
        let defaultContainerActiveClass = 'modal-container-active';
        let modalInstance = new Modal(document.createElement('div'), {containerEl: modalsContainer});
        modalInstance.show();
        _.defer(() => {
            assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass), 'has active class after call stack has cleared');
            modalInstance.destroy();
            done();
        });
    });

    it('should remove active class from modal container when destroy is called', function (done) {
        let defaultContainerActiveClass = 'modal-container-active';
        let modalInstance = new Modal(document.createElement('div'), {containerEl: modalsContainer});
        modalInstance.show();
        _.defer(() => {
            assert.ok(modalsContainer.classList.contains(defaultContainerActiveClass));
            modalInstance.destroy();
            assert.ok(!modalsContainer.classList.contains(defaultContainerActiveClass));
            done();
        });
    });

    it('should remove custom active class when hide is called', function (done) {
        let customActiveClass = 'my-custom-module-active';
        let modalEl = document.createElement('div');
        let modalInstance = new Modal(modalEl, {containerEl: modalsContainer, activeClass: customActiveClass});
        modalInstance.show();
        // defer until generated promises have cleared the call stack
        _.defer(function () {
            modalInstance.hide();
            _.defer(function () {
                assert.ok(!modalEl.classList.contains(customActiveClass));
                modalInstance.destroy();
                done();
            });
        });
    });

    it('should remove custom active class when destroy is called while the modal is showing', function (done) {
        let customActiveClass = 'my-custom-module-active';
        let modalEl = document.createElement('div');
        let modalInstance = new Modal(modalEl, {containerEl: modalsContainer, activeClass: customActiveClass});
        modalInstance.show();
        // defer until generated promises have cleared the call stack
        _.defer(function () {
            modalInstance.destroy();
            assert.ok(!modalEl.classList.contains(customActiveClass));
            done();
        });
    });


    it('should NOT call hide on another modal if another one is shown if the previous one is not showing', function (done) {
        let activeClass = 'my-custom-modal-active';
        let containerActiveClass = 'my-custom-modal-container-active';
        let firstModalEl = document.createElement('div');
        let secondModalEl = document.createElement('div');
        let firstModalInstance = new Modal(firstModalEl, {
            containerEl: modalsContainer,
            activeClass: activeClass,
            containerActiveClass: containerActiveClass
        });
        let secondModalInstance = new Modal(secondModalEl, {
            containerEl: modalsContainer,
            activeClass: activeClass,
            containerActiveClass: containerActiveClass
        });
        sinon.stub(firstModalInstance, 'hide').returns(Promise.resolve());
        // defer until generated promises have cleared the call stack
        _.defer(function () {
            assert.equal(firstModalInstance.hide.callCount, 0);
            secondModalInstance.show();
            _.defer(function () {
                assert.equal(firstModalInstance.hide.callCount, 0);
                firstModalInstance.destroy();
                secondModalInstance.destroy();
                done();
            });
        });
    });

    it('if modal element passed has a parent, it should be added back on destroy', function () {
        let bodyEl = document.getElementsByTagName('body')[0];
        let modalElParent = document.createElement('div');
        let modalEl = document.createElement('div');
        modalElParent.appendChild(modalEl);
        let modalInstance = new Modal(modalEl);

        modalInstance.destroy();
        assert.ok(modalElParent.contains(modalEl), 'modal element has been appended back to its original parent');
        assert.ok(!bodyEl.contains(modalEl), 'modal element has been removed as a child node of document body');
    });

    it('should call Module.prototype.show() when show() is called', function () {
        let modalEl = document.createElement('div');
        let modalInstance = new Modal(modalEl, {containerEl: modalsContainer});
        modalInstance.show();
        assert.equal(Module.prototype.show.callCount, 1);
        modalInstance.destroy();
    });

    it('should call Module.prototype.hide() method when hide() is called', function () {
        let modalEl = document.createElement('div');
        let modalInstance = new Modal(modalEl, {containerEl: modalsContainer});
        modalInstance.hide();
        assert.equal(Module.prototype.hide.callCount, 1);
        modalInstance.destroy();
    });

    it('should call Module.prototype.destroy() when destroy() is called', function () {
        let modalEl = document.createElement('div');
        sinon.spy(Module.prototype, 'destroy');
        let modalInstance = new Modal(modalEl, {containerEl: modalsContainer});
        modalInstance.destroy();
        assert.equal(Module.prototype.destroy.callCount, 1);
        Module.prototype.destroy.restore();
    });

    it('should make element passed in as initialize options available via \"el\" property', function () {
        let modalEl = document.createElement('div');
        let modalInstance = new Modal(modalEl, {containerEl: modalsContainer});
        assert.deepEqual(modalInstance.el, modalEl);
        modalInstance.destroy();
    });

    it('passing an html string as the el should make it accessible as a DOM element via el property', function () {
        let modalClass = 'my-modal';
        let modalHtml = '<div class="' + modalClass + '"></div>';
            let modalInstance = new Modal(modalHtml, {containerEl: modalsContainer});

        assert.deepEqual(modalInstance.el, modalsContainer.getElementsByClassName(modalClass)[0]);
        modalInstance.destroy();
    });

    it('should trigger onHide after hide() resolves', function (done) {
        let moduleHidePromise = {};
        let p = new Promise((resolve) => {
            moduleHidePromise.resolve = resolve;
        });
        Module.prototype.hide.returns(p);
        let onHideSpy = sinon.spy();
        let modalInstance = new Modal(document.createElement('div'), {containerEl: modalsContainer, onHide: onHideSpy});
        modalInstance.hide();
        _.defer(() => {
            assert.equal(onHideSpy.callCount, 0, 'onHide has not been triggered after call stack has cleared');
            moduleHidePromise.resolve();
            _.defer(() => {
                assert.equal(onHideSpy.callCount, 1, 'onHide is triggered after promise resolves');
                modalInstance.destroy();
                done();
            });
        });
    });

    it('should trigger onShow after show() resolves', function (done) {
        let moduleShowPromise = {};
        let p = new Promise((resolve) => {
            moduleShowPromise.resolve = resolve;
        });
        Module.prototype.show.returns(p);
        let onShowSpy = sinon.spy();
        let modalInstance = new Modal(document.createElement('div'), {containerEl: modalsContainer, onShow: onShowSpy});
        modalInstance.show();
        _.defer(() => {
            assert.equal(onShowSpy.callCount, 0, 'onShow has not been triggered after call stack has cleared');
            moduleShowPromise.resolve();
            _.defer(() => {
                assert.equal(onShowSpy.callCount, 1, 'onShow is triggered after promise resolves');
                modalInstance.destroy();
                done();
            });
        });
    });

    it('should call hide() when there is a click on the document', function () {
        let modalEl = document.createElement('div');
        document.body.appendChild(modalsContainer);
        let hideSpy = sinon.spy(Modal.prototype, 'hide');
        let modal = new Modal(modalEl, {containerEl: modalsContainer});
        return modal.show().then(() => {
            // the inherited class adds active to the module when showing it
            modal.active = true;
            assert.equal(hideSpy.callCount, 0);
            let clickEvent = new Event('click');
            document.dispatchEvent(clickEvent);
            assert.equal(hideSpy.callCount, 1);
            hideSpy.restore();
            modal.destroy();
            document.body.removeChild(modalsContainer);
        });
    });

    it('should NOT call hide() when there is a click inside of the modal\'s el and the el is a child of the document', function () {
        let modalEl = document.createElement('div');
        let modalInner = document.createElement('div');
        modalEl.appendChild(modalInner);
        document.body.appendChild(modalsContainer);
        let hideSpy = sinon.spy(Modal.prototype, 'hide');
        let modal = new Modal(modalEl, {containerEl: modalsContainer});
        return modal.show().then(() => {
            // the inherited class adds active to the module when showing it
            modal.active = true;
            assert.equal(hideSpy.callCount, 0);
            let clickEvent = new Event('click');
            modalInner.dispatchEvent(clickEvent);
            assert.equal(hideSpy.callCount, 0);
            hideSpy.restore();
            modal.destroy();
            document.body.removeChild(modalsContainer);
        });
    });

    it('should trigger onClickOutside callback passed to Modal\'s constructor when there is a click outside of the modal\'s el instead of hide()', function () {
        let modalEl = document.createElement('div');
        let hideSpy = sinon.spy(Modal.prototype, 'hide');
        let onClickOutsideSpy = sinon.spy();
        let modal = new Modal(modalEl, {containerEl: modalsContainer, onClickOutside: onClickOutsideSpy});
        return modal.show().then(() => {
            // the inherited class adds active to the module when showing it
            modal.active = true;
            assert.equal(onClickOutsideSpy.callCount, 0);
            let clickEvent = new Event('click');
            document.dispatchEvent(clickEvent);
            assert.equal(hideSpy.callCount, 0);
            assert.equal(onClickOutsideSpy.callCount, 1);
            hideSpy.restore();
            modal.destroy();
        });
    });

});
