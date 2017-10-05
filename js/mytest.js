/**
 * This is a basic asyncronous shader loader for THREE.js.
 * 
 * It uses the built-in THREE.js async loading capabilities to load shaders from files!
 * 
 * `onProgress` and `onError` are stadard TREE.js stuff. Look at 
 * https://threejs.org/examples/webgl_loader_obj.html for an example. 
 * 
 * @param {String} vertex_url URL to the vertex shader code.
 * @param {String} fragment_url URL to fragment shader code
 * @param {function(String, String)} onLoad Callback function(vertex, fragment) that take as input the loaded vertex and fragment contents.
 * @param {function} onProgress Callback for the `onProgress` event. 
 * @param {function} onError Callback for the `onError` event.
 */
function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
  var vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
  vertex_loader.setResponseType('text');
  vertex_loader.load(vertex_url, function (vertex_text) {
    var fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    fragment_loader.setResponseType('text');
    fragment_loader.load(fragment_url, function (fragment_text) {
      onLoad(vertex_text, fragment_text);
    });
  }, onProgress, onError);
}

// ============================================================================

// An example!

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);

var t = 0;

var uniforms = {
  time: { type: "f", value: t },
  resolution: { type: "v2", value: new THREE.Vector2() }
}

camera.position.z = 5;

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);

scene.add(pointLight);

// The main problem with async loading is to handle the async flow of the program.
// This may be make easier with modern JS features such as Promises or async/await.
//
// But, for now, we stick to the classic callback style.
//
// Because we need the content of the shaders **BEFORE** we can instantiate the 
// material, we need to put everything that need the cube inside the onLoad callback.
//
// This can be done better with a bit of refactoring but I hope you get the idea.
ShaderLoader("shader/vertex.vert", "shader/fragment.frag",
  function (vertex, fragment) {
    var material = new THREE.ShaderMaterial({

      uniforms: uniforms,
      attributes: {
        vertexOpacity: { type: 'f', value: [] }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });

    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var render = function () {
      requestAnimationFrame(render);
      cube.material.uniforms.time.value += 0.1;
      cube.rotation.x += 0.1;
      cube.rotation.y += 0.1;

      renderer.render(scene, camera);
    };

    render();
  }
)
