import Alpine from 'alpinejs';


Alpine.data('modal_ticket_comments', () => ({
  isOpen: false,

  open(event) {
    this.isOpen = true;
  },

  close(event) {
    this.isOpen = false;
  },
}));
