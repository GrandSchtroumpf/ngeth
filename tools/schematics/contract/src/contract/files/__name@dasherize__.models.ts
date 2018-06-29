import { Observable } from 'rxjs';
import { PromiEvent } from '@ngeth/eth';

export interface I<%= classify(name) %>Contract {
  <% if(dec.calls) { %>
  // Calls methods
  calls: {
    <%= dec.calls %>
  }
  <% } %>
  <% if(dec.sends) { %>
  // Sends methods
  sends: {
    <%= dec.sends %>
  }
  <% } %>
  <% if(dec.events) { %>
  // Events
  events: {
    <%= dec.events %>
  }
  <% } %>
}

<%= interfaces %>
