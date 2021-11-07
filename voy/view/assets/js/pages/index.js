/**
 * Code for handling the modal of the data table
 */
$('#modal_ticket_comment').on('show.bs.modal', function (event) {
  const button      = $(event.relatedTarget)
  const ticket_uuid = button.data('ticket-uuid')

  const $modal          = $(this);
  const $title          = $modal.find('.modal-title');
  const $content        = $modal.find('.modal-comment-body');

  const $addCommentForm         = $modal.find('form');
  console.log($addCommentForm);
  const $addCommentFormTextarea = $addCommentForm.find('textarea');
  const $addCommentFormSubmit   = $addCommentForm.find('button[type="submit"]');

  //
  // Reset the form
  // Update the modal Title
  $title.text(`Requery Dialog | Query ID: ${ticket_uuid}`);
  // Display loading indicator
  $content.html('<div class="d-flex align-center"><div class="spinner-border mx-auto" role="status"></div></div>');
  // Update the form action
  $addCommentForm.attr('action', `/tickets/${ticket_uuid}/comments/new`);
  // Clear textarea
  $addCommentFormTextarea.val('');
  // Disable inputs
  $addCommentFormTextarea.attr('disabled', true);
  $addCommentFormSubmit.attr('disabled', true);

  //
  // Load the data for the modal
  $.get(`/tickets/${ticket_uuid}/comments/modal-content`)
    .done(data => {
      // Put the loaded html into the modal
      $content.html(data);

      // Enable inputs
      $addCommentFormTextarea.attr('disabled', false);
      $addCommentFormSubmit.attr('disabled', false);
    });
});
