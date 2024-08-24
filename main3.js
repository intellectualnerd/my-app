import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import { fromLonLat, transformExtent } from 'ol/proj';

// Define image dimensions (in pixels)
const imageWidth = 474;  // Replace with your image's width
const imageHeight = 527; // Replace with your image's height

// Define geographic extent (bounding box) based on the image aspect ratio
let minLon = -0.84;
let minLat = -81.04;
let maxLon = 163.15;
let maxLat = 81.04;

// Calculate the aspect ratio of the geographic extent
const extentWidth = maxLon - minLon;
const extentHeight = maxLat - minLat;
const extentAspectRatio = extentWidth / extentHeight;

// Calculate image aspect ratio
const imageAspectRatio = imageWidth / imageHeight;

// Adjust extent to fit image aspect ratio
let adjustedMaxLat = minLat + (extentWidth / imageAspectRatio);
if (adjustedMaxLat > maxLat) {
  adjustedMaxLat = maxLat;
  const adjustedWidth = (adjustedMaxLat - minLat) * imageAspectRatio;
  minLon = maxLon - adjustedWidth;
}

// Transform extent to EPSG:3857 projection
const extent = transformExtent(
  [minLon, minLat, maxLon, adjustedMaxLat],
  'EPSG:4326', // WGS 84
  'EPSG:3857'  // Web Mercator
);

// Load the static image
const imageLayer = new ImageLayer({
  source: new ImageStatic({
    url: './cog/earth.png', // Path to your image
    imageExtent: extent, // Bounding box of the image in EPSG:3857
  }),
  opacity: 0.5, // Set low opacity for the image
});

// Initialize the map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(), // OpenStreetMap as the base layer
    }),
    imageLayer, // Add the static image layer
  ],
  view: new View({
    projection: 'EPSG:3857', // Set projection to EPSG:3857
    center: fromLonLat([(minLon + maxLon) / 2, (minLat + adjustedMaxLat) / 2]), // Center the map
    zoom: 2, // Adjust zoom level as needed
  }),
});

// Adjust the view to fit the extent
map.getView().fit(extent, {
  size: map.getSize(),
  padding: [20, 20, 20, 20], // Optional padding
});
