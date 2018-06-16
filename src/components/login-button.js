import { LitElement, html } from '@polymer/lit-element';
import { ButtonSharedStyles } from './button-shared-styles';

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
      <button on-click="_logIn">Login with Google</button>
    `;
  }

  _logIn() {
    console.log('provider', provider);
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