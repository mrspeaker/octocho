var octocho = {
    cubes: [],
    cubeMeshes: [],
    init: function (dom) {

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(3.3, 1.2, 4);
        this.camera.rotation.set(-0.3, 0.67, 0.18);

        this.controls = new THREE.OrbitControls(this.camera);

        this.bindInput();
        this.makeAScene();

        // Add the renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        (dom ? dom : document.getElementById("board")).appendChild(this.renderer.domElement);

        // for performing world/screen calculations
        this.projector = new THREE.Projector();

        this.run();

    },

    bindInput: function () {

        var self = this;

        this.controls.addEventListener('change', function (c) {});

        document.addEventListener("click", function (e) {
            var pos = utils.mouse2Space(e),
                hit = self.rayCast(pos[0], pos[1]);

            if (hit.length) {
                self.rotateCube(hit);
            }
        }, false);

    },

    run: function () {

        this.update();
        this.render();

        setTimeout(function () {
            octocho.run();
        }, 20);
    },

    update: function () {

        this.controls.update();

        this.cubes.forEach(function(c) {
            c.tick();
        });
    },

    makeAScene: function () {

        this.scene = new THREE.Scene();

        var materials = [];
        for ( var i = 0; i < 6; i ++ ) {
            materials.push( new THREE.MeshBasicMaterial( {
                map: THREE.ImageUtils.loadTexture( 'res/mouse.png'),
                transparent: false
            } ) );
        }

        for (var k = 0; k < 3; k++) {
            for (var j = 0; j < 3; j++) {
                for (var i = 0; i < 3; i++) {
                    if (i === 1 && j === 1 && k ===1) continue;
                    //if (Math.random() < 0.3) continue;
                    var col = geom.colHSL((k * 3 + j * 3 + i) / 27, 0.8, Math.random()),
                        cube = new Cube(col).init(i - 1, j - 1, k - 1);

                    cube.addPeep(new Peep(col).init());

                    this.cubes.push(cube);
                    this.cubeMeshes.push(cube.mesh);

                    this.scene.add(cube.mesh);

                }
            }
        }

        var ambientLight = new THREE.AmbientLight(0x774444);
        this.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0.1, 0.3, 0.1).normalize();
        this.scene.add(directionalLight);

    },

    rotateCube: function (hit) {
        if (hit[0].object.userData.cube) {
            hit[0].object.userData.cube.rotZ += (90 * (Math.PI / 180)) % (Math.PI * 2);
        }
    },

    rayCast: function (x, y) {
        var vector = geom.vec3(x, y, 0.5),
            ray,
            intersects;
        this.projector.unprojectVector(vector, this.camera);
        ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
        intersects = ray.intersectObjects(this.cubeMeshes, true);

        return intersects;
    },

    render: function () {

        this.renderer.render(this.scene, this.camera);

    }
};
