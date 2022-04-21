import Alpine from 'alpinejs';


Alpine.data('password_repeat_input', () => ({

  isVisible: false,

  toggleVisibility() {
    console.log('test')
    this.isVisible = !this.isVisible;
  },

}));
