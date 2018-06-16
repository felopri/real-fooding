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
        <paper-spinner id="spinner" active></paper-spinner>
      </section>
    `;
  }

  _toggleSpinner() {
    // this._root.getElementById('spinner')
    debugger;
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
      this._isRealFood(data.foods[0]);
    })();
  }

  _isRealFood(food) {
    const nutritionValues = this._prepareNutritionData(food),
      api_key = '9ind3ZwBRx7OOrffFytyblSoJniFoQ0vjlMqUmb+6kU6ZayYsajA0uDIoQb7QqJoZ0JoMRbJyTyqRR9SlFgDNw==';
    (async () => {
      const rawResponse = await fetch('https://europewest.services.azureml.net/workspaces/8de399a4e8794319951b59ce9f7cfd3a/services/483c1bc506a248d1a6e98828bee37170/execute?api-version=2.0&format=swagger', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ api_key
        },
        body: JSON.stringify(nutritionValues)
      });
      const content = await rawResponse.json();
      console.log('RealFood', content);
    })();
  }

  _prepareNutritionData(food){
    return {
      "Inputs": {
        "input1":
        [
          {
              'item_id': "",   
              'nf_calories': food.nf_calories,   
              'nf_calories_from_fat': food.nf_calories/2,   
              'nf_total_fat': food.nf_total_fat,
              'nf_saturated_fat': food.nf_saturated_fat,   
              'nf_trans_fatty_acid': food.nf_saturated_fat,   
              'nf_polyunsaturated_fat': food.nf_saturated_fat,   
              'nf_monounsaturated_fat': food.nf_saturated_fat,
              'nf_cholesterol': food.nf_cholesterol, 
              'nf_sodium': food.nf_sodium,    
              'nf_total_carbohydrate': food.nf_total_carbohydrate,    
              'nf_dietary_fiber': food.nf_dietary_fiber,    
              'nf_sugars': food.nf_sugars,    
              'nf_protein': food.nf_protein,    
              'nf_vitamin_a_dv': food.nf_vitamin_a_dv || 0,    
              'nf_vitamin_c_dv': food.nf_vitamin_c_dv || 0,    
              'nf_calcium_dv': food.nf_calcium_dv || 0,    
              'nf_iron_dv': food.nf_iron_dv || 0,    
              'nf_servings_per_container': '',
              'serving_qty': food.serving_qty,    
              'serving_unit': food.serving_unit, 
              'serving_weight_grams': food.serving_weight_grams,    
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
