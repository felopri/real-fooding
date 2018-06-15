import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';
import {
  setPassiveTouchGestures,
  setRootPath
} from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../styles/fooding-icons.js';
import '../image/image-manager.js';

setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath('/');

class RealFoodingApp extends PolymerElement {
  static get template() {
    return html `
     <style> 
        :host {
          --app-primary-color: #f73859;
          --app-secondary-color: #f3ecc8;
          --app-tertiary-color: #404b69;
          --app-drawer-width: 150px;
          display: block;
        }
      
        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }
      
        @media (min-width: 640px) {
          app-drawer {
            z-index:0;
          }
        }

        app-header {
          color: #fff;
          background-color: var(--app-tertiary-color);
        }
      
        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }
      
        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: black;
          line-height: 40px;
        }
      
        .drawer-list a.iron-selected {
          font-weight: bold;
        }
      
        paper-icon-button:hover {
          color: var(--app-primary-color);
        }
      </style>
      
      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>
      
      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>
      
      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar></app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="route" href="[[rootPath]]image">Image</a>
          </iron-selector>
        </app-drawer>
      
        <!-- Main content -->
        <app-header-layout has-scrolling-region="">
      
          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="fooding-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">Real Fooding</div>
              <paper-icon-button icon="power-settings-new" title="Log out" on-click="logout"></paper-icon-button>
            </app-toolbar>
          </app-header>
      
          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <image-manager name="image" route="[[subroute]]"></image-manager>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>

    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true
      },
      routeData: Object,
      subroute: Object,
      appInitialized: Boolean
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  constructor() {
    super();
    this._initializeFirebaseApp();
  }

  _initializeFirebaseApp() {
    if (!this.appInitialized) {
      var config = {
        apiKey: "AIzaSyD67FXv2kXAFAFTITru3_UH63VXeYQRURk",
        authDomain: "real-fooding-5e029.firebaseapp.com",
        databaseURL: "https://real-fooding-5e029.firebaseio.com",
        projectId: "real-fooding-5e029",
        storageBucket: "real-fooding-5e029.appspot.com",
        messagingSenderId: "372037266043"
      };
      firebase.initializeApp(config);
      this.appInitialized = true;
    }
  }


  _routePageChanged(page) {
    if (!this.appInitialized) {
      this._initializeFirebaseApp();
    }
    if (['login'].indexOf(page) !== -1 || Object.is(page, '')) {
      this.page = 'login';
      this.set('route.path', 'login');
    } else {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          this.page = page;
        } else {
          this.page = 'login';
          this.set('route.path', 'login');
        }
      });
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _navigateToPath(path) {
    this.set('route.path', path);
  }

  _navigateToRoute() {
    this._navigateToPath('route');
  }
  _navigateToGames(event) {
    this._navigateToPath('games');
  }
  _navigateToGame(event) {
    this._navigateToPath('game/' + event.detail.gameId);
  }
  _navigateToReview() {
    this._navigateToPath('review');
  }

  logout() {
    firebase.auth().signOut();
  }

}

window.customElements.define('real-fooding-app', RealFoodingApp);