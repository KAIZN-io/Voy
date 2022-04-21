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
  2: 'I hope you are not using this for you Bank.',
  3: 'We\'re getting somehwere.',
  4: 'Fantasitc!',
};


Alpine.data('password_input', () => ({

  isTouched: false,

  score: 0,
  scoreMessage: 'Waiting for input.',

  conditions: [],
  areAllConditionsMet: false,

  isVisible: false,

  init() {
    this.conditions = this.getEvaluatedConditions('');
  },

  evaluatePassword(value) {
    this.isTouched = true;

    this.conditions = this.getEvaluatedConditions(value);
    this.areAllConditionsMet = this.conditions.every( condition => condition.isValid );

    this.score = this.getPasswordScore(value);

    // Make sure to only show that a password is fantastic, when it meets all
    // hard conditions.
    if( this.score === 4 && !this.areAllConditionsMet ) {
      this.score = 3;
    }

    this.scoreMessage = scoreMessages[this.score];
  },

  getPasswordScore(value) {
    return zxcvbn(value).score;
  },

  getEvaluatedConditions(value) {
    return conditions.map( condition => ({
      label: condition.label,
      isValid: condition.validator(value),
    }));
  },

  toggleVisibility() {
    console.log('test')
    this.isVisible = !this.isVisible;
  },

}));
