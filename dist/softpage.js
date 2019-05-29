(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("tingle.js"), require("superagent"));
	else if(typeof define === 'function' && define.amd)
		define(["tingle.js", "superagent"], factory);
	else if(typeof exports === 'object')
		exports["SoftPage"] = factory(require("tingle.js"), require("superagent"));
	else
		root["SoftPage"] = factory(root["tingle.js"], root["superagent"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tingle = __webpack_require__(1);

	var _tingle2 = _interopRequireDefault(_tingle);

	var _superagent = __webpack_require__(2);

	var _superagent2 = _interopRequireDefault(_superagent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SoftPage = function () {
	    function SoftPage(options) {
	        _classCallCheck(this, SoftPage);

	        this.options = options || {};
	        this.base_url = window.location.href;
	        this.init();
	    }

	    _createClass(SoftPage, [{
	        key: 'init',
	        value: function init() {
	            var base_url = this.base_url;
	            var self = this;
	            this.modal = new _tingle2.default.modal({
	                cssClass: ['softpage'],
	                onClose: function onClose() {
	                    history.replaceState({}, '', base_url); // removed due to double base url issue
	                    if (self.options.onSoftpageClosed) {
	                        self.options.onSoftpageClosed(self);
	                    }
	                },
	                beforeClose: function beforeClose() {
	                    if (self.options.onBeforeClose) {
	                        return self.options.onBeforeClose(self);
	                    }
	                }
	            });

	            // in case of browser history is changing
	            window.onpopstate = function (event) {
	                if (window.location.href !== base_url) {
	                    // when changing to another page
	                    window.location.reload(); // after history change, reload to load server-side page
	                }
	                if (event.state && event.state.is_soft_page) {
	                    this.loadPage(window.location);
	                } else if (this.modal) {
	                    this.modal.close();
	                }
	            }.bind(this);
	        }
	    }, {
	        key: 'closeSoftpage',
	        value: function closeSoftpage() {
	            this.modal.close();
	        }
	    }, {
	        key: 'loadPage',
	        value: function loadPage(href, pushstate, softpage_content_id) {
	            var _this = this;

	            // init
	            var modal_content = this.modal.modal.querySelector('.tingle-modal-box__content');
	            // option 1: load content of element with ID
	            if (softpage_content_id && softpage_content_id.length > 0) {
	                var softpage_content_markup = document.getElementById(softpage_content_id).innerHTML;
	                this.modal.open();
	                this.modal.setContent(softpage_content_markup);
	                this.modal.modal.querySelector('.tingle-modal-box').scrollTop = 0;
	                // let us know that everything's alright
	                if (this.options.onPageLoaded) {
	                    this.options.onPageLoaded(this);
	                }
	            }
	            // otherwise, do it the regular way
	            else {
	                    // Append softpage=True to the request URL in case the responding page behaves differently for softpages.
	                    var sofpageIdentificationUrlParameter = href.indexOf('?') === -1 ? '?softpage=true' : '&softpage=true';
	                    var softpageUrl = href + sofpageIdentificationUrlParameter;
	                    _superagent2.default.get(softpageUrl).set('X-Requested-With', 'XMLHttpRequest').end(function (error, result) {
	                        _this.modal.open();
	                        _this.modal.setContent(result.text);
	                        if (_this.options.onPageLoaded) {
	                            _this.options.onPageLoaded(_this);
	                        }
	                        if (pushstate) {
	                            history.pushState({ is_soft_page: true }, '', href);
	                        }
	                    });
	                }
	        }
	    }]);

	    return SoftPage;
	}();

	exports.default = SoftPage;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ])
});
;