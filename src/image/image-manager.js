import {
    html,
    PolymerElement
} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker-light.js';
import '../styles/shared-styles.js';

class ImageManager extends PolymerElement {
    static get template() {
        return html `
            <style include="shared-styles">
                paper-input {
                    color: green;
                }
            </style>
            <div class="card">
                <paper-input id="imagesUpload" type="file" on-change="_filesChanged"></paper-input>
            </div>
        `;
    }

    static get is() {
        return 'image-manager';
    }

    _filesChanged(event) {
        this.image = this.$.imagesUpload.inputElement.inputElement.files[0];
        console.log(this.image);
    }

}

window.customElements.define(ImageManager.is, ImageManager);