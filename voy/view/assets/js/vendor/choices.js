import Alpine from 'alpinejs';
import Choices from "choices.js";


Alpine.data('choice_js', () => ({

  instance: undefined,

  init() {
    this.instance =  new Choices(this.$el, {
      callbackOnInit: function() {
        if(this.passedElement.element.autofocus) {
          this.showDropdown();
          this.input.focus();
        }
      }
    })
  },

}));
