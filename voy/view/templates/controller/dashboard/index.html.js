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
