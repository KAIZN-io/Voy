import Alpine from 'alpinejs';
import Choices from 'choices.js';
import FindFilterSortList from '~/assets/js/FindFilterSortList';


Alpine.data('item_list', ({ search, sort }) => ({

  items: [],

  ffs: undefined,

  init() {
    const items = generateListDataArray(this.$el);

    this.ffs = new FindFilterSortList( items, { searchKeys: search.keys } );
    sort.forEach(({ key, direction }) =>  this.ffs.addSortingKey( key, direction ) )
    this.items = this.ffs.getResults();
  },

  setSearch(input) {
    this.ffs.setSearchTerm(input);
    this.update();
  },

  setSearchFromInputEvent(event) {
    this.setSearch(event.target.value)
  },

  setFilter(key, value) {
    this.ffs.setFilter(key, value);
    this.update();
  },

  setFilterFromChangeEvent(key, event) {
    this.setFilter(key, event.detail.value)
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
    this.items = this.ffs.getResults();
  },

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
