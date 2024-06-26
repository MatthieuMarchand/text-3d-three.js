class Text3D {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.mouse = new THREE.Vector2();
    this.targetRotation = new THREE.Vector2();
    this.lerpFactor = 0.1;

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupLights();
    this.setupCamera();
    this.loadFontAndCreateText();
    this.addMouseMoveListener();

    document.body.appendChild(this.renderer.domElement);
    this.animate();
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);
  }

  setupCamera() {
    this.camera.position.z = 5;
  }

  loadFontAndCreateText() {
    const loader = new THREE.FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/droid/droid_sans_bold.typeface.json",
      (font) => {
        const geometry = this.createTextGeometry(font);
        this.centerTextGeometry(geometry);

        const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
        this.textMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.textMesh);
      }
    );
  }

  createTextGeometry(font) {
    return new THREE.TextGeometry("3D", {
      font: font,
      size: 1.5,
      height: 0.4,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 5,
    });
  }

  centerTextGeometry(geometry) {
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    geometry.translate(
      -0.5 * (boundingBox.max.x - boundingBox.min.x),
      -0.5 * (boundingBox.max.y - boundingBox.min.y),
      -0.5 * (boundingBox.max.z - boundingBox.min.z)
    );
  }

  addMouseMoveListener() {
    document.addEventListener(
      "mousemove",
      (event) => this.onMouseMove(event),
      false
    );
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.targetRotation.x = (-this.mouse.y * Math.PI) / 4;
    this.targetRotation.y = (-this.mouse.x * Math.PI) / 4;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.updateTextRotation();
    this.renderer.render(this.scene, this.camera);
  }

  updateTextRotation() {
    if (this.textMesh) {
      this.textMesh.rotation.x +=
        (this.targetRotation.x - this.textMesh.rotation.x) * this.lerpFactor;
      this.textMesh.rotation.y +=
        (this.targetRotation.y - this.textMesh.rotation.y) * this.lerpFactor;
    }
  }
}

const text3D = new Text3D();
