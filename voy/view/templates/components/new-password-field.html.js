import Alpine from 'alpinejs';
import zxcvbn from 'zxcvbn';


const conditions = [
  {
    label: 'Mininum 12 charactes',
    validator: value => value.length >= 12,
  },
  {
    label: 'One uppercase letter',
    validator: value => /[A-Z]/.test(value),
  },
  {
    label: 'One lowercase letter',
    validator: value => /[a-z]/.test(value),
  },
  {
    label: 'One number',
    validator: value => /\d/.test(value),
  },
];

const scoreMessages = {
  0: 'That\'s not a password.',
  1: 'Criminally weak!',
  2: 'I hope you are not using this for your bank.',
  3: 'We\'re getting somehwere.',
  4: 'Fantasitc!',
};


Alpine.data('new_password_field', () => ({

  isTouched: false,

  score: 0,
  scoreMessage: 'Waiting for input.',

  conditions: [],
  areAllConditionsMet: false,

  isVisible: false,

  init() {
    this.conditions = conditions.map( ({ label }) => ({ label, isValid: false }) )
  },

  evaluatePassword(value) {
    this.isTouched = true;

    this.updateConditions(value)
    this.areAllConditionsMet = this.conditions.every( condition => condition.isValid );

    this.updatePasswordScore(value);

    // Make sure to only show that a password is fantastic, when it meets all
    // hard conditions.
    if( this.score === 4 && !this.areAllConditionsMet ) {
      this.score = 3;
    }

    this.scoreMessage = scoreMessages[this.score];
  },

  updatePasswordScore(value) {
    this.score = zxcvbn(value).score;
  },

  updateConditions(value) {
    // I need to iterate over the existing array, otherwise changes might not
    // get rendered.
    this.conditions.forEach( (condition, index) => {
      condition.isValid = conditions[index].validator(value)
    });
  },

  toggleVisibility() {
    console.log('test')
    this.isVisible = !this.isVisible;
  },

}));
