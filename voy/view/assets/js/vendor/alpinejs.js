import Alpine from 'alpinejs';
import trap from '@alpinejs/trap';

//
// Register Apline globally and start it
window.Alpine = Alpine;
Alpine.plugin(trap);
Alpine.start();
