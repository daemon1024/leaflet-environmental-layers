const layers = require("./info.json");

let layers0 = [],layers1 = [],layers2 = [],layers3 = [],layers4 = [],layers5 = [],layers6 = [];

for (let key in layers) {
  if (layers.hasOwnProperty(key)) {
    let layer = layers[key];
    if(layer.layer_group == 0){
      layers0.push(key)
    }
    if(layer.layer_group == 1){
      layers1.push(key)
    }
    if(layer.layer_group == 3){
      layers3.push(key)
    }
    if(layer.layer_group == 6){
      layers6.push(key)
    }
  }
}
layers0.push("purpleLayer")
layers1.push("purpleairmarker")
layers2 = layers.openInfraMap.layers;
layers4 = layers.justiceMap.layers;
layers5 = layers.openWeatherMap.layers;

L.LayerGroup.environmentalLayers = L.LayerGroup.extend(

  {
    options: {
      simpleLayerControl: false,
      hash: false,
      embed: false,
      addLayersToMap: false, // activates layers on map by default if true.
      currentHash: location.hash,
      // Source of Truth of Layers name .
      // please put name of Layers carefully in the the appropriate layer group.
      layers0: layers0,
      layers1: layers1,
      layers2: layers2,
      layers3: layers3,
      layers4: layers4,
      layers5: layers5,
      layers6: layers6,

    },

    initialize: function(param) {
      L.Util.setOptions(this, param);
      param = param || {};

      this.options.addLayersToMap = !!param.include ? param.addLayersToMap : false;

      param.all = [...this.options.layers0, ...this.options.layers1, ...this.options.layers2, ...this.options.layers3, ...this.options.layers4, ...this.options.layers5, ...this.options.layers6];
      if (!param.include || !param.include.length) {
        param.include = param.all;
      }
      if (!!param.exclude && param.exclude.length > 0) {
        param.include =param.include.filter(function(a) {
          return param.exclude.indexOf(a) == -1;
        });
      }

      this.options.layers = param;

      this._OpenInfraMap_Power = L.tileLayer('https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }).on('tileerror', function() {
        this.onError('Power', true)
      })
      this._OpenInfraMap_Petroleum = L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }).on('tileerror', function() {
        this.onError('Petroleum', true)
      })
      this._OpenInfraMap_Telecom = L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }).on('tileerror', function() {
        this.onError('Telecom', true)
      })
      this._OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }).on('tileerror', function() {
        this.onError('Water', true)
      });

    },

    onAdd: function(map) {
      this._map = map;
      this.overlayMaps = {};
      this.groupedOverlayMaps = {}; // For grouping layers in the new menu
      var defaultBaseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/jywarren/ckj06ujnc1nmi19nuelh46pr9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoianl3YXJyZW4iLCJhIjoiVzVZcGg3NCJ9.BJ6ArUPuTs1JT9Ssu3K8ig', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      var baseMaps = this.options.baseLayers ? this.options.baseLayers : { "Grey-scale": defaultBaseLayer.addTo(map) };

      for (let layer of this.options.layers.include) {
        if (this.options.layers0.includes(layer)) {
          this.overlayMaps[layer] = window['L']['layerGroup'][layer]();
          switch(layer) {
            case 'purpleLayer':
              if (!this.groupedOverlayMaps.purpleair) {
                this.groupedOverlayMaps.purpleair = { category: 'group', layers: {} };
                this.groupedOverlayMaps.purpleair.layers[layer] = this.overlayMaps[layer];
              } else {
                this.groupedOverlayMaps.purpleAir.layers[layer] = this.overlayMaps[layer];
              };
              break;
            default:
              this.groupedOverlayMaps[layer] = this.overlayMaps[layer]; 
          }
        }
        else if (this.options.layers1.includes(layer)) {
          this.overlayMaps[layer] = window['L']['layerGroup']['layerCode'](layer);
          switch(layer) {
            case 'purpleairmarker':
              if (!this.groupedOverlayMaps.purpleair) {
                this.groupedOverlayMaps.purpleair = { category: 'group', layers: {} };
                this.groupedOverlayMaps.purpleair.layers[layer] = this.overlayMaps[layer];
              } else {
                this.groupedOverlayMaps.purpleair.layers[layer] = this.overlayMaps[layer];
              }
              break;
            default:
              this.groupedOverlayMaps[layer] = this.overlayMaps[layer];
          }
        }
        else if (this.options.layers2.includes(layer)) {
          if(!this.groupedOverlayMaps.OpenInfraMap) {
            this.groupedOverlayMaps.OpenInfraMap = { category: 'group', layers: {} };
          }
          
          switch (layer) {
          case 'Power':
            this.overlayMaps[layer] = this._OpenInfraMap_Power;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          case 'Petroleum':
            this.overlayMaps[layer] = this._OpenInfraMap_Petroleum;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          case 'Telecom':
            this.overlayMaps[layer] = this._OpenInfraMap_Telecom;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          case 'Water':
            this.overlayMaps[layer] = this._OpenInfraMap_Water;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          }
        }
        else if (this.options.layers3.includes(layer)) {
          this.overlayMaps[layer] = window[layer + 'Layer'](map);
          this.groupedOverlayMaps[layer] = this.overlayMaps[layer];
        }
        else if (this.options.layers4.includes(layer)) {
          if(!this.groupedOverlayMaps.Justicemap) {
            this.groupedOverlayMaps.Justicemap = { category: 'group', layers: {} };
          }
          this.overlayMaps[layer] = window['L']['tileLayer']['provider']('JusticeMap.'+layer).on('tileerror', function() {
            this.onError(layer, true);
          });
          this.groupedOverlayMaps.Justicemap.layers[layer] = this.overlayMaps[layer];
        }
        else if (this.options.layers5.includes(layer)) {
          if(!this.groupedOverlayMaps['Open Weather Map']) {
            this.groupedOverlayMaps['Open Weather Map'] = { category: 'group', layers: {} };
          }
          let obj = {};
          if (layer === 'clouds') {
            obj = {showLegend: true, opacity: 0.5};
          }
          if (layer === 'city') {
            layer = 'current';
            obj = {
              intervall: 15,
              minZoom: 3,
              imageLoadingUrl: this.options.imageLoadingUrl
            };
            this.overlayMaps[layer] = window['L']['OWM'][layer](obj).on('owmloadingend', function() {
              this.onError(layer, true);
            })
          } else {
            this.overlayMaps[layer] = window['L']['OWM'][layer](obj).on('tileerror', function() {
              this.onError(layer, true);
            });
          }
          
          this.groupedOverlayMaps['Open Weather Map'].layers[layer] = this.overlayMaps[layer];
        }
        else if (this.options.layers6.includes(layer)) {
          this.overlayMaps[layer] = window['L']['geoJSON'][layer]();
          this.groupedOverlayMaps[layer] = this.overlayMaps[layer];
        }
        else {
          console.log('Incorrect Layer Name');
        }
      }

      var leafletControl = this.options.simpleLayerControl ? 
      L.control.layers(baseMaps, this.overlayMaps).addTo(map) :
      L.control.layersBrowser(baseMaps, this.groupedOverlayMaps).addTo(map);

      // set the map menu to the correct size
      if (typeof leafletControl.setLayersBrowserSize === 'function') {
        map.on('resize', function () {
          leafletControl.setLayersBrowserSize(map);
        });
        leafletControl.setLayersBrowserSize(map);
      }

      var modeControl = new L.control.minimalMode(leafletControl);
      modeControl.addTo(map);

      if (this.options.embed) {
        this.options.hostname ? (
          L.control.embed({
            hostname: this.options.hostname,
          }).addTo(map)
        ) : L.control.embed().addTo(map);
      }

      var allMaps = Object.assign(baseMaps, this.overlayMaps);
      if (this.options.hash) {
        var hash = new L.FullHash(map, allMaps);
        // Update map state from hash
        hash.update(this.options.currentHash);
      }

      if (!!this.options.addLayersToMap) {  // turn on all layers
        for (let layer of this.options.layers.include) {
          layer === 'city' ? map.addLayer(this.overlayMaps['current']) : map.addLayer(this.overlayMaps[layer]);
        }
      } else if (!!this.options.layers.display) {  // turn on only layers in display
        for (let layer of this.options.layers.display) {
          // make sure the layer exists in the display list
          if (this.options.layers.include.includes(layer)) {
            layer === 'city' ? map.addLayer(this.overlayMaps['current']) : map.addLayer(this.overlayMaps[layer]);
          } else {
            console.log("Layer specified does not exist.");
          }
        }
      } // or turn on nothing
    // Collapsible search control
      new L.Control.GPlaceAutocomplete({
        position: 'topleft',
        collapsed_mode: true,
        callback: function(place){
          var loc = place.geometry.location;
          map.setView( [loc.lat(), loc.lng()], 18);
        }
      }).addTo(map);
    },

    onRemove: function(map) {},
  },
);


L.LayerGroup.EnvironmentalLayers = function(options) {
  return new L.LayerGroup.environmentalLayers(options);
};
