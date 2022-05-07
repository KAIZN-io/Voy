import Alpine from 'alpinejs';
import Choices from "choices.js";


Alpine.data('choice_js', () => ({

  instance: undefined,

  init() {

    this.instance = new Choices(this.$el, {
      callbackOnInit: function() {
        if(this.passedElement.element.autofocus) {
          this.showDropdown();
          this.input.focus();
        }
      }
    });

    // If this is a multiple select. Apply event listener to fix the details on
    // the change event
    if( this.instance.input.type === 'select-multiple' ) {
      this.$el.addEventListener('change', old_event => {

        // Do we have an array of selected options in the event? If not, continue.
        if( Array.isArray( old_event.detail.value ) ) {
          return
        }

        // The old event is not usable, immediately stop it.
        old_event.stopImmediatePropagation();

        // Construct a new event with a list of all selected values.
        const new_event = new old_event.constructor(
          old_event.type,
          {
            detail: {
              value: this.instance.getValue().map( choice => choice.value )
            }
          }
        );

        // Dispatch the new event.
        this.$el.dispatchEvent(new_event);
      });
    }
  },

}));
