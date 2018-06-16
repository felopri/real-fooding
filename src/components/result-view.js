import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

class ResultView extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Results</h2>
        <p>Is Real Food</p>
      </section>
    `;
  }

}

window.customElements.define('result-view', ResultView);
