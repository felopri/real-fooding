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
        <h2>Capture your food</h2>
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
          //this._computerVision(url);
          (async () => {
            const rawResponse = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-app-id': 'e53fecb8',
                'x-app-key': '4f194e8822b65be0405a2ebb3b065e36',
                'x-remote-user-id': '0'
              },
              body: new FormData({query:'apple'})
            });
            const data = await rawResponse.json();
            console.log(data);
            //this._isRealFood(data);
          })();
        });
      });
    });
  }

  /*_computerVision(url) {
    (async () => {
      const rawResponse = await fetch('https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Categories, Tags, Description&language=en', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': 'ccbe677fecfe4e9a891b94e6ec6ae286'
        },
        body: JSON.stringify({url})
      });
      const content = await rawResponse.json();
      this._nutritionAPI(content);
    })();
  }*/

  _nutritionAPI(content) {
    (async () => {
      let formData = new FormData();
      formData.append('query', 'apple');
      const rawResponse = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: formData
      });
      const data = await rawResponse.json();
      this._isRealFood(data);
    })();
  }

  _isRealFood(data) {
    console.log(data);
  }

}

window.customElements.define('image-manager', ImageManager);
