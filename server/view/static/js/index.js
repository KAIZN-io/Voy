import TableFilter from 'tablefilter';


/**
 * Code for handling the modal of the data table
 */
$('#requery_Modal').on('show.bs.modal', function (event) {
  let button   = $(event.relatedTarget) // Button that triggered the modal
  let query_id = button.data('id') // Extract info from data-* attributes
  let $modal   = $(this);
  let $title   = $modal.find('.modal-title');
  let $content = $modal.find('.modal-body_1');

  // Set query id as value
  $modal.find('input[name="query_id"]').val(query_id);

  // Update the modal Title
  $title.text(`Requery Dialog | Query ID: ${query_id}`);

  // AJAX request -> load data for the modal
 $.get(`/modal_data/${query_id}`)
    // and push it into the modal
    .done(data => $content.html(data));
})

// get more infos about this query
$('#info_Modal').on('show.bs.modal', function (event) {
  let button   = $(event.relatedTarget) // Button that triggered the modal
  let query_id = button.data('id') // Extract info from data-* attributes
  let $modal   = $(this);
  let $content = $modal.find('.modal-body_2');

  // AJAX request -> load data for the modal
  $.get(`/info_modal/${query_id}`)
    // and push it into the modal
    .done(data => $content.html(data));
})


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
      "90px",
      "110px",
      "100px",
      "90px",
      "100px",
      "100px",
      "100px",
      "200px",
      "160px",
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
