import { LitElement, html } from '@polymer/lit-element';
import { ButtonSharedStyles } from './button-shared-styles';
import '@polymer/paper-button/paper-button.js';

// define the element's class element
class LoginButton extends LitElement {
  _render() {
    return html`
      ${ButtonSharedStyles}
      <style>
        :host {
          display: block;
        }
      </style>
      <paper-button raised noink class="red" on-click="${this.logIn}">Login with Google</paper-button>
    `;
  }

  logIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      this.dispatchEvent(new CustomEvent('user-logged', {
        detail: {
          user: result.user
        }
      }));
    }).catch(function (error) {
      alert('Login error. ' + error.code + ' ' + error.message);
    });
  }
}

window.customElements.define('login-button', LoginButton);