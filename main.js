import GeoTIFF from 'ol/source/GeoTIFF.js';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';

const source = new GeoTIFF({
  sources: [
    {
      url: "./cog/ndvi.tif",
    },
  ],
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: source,
    }),
  ],
  view: source.getView(),
});
