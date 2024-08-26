import { fromArrayBuffer } from 'geotiff';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';
import GeoTIFFSource from 'ol/source/GeoTIFF.js';

const map = new Map({
  target: 'map',
  layers: [],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

document.getElementById('fileInput').addEventListener('change', async function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const tiff = await fromArrayBuffer(arrayBuffer);

  const image = await tiff.getImage();
  const bands = image.getSamplesPerPixel(); // Number of bands

  const bandSelector = document.getElementById('bandSelector');
  bandSelector.innerHTML = '<option value="" disabled selected>Select a band</option>';
  for (let i = 1; i <= bands; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Band ${i}`;
    bandSelector.appendChild(option);
  }

  updateLayer(URL.createObjectURL(file), 1);
});

document.getElementById('bandSelector').addEventListener('change', function (event) {
  const band = event.target.value;
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) return;

  updateLayer(URL.createObjectURL(file), band);
});

function updateLayer(url, band) {
  const layer = new TileLayer({
    source: new GeoTIFFSource({
      sources: [
        {
          url: url,
          bands: [parseInt(band)], // Select the band
        },
      ],
    }),
  });

  map.getLayers().clear();
  map.addLayer(layer);

  layer.getSource().getView().then((viewOptions) => {
    map.setView(new View(viewOptions));
  });
}
