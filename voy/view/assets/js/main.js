// Packages
import Alpine from 'alpinejs';
import trap from '@alpinejs/trap';


// Styles
import '../css/main.scss';


// Register Apline globally and start it
window.Alpine = Alpine;
Alpine.plugin(trap);
Alpine.start();
