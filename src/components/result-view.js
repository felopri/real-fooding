import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import '@polymer/paper-input/paper-input.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class ResultView extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Real Fooding</h2>
        <h4>Results:</h4>
        <p>Is Real Food</p>
      </section>
    `;
  }

}

window.customElements.define('result-view', ResultView);
