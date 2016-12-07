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

        this.modal = new tingle.modal({
            cssClass: ['side-page'],
            onClose: function() {
                history.pushState({}, '', base_url);
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
                modal_instance.close();
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

    loadPage(href, pushstate) {
        request
            .get(href)
            .set('X-Requested-With', 'XMLHttpRequest')
            .end((error, result) => {
                var modal_content = this.modal.modal.querySelector('.tingle-modal-box__content');
                modal_content.classList.remove('animate');

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

export default SoftPage;
