import Alpine from 'alpinejs';
import Choices from "choices.js";
import FindFilterSortList from '~/assets/js/FindFilterSortList';


Alpine.data('ffs', ({ searchKeys }) => ({

  items: [],

  ffs: undefined,

  init() {
    const items = generateListDataArray(this.$el);

    this.ffs = new FindFilterSortList(items, { searchKeys });
    this.items = this.ffs.getResults();
  },

  search(input) {
    this.ffs.setSearchTerm(input);

    this.update();
  },

  setFilter(key, value) {
    this.ffs.setFilter(key, value);

    this.update();
  },

  setSortingOrder(key) {
    this.ffs.setSortingOrder(key);

    this.update();
  },

  update() {
    this.items = this.ffs.getResults();
  },

  initSelect(el) {
    el.choices = new Choices(el);
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
