import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import '@polymer/paper-input/paper-input.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class ImageManager extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Real Fooding</h2>
        <h4>Capture your food</h4>
        <paper-input id="imagesUpload" type="file" on-change="${this._uploadImage}"></paper-input>
      </section>
    `;
  }

  _uploadImage(event) {
    firebase.auth().onAuthStateChanged(user => {
      this.image = this.inputElement.inputElement.files[0];
      let imageStored = 'images/' + user.uid + '/' + this.image.name;

      //Upload image
      var storageRef = firebase.storage().ref(imageStored);
      storageRef.put(this.image).then(() => {
        firebase.storage().ref(imageStored).getDownloadURL().then(url => {
          console.log('Image URL:', url);
        });
      });
    });
  }

}

window.customElements.define('image-manager', ImageManager);
