import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

class ResultView extends PageViewElement {
  _render(props, _realFooding, _score) {
    return html`
       ${SharedStyles}
      <style>
        .col {
          text-align: center;
        }
      </style>
      <section>
        <h2>Results</h2>
        <div class="col">
          ${this._realFooding !== '0'
          ? html`<img src="../images/realfood.png" alt="RealFood">`
          : html`<img src="../images/ultraprocesado.png" alt="Ultraprocesado">`}
          <h3>${this._score}</h3>
        </div>
      </section>
    `;
  }

  static get properties() {
    return {
      _realFooding: {
        type: String,
        value: ''
      },
      _score: {
        type: String,
        value: ''
      }
    }
  }

  _firstRendered() {
    this._getResult();
  }

  _getResult() {
    let url = window.location.href;
    url = url.split('?')[1].split('&');
    this._realFooding = url[0].split('=')[1];
    this._score = url[1].split('=')[1];
  }

  _stateChanged(state) {
    this._page = state.app.page;
  }

}

window.customElements.define('result-view', ResultView);
