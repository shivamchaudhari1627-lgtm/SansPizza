const https = require('https');

https.get('https://www.hitem3d.ai/share/3d-models-generator/a/7EFIE140', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const glbMatches = data.match(/https?:\/\/[^"']*\.(glb|gltf)/gi);
    console.log("GLB Matches:", glbMatches);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
