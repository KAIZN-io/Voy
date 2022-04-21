import Alpine from 'alpinejs';


Alpine.data('password_field', () => ({

  isVisible: false,

  toggleVisibility() {
    console.log('test')
    this.isVisible = !this.isVisible;
  },

}));
