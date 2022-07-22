import Alpine from 'alpinejs';

import resolveAfterTimeout from '../../../../assets/js/helper/resolveAfterTimeout';


const TRANSITION_DURATION = 220;


Alpine.data('modal_ticket_comments', () => ({
  isOpen:          false,
  isVisible:       false,
  isInitializing:  false,
  isAddingComment: false,

  ticketId: undefined,
  internalId: undefined,
  renderedComments: undefined,

  _requestAbortController: undefined,

  /**
   * Resets the modal to it's initial state.
   */
   reset() {
    this.isOpen          = false;
    this.isVisible       = false;
    this.isInitializing  = false;
    this.isAddingComment = false;

    this.ticketId         = undefined;
    this.internalId       = undefined;
    this.renderedComments = undefined;
  },

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
    this.isVisible = true;

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
    this.isVisible = false;

    // Wait for the changes to be rendered, then resolve after the transition
    // animation.
    return this.waitForRender()
      .then( () => resolveAfterTimeout(TRANSITION_DURATION) );
  },

  /**
   * Loads the rendered HTML for the comments of the current ticket.
   *
   * @returns {string} The rendered comment HTML.
   */
  loadComments() {
    // Make sure there are no ongoing requests
    this._requestAbortController?.abort();

    // Generate a new AbortController that is not aborted. The current one might be.
    this._requestAbortController = new AbortController();

    return fetch(`/tickets/${this.ticketId}/comments/modal-content`, {
      signal: this._requestAbortController.signal,
    })
      .then( response => response.text() )
      .catch( error => console.error(error) );
  },

  /**
   * Loads and displays the rendered comments for the current ticket.
   *
   * @returns {Promise} A Promise that resolves when the component state was
   *   updated.
   */
  refreshComments() {
    // Load the rendered comments form the backend.
    return this.loadComments()
      // Update the modal content
      .then( renderedComments => this.renderedComments = renderedComments )
      // Wait for the changes to be rendered
      .then( () => this.waitForRender() )
  },

  /**
   * Loads and displays the rendered comments and scrolls to the most recent
   * one.
   *
   * @returns {Promise} A Promise that resolves when the comments are rendered
   *   and scrolled all the way to the most recent one at the bottom.
   */
  initializeComments() {
    // Load and render comments and jump to the most recent one.
    return this.refreshComments()
      .then( () => this.scrollToMostRecentComment() );
  },

  /**
   * Makes a call to the backend to add a comment to the current ticket.
   *
   * It takes the data from the new comment form and posts it to the backent.
   *
   * @returns {Promise} A promise for the backend call.
   */
  saveNewComment() {
    return fetch(`/tickets/${this.ticketId}/comments/new`, {
      method: 'POST',
      body: new FormData(this.$refs.newCommentForm),
    })
      .catch( error => console.error(error) );
  },

  /**
   * Adds a new comment to the current ticket.
   *
   * Makes sure the state is updated for the UI to show some loading indication.
   * Saves the new comment, reloads all comments, clears the form and finally
   * smooth scrolls to the new comment.
   *
   */
  async addComment() {
    // Set state so that UI is updated accordingly
    this.isAddingComment = true;

    // Save the new comment.
    await this.saveNewComment();

    // Refresh the comments so the new comment is visible.
    await this.refreshComments();

    // Clear the form for adding a new comment and update component state
    this.$refs.newCommentForm.reset();
    this.isAddingComment = false;

    // Wait for alpine to render the changes
    await this.waitForRender();

    // Smooth scroll to the comment that was just added.
    this.scrollToMostRecentComment('smooth');
  },

  /**
   * Scrolls to the most recent comment. The way of scrolling can be controlled
   * by the behavior parameter.
   *
   * @param {string} behavior How to scroll? 'smooth' or 'auto' (hard jump).
   */
  scrollToMostRecentComment(behavior = 'auto') {
    this.$refs.comments.scrollTo({
      top: this.$refs.comments.scrollHeight,
      behavior,
    });
  },

  /**
   * Opens and initializes the modal.
   *
   * @param {Event} event The event that was triggered to open the modal.
   */
  async open(event) {
    // Make sure no old data is sticking around.
    this.reset();

    // Setting inital values
    this.ticketId = event.detail.ticketId;
    this.internalId = event.detail.internalId;

    this.isOpen         = true;
    this.isInitializing = true;

    // Start the request for loading comments as early as possible, but store
    // the promise for later use.
    const initializeCommentsPromise = this.initializeComments();

    // Register callback for finishing initialization, when comments are loaded.
    initializeCommentsPromise
      .then( () => this.isInitializing = false );

    // Wait for the initial values to be rendered. So nothing jumps around after
    // opening the modal.
    await this.waitForRender();

    // Wait for the comments to load, but no more than 150ms. This way, either
    // the modal opens completely initialized or we show the modal with a
    // loading animation.
    await Promise.race([
      initializeCommentsPromise,
      resolveAfterTimeout(100)
    ]);

    this.show();
  },

  /**
   * Closes the modal and resets it's data to the initial state.
   */
  close() {
    // Stop onging requests immediately
    this._requestAbortController?.abort();

    // Wait for the modal to transition out, then reset the contents of it.
    // This way the user does not see an empty modal transitioning out.
    this.hide()
      .then( () => this.reset() );
  },
}));
