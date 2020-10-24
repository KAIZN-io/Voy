$('#requery_Modal').on('show.bs.modal', function (event) {
  let button   = $(event.relatedTarget) // Button that triggered the modal
  let query_id = button.data('id') // Extract info from data-* attributes
  let $modal   = $(this);
  let $title   = $modal.find('.modal-title');
  let $content = $modal.find('.modal-body_1');

  // Set query id as value
  $modal.find('input.query_id').val(query_id);

  // Update the modal Title
  $title.text(`Requery Dialog | Query ID: ${query_id}`);

  // AJAX request -> load data for the modal
  $data = $.get(`/modal_data/${query_id}`)
    // and push it into the modal
    .done($data => $content.html($data))
})
