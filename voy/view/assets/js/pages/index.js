import TableFilter from 'tablefilter';


/**
 * Code for handling the modal of the data table
 */
$('#modal_ticket_comment').on('show.bs.modal', function (event) {
  const button      = $(event.relatedTarget)
  const ticket_id   = button.data('ticket-id')

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
  $title.text(`Requery Dialog | Query ID: ${ticket_id}`);
  // Display loading indicator
  $content.html('<div class="d-flex align-center"><div class="spinner-border mx-auto" role="status"></div></div>');
  // Update the form action
  $addCommentForm.attr('action', `/tickets/${ticket_id}/comments/new`);
  // Clear textarea
  $addCommentFormTextarea.val('');
  // Disable inputs
  $addCommentFormTextarea.attr('disabled', true);
  $addCommentFormSubmit.attr('disabled', true);

  //
  // Load the data for the modal
  $.get(`/tickets/${ticket_id}/comments/modal-content`)
    .done(data => {
      // Put the loaded html into the modal
      $content.html(data);

      // Enable inputs
      $addCommentFormTextarea.attr('disabled', false);
      $addCommentFormSubmit.attr('disabled', false);
    });
});


/**
 * Code for creating the data table
 */
$(document).ready(function () {
  var filtersConfig = {
    base_path : "tablefilter/dist/tablefilter/",
    // define the user help with 'help_instructions'
    help_instructions: false,
    // you can disable it
    popup_filters: false,
    col_0: "none",
    // selecting with a drop-down
    col_1: "select",
    col_2: "checklist",
    col_4: "select",
    // no filter for the last column
    col_10: "none",
    alternate_rows: true,
    // grid layout customisation
    grid_layout: {
      width: "1200px",
      height: "400px",
    },
    mark_active_columns: {
      // Mark active columns
      highlight_column: true, // .. and with column header
    },
    rows_counter: {
      text: "Queries : "
    },
    highlight_keywords: true,
    col_widths: [
      "50px",
      "100px",
      "100px",
      "100px",
      "90px",
      "60px",
      "60px",
      "100px",
      "280px",
      "130px",
    ],
    watermark: [
      "info",
      "status",
      "study ID",
      "Scr No",
      "Type",
      "Visit",
      "Page",
      "Procedure",
      "Description",
      "Created on",
    ],

    /** Bootstrap integration */

    // aligns filter at cell bottom when Bootstrap is enabled
    // filters_cell_tag: "th",

    // allows Bootstrap table styling
    themes: [{
      name: "transparent",
    }, ],
  };

  var tf = new TableFilter("query_table", filtersConfig);
  tf.init();
})
