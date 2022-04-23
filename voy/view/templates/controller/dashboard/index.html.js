import Alpine from 'alpinejs';
import Choices from "choices.js";
import FilterSortSearchList from '~/assets/js/FilterSortSearchList';


Alpine.data('fss', ({ searchKeys }) => ({

  items: [],

  fss: undefined,

  init() {
    const items = generateListDataArray(this.$el);

    this.fss = new FilterSortSearchList(items, { searchKeys })
  },

  search(input) {
    this.fss.setSearchTerm(input);

    this.update();
  },

  setFilter(key, value) {
    this.fss.setFilter(key, value);

    this.update();
  },

  setSortingOrder(key) {
    this.fss.setSortingOrder(key);

    this.update();
  },

  update() {
    this.items = this.fss.getResults();
  },

  initSelect(el) {
    el.choices = new Choices(el);
  },

}));

function generateListDataArray(rootElement) {
  return Array.from(
    rootElement.querySelectorAll('[data-fss-item-uuid]')
  ).map(
    item => generateItemDataObject(item)
  );
}

function generateItemDataObject(item) {
  const data = {
    uuid: item.dataset.fssItemUuid,
  };

  item.querySelectorAll('[data-fss-field]').forEach( field =>
    data[field.dataset.fssField] = getFieldValue(field)
  );

  return data;
}

function getFieldValue(field) {
  let value = field.dataset.fssValue ?? field.innerHTML.trim();

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
