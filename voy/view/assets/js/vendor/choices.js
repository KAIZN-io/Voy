import Choices from "choices.js";


document.querySelectorAll('[data-choice-js]')
  .forEach( input => new Choices(input, {
    callbackOnInit: function() {
      if(this.passedElement.element.autofocus) {
        this.showDropdown();
        this.input.focus();
      }
    }
  }) );
