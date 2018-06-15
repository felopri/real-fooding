import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';
import { ButtonSharedStyles } from './button-shared-styles.js';

class MyView3 extends PageViewElement {
  _render({}) {
    return html`
      ${SharedStyles}
      ${ButtonSharedStyles}
      <style>
        /* Add more specificity (.checkout) to workaround an issue in lit-element:
           https://github.com/PolymerLabs/lit-element/issues/34 */
        button.checkout {
          border: 2px solid var(--app-dark-text-color);
          border-radius: 3px;
          padding: 8px 16px;
        }
        button.checkout:hover {
          border-color: var(--app-primary-color);
          color: var(--app-primary-color);
        }
      </style>

      <section>
        <h2>View 3</h2>

        <p>Loren ipsun</p>
      </section>
    `;
  }

  static get properties() { return {
    // This is the data from the store.
  }}

}

window.customElements.define('my-view3', MyView3);
