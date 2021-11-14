import Alpine from 'alpinejs';

import resolveAfterTimeout from '../../../../assets/js/helper/resolveAfterTimeout';


const TRANSITION_DURATION = 220;


Alpine.data('modal_ticket_comments', () => ({
  isOpen: false,

  ticketId: undefined,
  renderedComments: undefined,

  /**
   * Get a promise that resolves after the next alpine tick.
   *
   * This can be used when one needs to wait for some changes to the components
   * state to take effect.
   *
   * @returns {Promise} A promise that resolves after the next Alpine tick.
   */
  waitForRender() {
    return new Promise((resolve) => {
      this.$nextTick(resolve);
    });
  },

  /**
   * Makes the modal visible.
   *
   * @returns Promise A promise that resolves after the transition for showing
   *   the modal is completed.
   */
  show() {
    this.isOpen = true;

    // Wait for the changes to be rendered, then resolve after the transition
    // animation.
    return this.waitForRender()
      .then( () => resolveAfterTimeout(TRANSITION_DURATION) );
  },

  /**
   * Hides away the modal
   *
   * @returns {Promise} A promise that resolves after the transition for hiding
   *  the modal is completed.
   */
  hide() {
    this.isOpen = false;

    // Wait for the changes to be rendered, then resolve after the transition
    // animation.
    return this.waitForRender()
      .then( () => resolveAfterTimeout(TRANSITION_DURATION) );
  },

  /**
   * Resets the modal to it's initial state.
   */
  reset() {
    this.isOpen = false;

    this.ticketId         = undefined;
    this.renderedComments = undefined;
  },

  /**
   * Loads the rendered HTML for the comments of the current ticket.
   *
   * @returns {string} The rendered comment HTML.
   */
  loadComments() {
    return fetch(`/tickets/${this.ticketId}/comments/modal-content`)
      .then( response => response.text() )
      .catch( error => console.error(error) );
  },

  /**
   * Loads and displays the rendered comments for the current ticket.
   *
   * @returns {Promise} A Promise that resolves when the component status was
   *   updates.
   */
  updateComments() {
    return this.loadComments()
      // Update the modal content
      .then( renderedComments => this.renderedComments = renderedComments );
  },

  /**
   * Opens and initializes the modal.
   *
   * @param {Event} event The event that was triggered to open the modal.
   */
  open(event) {
    this.ticketId = event.detail.ticketId;

    this.show();
    this.updateComments();
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
