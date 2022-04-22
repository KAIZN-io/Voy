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

  item.querySelectorAll('[data-fss-field]').forEach( field =>
    data[field.dataset.fssField] = getFieldValue(field)
  );

  return data;
}

function generateVisibilityMap(listData) {
  const visibilityMap = {};

  listData.forEach( item => {
    visibilityMap[item.uuid] = item.isVisible;
  } );

  return visibilityMap;
}

function getFieldValue(field) {
  let value = field.dataset.fssValue ?? field.innerHTML.trim();

  if( isJsonArray(value) ) {
    value = JSON.parse( value );
  }

  return value;
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
    const valueArray       = toArray( object[fitlerKey] );
    const filterValueArray = toArray( filterValue );

    return valueArray.find( value => filterValueArray.includes( value ) );
  } );
}

function toArray(value) {
  if( Array.isArray( value ) ) {
    return value;
  }

  return [ value ];
}

function isEmpty(value) {
  if( Array.isArray(value) ) {
    return value.length === 0;
  }

  return !!value;
}

function isJsonArray(jsonString){
    try {
        const result = JSON.parse( jsonString );

        return result && Array.isArray(result);

    } catch ( error ) { }

    return false;
};
