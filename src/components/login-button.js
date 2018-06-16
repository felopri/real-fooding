import { LitElement, html } from '@polymer/lit-element';
import { ButtonSharedStyles } from './button-shared-styles';
import '@polymer/paper-button/paper-button';

// define the element's class element
class LoginButton extends LitElement {
  _render({_logIn}) {
    return html`
      ${ButtonSharedStyles}
      <style>
        :host {
          display: block;
        }
      </style>
      <paper-button on-click="${() => this._logIn()}">Login with Google</paper-button>
    `;
  }

  _logIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      this.dispatchEvent(new CustomEvent('user-logged', {
        detail: {
          user: result.user,
          credentials: result.credentials
        }
      }));
    }).catch(function (error) {
      alert('Login error. ' + error.code + ' ' + error.message);
    });
  }
}

window.customElements.define('login-button', LoginButton);