import $ from 'jquery';


$('#requery_Modal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget) // Button that triggered the modal
  let query_id = button.data('id') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  let $modal = $(this);

  // set query id as value
  $modal.find('.query_id-data').val(query_id);

  let $title = $modal.find('.modal-title');
  let $content = $modal.find('.modal-body_1');

  $title.text(`Requery Dialog | Query ID: ${query_id}`);

  // NOTE: recognize the `` !
  // AJAX request -> load data for the modal
  $data = $.get(`/modal_data/${query_id}`)
    // and push it into the modal
    .done($data => $content.html($data))

})
