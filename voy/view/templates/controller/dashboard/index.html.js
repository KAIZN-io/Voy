import Alpine from 'alpinejs';
import Choices from "choices.js";
import Fuse from 'fuse.js';


Alpine.data('fss', ({ searchKeys }) => ({

  items: [],
  fssItems: [],

  searchInput: '',
  filters: {},

  fuse: undefined,

  init() {
    this.items = generateListDataArray(this.$el);
    this.fssItems = this.items;

    this.fuse = new Fuse(this.items, {
      includeScore: true,
      keys: searchKeys,
    });
  },

  search(input) {
    this.searchInput = input;
    this.update();
  },

  setFilter(key, value) {
    this.filters[key] = value;

    if( isEmpty(value) ) {
      delete this.filters[key];
    }

    this.update();
  },

  update() {
    let fssItems = this.items;

    if(this.searchInput.length > 0) {
      fssItems = this.fuse.search(this.searchInput)
        .map(
          result => result.item
        );
    }

    fssItems = filterObjectList(fssItems, this.filters);

    this.fssItems = fssItems;
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
    isVisible: true,
  };

  item.querySelectorAll('[data-fss-field]').forEach( field => {
    if( field.dataset.fssValue ) {
      data[field.dataset.fssField] = field.dataset.fssValue;
    } else {
      data[field.dataset.fssField] = field.innerHTML.trim()
    }
  } );

  return data;
}

function generateVisibilityMap(listData) {
  const visibilityMap = {};

  listData.forEach( item => {
    visibilityMap[item.uuid] = item.isVisible;
  } );

  return visibilityMap;
}

function filterObjectList(objects, filters) {
  const filterEntries = Object.entries( filters );

  if( filterEntries.length === 0 ) {
    return objects;
  }

  return objects.filter( object => isObjectMatchingFilters(object, filterEntries) );
}

function isObjectMatchingFilters(object, filterEntries) {
  return filterEntries.every( ([ fitlerKey, filterValue ]) => {

    if(Array.isArray( filterValue )) {
      return filterValue.includes( object[fitlerKey] );
    }

    return object[fitlerKey] === filterValue;

  } );
}

function isEmpty(value) {
  if( Array.isArray(value) ) {
    return value.length === 0;
  }

  return !!value;
}
