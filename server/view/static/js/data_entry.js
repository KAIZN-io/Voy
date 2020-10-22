$(document).ready(function () {
    // add row
    document.getElementById("add_row").onclick = function () {
      let ticket_row = document.querySelector("tr[data-ticket-row]");
      let ticket_table = document.querySelector("table[data-ticket-table] tbody");

      // copy the row; find the values with 'querySelectorAll'; transform it into an array, which you map
      let ticket_row_clone = ticket_row.cloneNode(true);
      let inputs = ticket_row_clone.querySelectorAll("input, textarea");
      inputs = Array.from(inputs);
      inputs.map(input => input.value = "");

      ticket_table.appendChild(ticket_row_clone);
      console.log("add new row");
    }
    // delete last row of the table
    document.getElementById("remove_row").onclick = function () {
      let rowCount = document.getElementById('data_entry_table').rows.length;
      // if the table has more than 2 row you are allowed to delete the last row
      if (rowCount > 2) {
        document.getElementById("data_entry_table").deleteRow(-1);
      }
    }

    document.getElementById("submit_table").onclick = function () {
      // Disable form submissions if there are invalid fields
      'use strict';
      window.addEventListener('load', function () {
        // Get the forms we want to add validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
          form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    }();
  }

)
