var filtersConfig = {
  // instruct TableFilter location to import ressources from
  base_path: "https://unpkg.com/tablefilter@latest/dist/tablefilter/",
  // define the user help with 'help_instructions'
  help_instructions: false,
  // you can disable it
  popup_filters: true,
  // selecting with a drop-down
  col_0: "select",
  col_1: "checklist",
  col_3: "select",
  // no filter for the last column
  col_9: "none",
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
  rows_counter: {text: "Queries : "},
  highlight_keywords: true,
  col_widths: [
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
  themes: [
    {
      name: "transparent",
    },
  ],
};

var tf = new TableFilter("query_table", filtersConfig);
tf.init();
