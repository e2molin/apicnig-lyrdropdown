import Lyrdropdown from 'facade/lyrdropdown';

M.language.setLang('es');//Español
//M.language.setLang('en');//Inglés

/**
 * Definimos las capas con notación MAPEA
 */
const capasPNOA = [
    'WMS*PNOA 2004*https://www.ign.es/wms/pnoa-historico*PNOA2004',
    'WMS*PNOA 2005*https://www.ign.es/wms/pnoa-historico*PNOA2005',
    'WMS*PNOA 2006*https://www.ign.es/wms/pnoa-historico*PNOA2006',
    'WMS*PNOA 2007*https://www.ign.es/wms/pnoa-historico*PNOA2007',
    'WMS*PNOA 2008*https://www.ign.es/wms/pnoa-historico*PNOA2008',
    'WMS*PNOA 2009*https://www.ign.es/wms/pnoa-historico*PNOA2009',
    'WMS*PNOA 2010*https://www.ign.es/wms/pnoa-historico*PNOA2010',
    'WMS*PNOA 2011*https://www.ign.es/wms/pnoa-historico*PNOA2011',
    'WMS*PNOA 2012*https://www.ign.es/wms/pnoa-historico*PNOA2012',
    'WMS*PNOA 2013*https://www.ign.es/wms/pnoa-historico*PNOA2013',
    'WMS*PNOA 2014*https://www.ign.es/wms/pnoa-historico*PNOA2014',
    'WMS*PNOA 2015*https://www.ign.es/wms/pnoa-historico*PNOA2015',
    'WMS*PNOA 2016*https://www.ign.es/wms/pnoa-historico*PNOA2016',
    'WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico*PNOA2017',
    'WMS*PNOA 2018*https://www.ign.es/wms/pnoa-historico*PNOA2018',
];

/**
 * Definimos las capas con notación MAPEA
 */
const capasVueloHisto = [
    'WMTS*http://www.ign.es/wmts/primera-edicion-mtn?*catastrones*GoogleMapsCompatible*Catastrones de MTN',
    'WMTS*http://www.ign.es/wmts/primera-edicion-mtn?*mtn50-edicion1*GoogleMapsCompatible*MTN50 Primera edición',
    'WMTS*http://www.ign.es/wmts/primera-edicion-mtn?*mtn25-edicion1*GoogleMapsCompatible*MTN25 Primera edición',
    'WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC',
    'WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT',
    'WMS*Vuelo Nacional 1981-1986*https://www.ign.es/wms/pnoa-historico*Nacional_1981-1986',
    'WMS*Vuelo Interministerial 1973-1986*https://www.ign.es/wms/pnoa-historico*Interministerial_1973-1986',
    'WMS*Vuelo Americano B 1956-1957*https://www.ign.es/wms/pnoa-historico*AMS_1956-1957',
];



const map = M.map({
  container: 'mapjs',
  //layers:capasVueloHisto,
  center: {
    x: -667143.31,
    y: 4493011.77,
    draw: false  //Dibuja un punto en el lugar de la coordenada
  },
  controls: ['scale','location'],
  /*projection: "EPSG:25830*m",*/
  projection: "EPSG:3857*m",
  zoom: 15,

  //Ojo, si añado esta capa sin TOC, se ve siempre y no se muestran capas base
  /*layers: ["WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA"],*/
});

const mpBIL = new M.plugin.BackImgLayer({
  position: 'TR',
  collapsible: true,
  collapsed: true,
  layerId: 0,
  layerVisibility: true,
  layerOpts: 
  [{
          id: 'mapa',
          preview: 'http://componentes.ign.es/api-core/plugins/backimglayer/images/svqmapa.png',
          title: 'Mapa',
          layers: [new M.layer.WMTS({
              url: 'http://www.ign.es/wmts/ign-base?',
              name: 'IGNBaseTodo',
              legend: 'Mapa IGN',
              matrixSet: 'GoogleMapsCompatible',
              transparent: false,
              displayInLayerSwitcher: false,
              queryable: false,
              visible: true,
              format: 'image/jpeg',
          })],
      },
      {
          id: 'imagen',
          title: 'Imagen',
          preview: 'http://componentes.ign.es/api-core/plugins/backimglayer/images/svqimagen.png',
          layers: [new M.layer.WMTS({
              url: 'http://www.ign.es/wmts/pnoa-ma?',
              name: 'OI.OrthoimageCoverage',
              legend: 'Imagen (PNOA)',
              matrixSet: 'GoogleMapsCompatible',
              transparent: false,
              displayInLayerSwitcher: false,
              queryable: false,
              visible: true,
              format: 'image/jpeg',
          })],
      },
      {
          id: 'hibrido',
          title: 'Híbrido',
          preview: 'http://componentes.ign.es/api-core/plugins/backimglayer/images/svqhibrid.png',
          layers: [new M.layer.WMTS({
                  url: 'http://www.ign.es/wmts/pnoa-ma?',
                  name: 'OI.OrthoimageCoverage',
                  legend: 'Imagen (PNOA)',
                  matrixSet: 'GoogleMapsCompatible',
                  transparent: true,
                  displayInLayerSwitcher: false,
                  queryable: false,
                  visible: true,
                  format: 'image/png',
              }),
              new M.layer.WMTS({
                  url: 'http://www.ign.es/wmts/ign-base?',
                  name: 'IGNBaseOrto',
                  matrixSet: 'GoogleMapsCompatible',
                  legend: 'Mapa IGN',
                  transparent: false,
                  displayInLayerSwitcher: false,
                  queryable: false,
                  visible: true,
                  format: 'image/png',
              })
          ],
      },
      {
          id: 'lidar',
          preview: 'http://componentes.ign.es/api-core/plugins/backimglayer/images/svqlidar.png',
          title: 'LIDAR',
          layers: [new M.layer.WMTS({
              url: 'https://wmts-mapa-lidar.idee.es/lidar?',
              name: 'EL.GridCoverageDSM',
              legend: 'Modelo Digital de Superficies LiDAR',
              matrixSet: 'GoogleMapsCompatible',
              transparent: false,
              displayInLayerSwitcher: false,
              queryable: false,
              visible: true,
              format: 'image/png',
          })],
      },
  ],
});

map.addPlugin(mpBIL);

const mpLyrDrop = new Lyrdropdown({
  position: 'BR',
  collapsible: false,          // El botón para desplegar/replegar el plugin no aparece (false) o sí aparece(true)
  collapsed: true,           // El panel del plugin se muestra desplegado (false) o replegado (true)
  layers: [
    'WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC',
    'WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT',
    'WMS*Nacional_1981-1986*https://www.ign.es/wms/pnoa-historico*Nacional_1981-1986',
    'WMS*Interministerial_1973-1986*https://www.ign.es/wms/pnoa-historico*Interministerial_1973-1986',
    'WMS*AMS_1956-1957*https://www.ign.es/wms/pnoa-historico*AMS_1956-1957'
  ], 
});

map.addPlugin(mpLyrDrop);
