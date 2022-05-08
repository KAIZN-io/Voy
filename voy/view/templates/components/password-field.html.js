import Alpine from 'alpinejs';


Alpine.data('password_field', () => ({

  isVisible: false,

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  },

}));
