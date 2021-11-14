import Alpine from 'alpinejs';

import resolveAfterTimeout from '../../../../assets/js/helper/resolveAfterTimeout';


const TRANSITION_DURATION = 220;


Alpine.data('modal_ticket_comments', () => ({
  isOpen: false,

  ticketId: undefined,

  /**
   * Makes the modal visible.
   *
   * @returns Promise A promise that resolves after the transition for showing
   *   the modal is completed.
   */
  show() {
    this.isOpen = true;

    return resolveAfterTimeout(TRANSITION_DURATION);
  },

  /**
   * Hides away the modal
   *
   * @returns {Promise} A promise that resolves after the transition for hiding
   *  the modal is completed.
   */
  hide() {
    this.isOpen = false;

    return resolveAfterTimeout(TRANSITION_DURATION);
  },

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
    this.show();

    this.ticketId = event.detail.ticketId;
  },

  /**
   * Closes the modal and resets it's data to the initial state.
   */
  close() {
    // Wait for the modal to transition out, then reset the contents of it.
    // This way the user does not see an empty modal transitioning out.
    this.hide()
      .then( () => this.reset() );
  },
}));
