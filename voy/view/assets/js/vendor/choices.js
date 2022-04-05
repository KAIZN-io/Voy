import Choices from "choices.js";


document.querySelectorAll('[data-choice-js]')
  .forEach( input => new Choices(input) );
