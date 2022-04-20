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


Alpine.data('password_input', () => ({

  score: 0,
  conditions: [],

  isTouched: false,
  areAllConditionsMet: false,

  isVisible: false,

  init() {
    this.updateConditions('');
  },

  evaluatePassword(value) {
    this.isTouched = true;

    this.updatePasswordScore(value);
    this.updateConditions(value);

    this.areAllConditionsMet = this.conditions.every( condition => condition.isValid );
  },

  updatePasswordScore(value) {
    this.score = zxcvbn(value).score;
  },

  updateConditions(value) {
    this.conditions = conditions.map( condition => ({
      label: condition.label,
      isValid: condition.validator(value),
    }));
  },

  toggleVisibility() {
    console.log('test')
    this.isVisible = !this.isVisible;
  },

}));
