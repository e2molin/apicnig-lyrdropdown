# M.plugin.Lyrdropdown

Permite definir una serie de capas para mostrarlas en un selector del tipo *dropdown*, para mostrarlas sobre el mapa base.

![Imagen -  Layer DropDown](/src/facade/assets/img/capture.jpg)

# Dependencias

lyrdropdown.ol.min.js
lyrdropdown.ol.min.css

```html
 <link href="../../plugins/mirrorpanel/lyrdropdown.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/mirrorpanel/lyrdropdown.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right

- **collapsible**. Si es *true*, el botón aparece, y puede desplegarse y contraerse. Si es *false*, el botón no aparece. Por defecto tiene el valor *true*.

- **collapsed**. Si es *true*, el panel aparece cerrado. Si es *false*, el panel aparece abierto. Por defecto tiene el valor *true*.

- **layers**. Permite pasar al control del array de capas que queremos que se muestren en el selector.

# Eventos

# Multi idioma

Actualmente viene preparado para español e inglés. Para definir con qué idioma arranca, hay que ir al fichero test.js y modificar

```javascript
M.language.setLang('es');//Idioma español
M.language.setLang('en');//Idioma inglés
```
Se pueden crear más ficheros de idioma. Basta con copiar la estructura de los ficheros **json** de la carpeta *\src\facade\js\i18n* , renombrar con la abreviatura del nuevo idioma (fr para el fránces), y cambiar los textos, manteniendo las *keywords*.

# Otros métodos

No aplica

# Ejemplos de uso


```javascript
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
```
