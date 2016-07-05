import 'tingle.js/dist/tingle.css';
import '../softpage.less';
import SoftPage from '../softpage';

var soft_page = new SoftPage({
    onPageLoaded: function(soft_page) {
        document.querySelector('.tingle-modal-box .change-softpage').addEventListener('click', function(event) {
            event.preventDefault();
            soft_page.loadPage(this.href, true);
        });
    }
});

document.getElementById('open-softpage').addEventListener('click', function(event) {
    event.preventDefault();
    soft_page.loadPage(this.href, true);
});
