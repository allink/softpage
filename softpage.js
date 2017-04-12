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
            },
            beforeClose: function() {
                if(self.options.onBeforeClose) {
                    self.options.onBeforeClose(self);
                }
            }
        });

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
            this.modal.modal.scrollTop = 0;
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
