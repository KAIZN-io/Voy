import Alpine from 'alpinejs';
import Choices from 'choices.js';
import FindFilterSortList from '~/assets/js/FindFilterSortList';


Alpine.data('ffs_list', ({ search, sort }) => ({

  items: [],
  itemMap: {},

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
