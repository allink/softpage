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
                history.replaceState({}, '', base_url); // removed due to double base url issue
                if(self.options.onSoftpageClosed) {
                    self.options.onSoftpageClosed(self);
                }
            },
            beforeClose: function() {
                if(self.options.onBeforeClose) {
                    return self.options.onBeforeClose(self);
                }
            }
        });

        // in case of browser history is changing
        window.onpopstate = function (event) {
            if (window.location.href !== base_url) { // when changing to another page
                window.location.reload(); // after history change, reload to load server-side page
            }
            if (event.state && event.state.is_soft_page) {
                this.loadPage(window.location);
            } else if (this.modal) {
                this.modal.close();
            }
        }.bind(this);
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
            this.modal.modal.querySelector('.tingle-modal-box').scrollTop = 0;
            // let us know that everything's alright
            if(this.options.onPageLoaded) {
                this.options.onPageLoaded(this);
            }
        }
        // otherwise, do it the regular way
        else {
            // Append softpage=True to the request URL in case the responding page behaves differently for softpages.
            let sofpageIdentificationUrlParameter = href.indexOf('?') === -1 ? '?softpage=true' : '&softpage=true';
            let softpageUrl = href + sofpageIdentificationUrlParameter;
            request
                .get(softpageUrl)
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
