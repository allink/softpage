import tingle from 'tingle.js';
import request from 'superagent';

class SoftPage {
    constructor (options) {
        this.options = options || {};
        this.base_url = window.location.href;
        this.init();
    }

    init () {
        let base_url = this.base_url;
        var self = this;
        this.modal = new tingle.modal({
            cssClass: ['softpage'],
            onClose: function() {
                history.pushState({}, '', base_url);
                if(self.options.onSoftpageClosed) {
                    self.options.onSoftpageClosed(self);
                }
            }
        });

        // add functionality to close the modal with the ESCAPE key
        var modal_instance = this.modal;
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = evt.key == "Escape";
            } else {
                isEscape = evt.keyCode == 27;
            }
            if (isEscape) {
                // only close if the "softpage modal" is opened
                if (modal_instance.modal.classList.contains('tingle-modal--visible')) {
                    // only close if the "form modal" is NOT opened
                    if (document.querySelector('html').classList.contains('form-modal-visible') === false) {
                        modal_instance.close();
                    }
                }
            }
        };

        // in case of browser history is changing
        window.onpopstate = function(event) {
            if(event.state && event.state.is_soft_page) {
                this.loadPage(window.location);
            }
            else if(this.modal) {
                this.modal.close();
            }
        };
    }

    closeSoftpage() {
        this.modal.close();
    }

    loadPage(href, pushstate, softpage_content_id) {
        // init
        var modal_content = this.modal.modal.querySelector('.tingle-modal-box__content');
        // option 1: load content of element with ID
        if (softpage_content_id && softpage_content_id.length > 0) {
            var softpage_content_markup = document.getElementById(softpage_content_id).innerHTML;
            this.modal.open();
            this.modal.setContent(softpage_content_markup);
            if(this.options.onPageLoaded) {
                this.options.onPageLoaded(this);
            }
        }
        // otherwise, do it the regular way
        else {
            request
                .get(href)
                .set('X-Requested-With', 'XMLHttpRequest')
                .end((error, result) => {
                    this.modal.open();
                    this.modal.setContent(result.text);
                    if(this.options.onPageLoaded) {
                        this.options.onPageLoaded(this);
                    }
                    if(pushstate) {
                        history.pushState({is_soft_page: true}, '', href);
                    }
            });
        }
    }
}

export default SoftPage;
