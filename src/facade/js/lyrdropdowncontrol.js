/**
 * @module M/control/LyrdropdownControl
 */

import LyrdropdownImplControl from 'impl/lyrdropdowncontrol';
import template from 'templates/lyrdropdown';
import { getValue as getValueTranslate} from './i18n/language'; //e2m: Multilanguage support. Alias -> getValue is too generic

export default class LyrdropdownControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(values) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(LyrdropdownImplControl)) {
      M.exception('La implementación usada no puede crear controles LyrdropdownControl');
    }
    // 2. implementation of this control
    const impl = new LyrdropdownImplControl();
    super(impl, 'Lyrdropdown');

    //Getting Plugin Parameters

    /**
     * Position plugin
     * @public
     * @type {String}
     */
    this.pluginOnLeft = values.pluginOnLeft;

    /**
     * All layers
     * @public
     * @public {Array}
     */
    this.layers = values.layers;

    /**
     * Collapsible
     * @public
     * @public {boolean}
     */
    this.collapsible = values.collapsible;

    /**
     * Collapsed
     * @public
     * @public {boolean}
     */
    this.collapsed = values.collapsed;

    /**
     * layerSelected
     * @public
     * @type { M.layer }
     */
    this.layerSelected = null;

    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;



    // captura de customevent lanzado desde impl con coords
    window.addEventListener('mapclicked', (e) => {
      this.map_.addLabel('Hola Mundo!', e.detail);
    });

  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    
    this.map = map;

    return new Promise((success, fail) => {

      //e2m: Transform stringLyr definition to apicnigLyr
      this.layers = this.transformToLayers(this.layers);

      //e2m: getting layers array with name and legend for plugin
      let capas = this.layers.map(function(layer) {
        return layer instanceof Object ? {  name: layer.name,legend: layer.legend} : { name: layer, legend: layer };
      });

      //e2m: adding language dictionary
      let options = '';
      if (capas.length > 1) {
        options = {
          jsonp: true,
          vars: {
              options: capas,
              translations: {
                tooltip: getValueTranslate('tooltip'),
                nolayertext: getValueTranslate('nolayertext'),
              } 
          }
        };
      }

      //e2m: config a helper in Handlebars for embedding conditionals in template
      Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if(v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      });

      this.template = M.template.compileSync(template, options);

      //Si no hay capas a las que aplicar la transparencia, el plugin no funciona e informa
      if (this.layers.length == 0) {
        M.dialog.error(getValueTranslate('no_layers_plugin'));
      } else {
        //M.dialog.info(getValueTranslate('title'));
        this.activate();
      }

      

      //Events on template component
      this.template.querySelector('#m-lyrdropdown-selector').addEventListener('change', (evt) => {
        
        const layerSel = this.layers.filter(function(layer) {
          return layer.name === evt.target.value
        });//Get selected layer from layer array

        this.layerSelected.setVisible(false);
        this.removeEffects();
        if (layerSel.length===0){
          return;//No layer option is selected
        }

        this.layerSelected = layerSel[0];
        this.getImpl().setLayer(this.layerSelected);
        
      });

      // Añadir código dependiente del DOM
      success(this.template);
      console.log(`Funciona. Capas disponibles: ${this.layers.length}`);

    });
  
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {

   if (this.layerSelected === null) this.layerSelected = this.layers[0];
   let names = this.layers.map(function(layer) {
     return layer instanceof Object ? { name: layer.name } : { name: layer };
   });

   if (names.length >= 1) {
     this.template.querySelector('#m-lyrdropdown-selector').disabled = false;
   }

  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {

    if (this.layerSelected === null) this.layerSelected = this.layers[0];
    let names = this.layers.map(function(layer) {
      return layer instanceof Object ? { name: layer.name } : { name: layer };
    });
    
    this.removeEffects();
    this.layerSelected.setVisible(false);
    if (names.length >= 1) {
      this.template.querySelector('#m-lyrdropdown-selector').disabled = true;
    }
  }
  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-lyrdropdown button');
  }


  /**
   * This function is called to remove the effects
   *
   * @public
   * @function
   * @api stable
   */
  removeEffects() {
    this.getImpl().removeEffects();
  }


  /**
   * Transform StringLayers to Mapea M.Layer
   * 
   * WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA
   * WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo
   *
   * @public
   * @function
   * @api stable
   * @param {string}
   * @return
   */
  transformToLayers(layers) {
    const transform = layers.map(function(layer) {
      let newLayer = null;
      if (!(layer instanceof Object)) {
        if (layer.indexOf('*') >= 0) {
          const urlLayer = layer.split('*');
          if (urlLayer[0].toUpperCase() == 'WMS') {
            newLayer = new M.layer.WMS({
              url: urlLayer[2],
              name: urlLayer[3]
            });
            this.map.addLayers(newLayer);
          } else if (urlLayer[0].toUpperCase() == 'WMTS') {
            newLayer = new M.layer.WMTS({
              url: urlLayer[2],
              name: urlLayer[3]
            });
            this.map.addLayers(newLayer);
          }
        } else {
          const layerByName = this.map.getLayers().filter(l => layer.includes(l.name))[0];
          newLayer = this.isValidLayer(layerByName) ? layerByName : null;
        }
      } else if (layer instanceof Object) {
        const layerByObject = this.map.getLayers().filter(l => layer.name.includes(l.name))[0];
        newLayer = this.isValidLayer(layerByObject) ? layerByObject : null;
      }
      if (newLayer !== null) {
        newLayer.displayInLayerSwitcher = false;
        newLayer.setVisible(false);
        return newLayer
      } else {
        this.layers.remove(layer);
      }
    }, this);
    return (transform[0] === undefined) ? [] : transform;
  }

  /**
   * This function transform string to M.Layer
   *
   * @public
   * @function
   * @api stable
   * @param {string}
   * @return {Boolean}
   */
  isValidLayer(layer) {
    return layer.type === 'WMTS' || layer.type === 'WMS';
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof LyrdropdownControl;
  }

  // Add your own functions


}
