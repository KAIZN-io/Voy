import Alpine from 'alpinejs';


Alpine.data('modal_ticket_comments', () => ({
  isOpen: false,

  ticketId: undefined,

  /**
   * Resets the modal to it's initial state.
   */
  reset() {
    this.isOpen = false;

    this.ticketId = undefined;
  },

  /**
   * Opens and initializes the modal.
   *
   * @param {Event} event The event that was triggered to open the modal.
   */
  open(event) {
    this.isOpen = true;

    this.ticketId = event.detail.ticketId;
  },

  /**
   * Closes the modal and resets it's data to the initial state.
   */
  close() {
    this.reset();
  },
}));
