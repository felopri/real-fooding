import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-spinner/paper-spinner';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

class ImageManager extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Capture your food</h2>
        <paper-input id="imagesUpload" type="file" on-change="${this._uploadImage.bind(this)}"></paper-input>
        <paper-spinner id="spinner" active class="hidden"></paper-spinner>
      </section>
    `;
  }

  _toggleSpinner() {
    this.shadowRoot.querySelector('#spinner').toggleClass('hidden');
  }

  _uploadImage(event) {
    this._toggleSpinner();
    this.image = event.currentTarget.inputElement.inputElement.files[0];
    firebase.auth().onAuthStateChanged(user => {
      let imageStored = 'images/' + user.uid + '/' + this.image.name;

      //Upload image
      var storageRef = firebase.storage().ref(imageStored);
      storageRef.put(this.image).then(() => {
        firebase.storage().ref(imageStored).getDownloadURL().then(url => {
          this._computerVision(url);
        });
      });
    });
  }

  _computerVision(url) {
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
      console.log('');
      this._nutritionAPI(content);
    })();
  }

  _nutritionAPI(content) {
    const tag = content.tags[0].name;
    (async () => {
      const rawResponse = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-app-id': 'e53fecb8',
          'x-app-key': '4f194e8822b65be0405a2ebb3b065e36',
          'x-remote-user-id': '0'
        },
        body: JSON.stringify({query: tag})
      });
      const data = await rawResponse.json();
      console.log();
      this._isRealFood(data.foods[0]);
    })();
  }

  _isRealFood(food) {
    this._toggleSpinner();
    const nutritionValues = this._prepareNutritionData(food);
    (async () => {
      const rawResponse = await fetch('http://172.10.4.17:8082/realfooding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nutritionValues)
      });
      const content = await rawResponse.json();
      console.log('RealFood', content);
      /*this.dispatchEvent(new CustomEvent('result', {
        detail: {
          realfood: content.Results.output1[0]['Scored Labels'],
          score: content.Results.output1[0]['Scored Probabilities']
        }
      }));*/
      window.location.href='/result?realfood=' + content.Results.output1[0]['Scored Labels']
      +'&score='+content.Results.output1[0]['Scored Probabilities'];
    })();
  }

  _prepareNutritionData(food){
    return {
      "Inputs": {
        "input1":
        [
          {
              'item_id': (Math.random()*100000000).toString().substring(0,8),   
              'nf_calories': Math.round(food.nf_calories).toString(), 
              'nf_total_fat': Math.round(food.nf_total_fat).toString(),
              'nf_sodium': Math.round(food.nf_sodium).toString(),    
              'nf_total_carbohydrate': Math.round(food.nf_total_carbohydrate).toString(),    
              'nf_dietary_fiber': Math.round(food.nf_dietary_fiber).toString(),    
              'nf_sugars': Math.round(food.nf_sugars).toString(),    
              'nf_protein': Math.round(food.nf_protein).toString(),   
              'real_food': "" 
              }
          ]
        },
     "GlobalParameters":  {
      }
    };
  }

}

window.customElements.define('image-manager', ImageManager);
