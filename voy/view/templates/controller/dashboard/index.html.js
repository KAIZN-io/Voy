import Alpine from 'alpinejs';
import Choices from 'choices.js';
import FindFilterSortList from '~/assets/js/FindFilterSortList';

import downloadObjectsAsCSV from '../../../assets/js/helper/downloadObjectsAsCSV';


Alpine.data('ffs_list', ({ search, sort }) => ({

  items: [],
  itemMap: {},
  closedItems: new Set(),

  ffs: undefined,

  init() {
    const items = generateListDataArray(this.$el);

    this.ffs = new FindFilterSortList( items, { searchKeys: search.keys } );
    sort.forEach(({ key, direction }) =>  this.ffs.addSortingKey( key, direction ) )
    this.update();
  },

  updateSearchTerm(input) {
    this.ffs.updateSearchTerm(input);
    this.update();
  },

  updateSearchFromInputEvent(event) {
    this.updateSearchTerm(event.target.value)
  },

  updateFilter(key, value) {
    this.ffs.updateFilter(key, value);
    this.update();
  },

  updateFilterFromChangeEvent(key, event) {
    this.updateFilter(key, event.detail.value)
  },

  setSortFromChangeEvent(event) {
    this.ffs.resetSortingOrder();

    const order = event.target.value.split(',');

    order.forEach( value => {
      const [ key, direction ] = value.split('|');

      this.ffs.addSortingKey( key.trim(), direction.trim() )
    });

    this.update();
  },

  update() {
    const rawItems = this.ffs.getResults();

    const newItems = [];
    const newItemMap = {};

    rawItems.forEach( ( rawItem, index ) => {

      const newItem = {
        ordinal: index,
        ...rawItem
      };

      newItems.push(newItem);
      newItemMap[newItem.uuid] = newItem;

    });

    this.items = newItems;
    this.itemMap = newItemMap;
  },

  onTicketClosed( event ) {
    this.closedItems.add( event.detail.uuid );
  },

  downloadCurrentListAsXlsx() {
    const header = {
      internal_id: 'Query ID',

      working_days_open: 'Open in Days',
      study_id: 'Study',
      source_number: 'Screening Number',

      visit: 'Visit',
      page: 'Page',
      procedure: 'Procedure',
      description: 'Description',

      tags: 'Tags',

      created_at: 'Open since',
      assignee: 'Assignee',
      reporter: 'Reporter',
    };

    const tickets = this.items
      .filter( item => !this.closedItems.has( item.uuid ) )
      .map( item => ({
        internal_id:       item.internal_id,

        working_days_open: item.working_days_open,
        study_id:          item.study_id,
        source_number:     item.source_number,

        visit:             item.visit,
        page:              item.page,
        procedure:         item.procedure,
        description:       item.description,

        tags:              item.tags.join(', '),

        created_at:        item.created_at_formatted,
        assignee:          item.assignee,
        reporter:          item.reporter,
      }) );

    downloadObjectsAsCSV( header, tickets, {
      filename: `Queries Export`,
      sheetname: `Open Queries`,
    } );
  }

}));


Alpine.data('ffs_item', ({ uuid, endpoints }) => ({

  uuid,

  isExpanded: false,
  isClosed: false,

  toggleIsExpanded() {
    this.isExpanded = !this.isExpanded;
  },

  close() {
    fetch( endpoints.close )
      .then( () => this.isClosed = true );
  }

}));


function generateListDataArray(rootElement) {
  return Array.from(
    rootElement.querySelectorAll('[data-ffs-item-uuid]')
  ).map(
    item => generateItemDataObject(item)
  );
}

function generateItemDataObject(item) {
  const data = {
    uuid: item.dataset.ffsItemUuid,
  };

  item.querySelectorAll('[data-ffs-field]').forEach( field =>
    data[field.dataset.ffsField] = getFieldValue(field)
  );

  return data;
}

function getFieldValue(field) {
  let value = field.dataset.ffsValue ?? field.innerHTML.trim();

  if( isJsonArray(value) ) {
    value = JSON.parse( value );
  }

  return value;
}

function isJsonArray(jsonString){
    try {
        const result = JSON.parse( jsonString );

        return result && Array.isArray(result);

    } catch ( error ) { }

    return false;
};
