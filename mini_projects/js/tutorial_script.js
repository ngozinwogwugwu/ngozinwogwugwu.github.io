// general setup
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
document.body.appendChild( renderer.domElement );

// make the cube
var cubeGeometry = new THREE.BoxGeometry( 1, 1, 2 );
var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x15631e } );
var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cube );

// make al ine
var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3( -5, 0, 0) );
lineGeometry.vertices.push(new THREE.Vector3( 0, 5, 0) );
lineGeometry.vertices.push(new THREE.Vector3( 5, 0, 0) );
var line = new THREE.Line( lineGeometry, lineMaterial );
scene.add ( line );

// let's animate this with a render/animate loop
function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  line.rotation.x += 0.01;

  renderer.render( scene, camera );
}

animate();