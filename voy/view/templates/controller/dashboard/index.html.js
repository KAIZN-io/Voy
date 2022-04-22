import Alpine from 'alpinejs';
import Fuse from 'fuse.js';


Alpine.data('fss', ({ searchKeys }) => ({

  items: [],
  fssItems: [],

  searchInput: '',

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

  update() {
    let fssItems = this.items;

    if(this.searchInput.length > 0) {
      fssItems = this.fuse.search(this.searchInput).map( result => result.item );
    }

    this.fssItems = fssItems;
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
    data[field.dataset.fssField] = field.innerHTML.trim()
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
