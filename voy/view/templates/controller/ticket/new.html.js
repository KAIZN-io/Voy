import Alpine from 'alpinejs';
import Choices from "choices.js";
import { v4 as uuidv4 } from 'uuid';


Alpine.data('ticket_new', () => ({
  tickets: [{
    uuid: uuidv4()
  }],

  addTicket() {
    this.tickets.push({
      uuid: uuidv4(),
    });
  },

  removeTicketByUuid(uuid) {
    this.removeTicketAtIndex(
      this.tickets.findIndex( ticket => ticket.uuid === uuid )
    );
  },

  removeTicketAtIndex(index) {
    this.tickets.splice(index, 1);
  },

  initSelect(el) {
    new Choices(el);
  }

}));
