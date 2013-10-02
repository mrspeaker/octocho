var octocho = {
    cubes: [],
    cubeMeshes: [],

    downAt: null,

    init: function (dom) {

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(3.3, 1.2, 4);
        this.camera.rotation.set(-0.3, 0.67, 0.18);

        this.controls = new THREE.OrbitControls(this.camera);

        this.bindInput();
        this.makeAScene();

        this.scene.fog = new THREE.Fog(0x000000, 3, 10);
        this.scene.fog.color.setHSL(0.51, 0.1, 0.2);

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

        document.addEventListener("mousedown", function (e) {
            self.downAt = Date.now();
        });

        document.addEventListener("click", function (e) {

            if (Date.now() - self.downAt > 300) {
                return;
            }

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
            materials.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( 'res/mouse.png'),
                transparent: false
            }));
        }

        this.materials = {
            path1: THREE.ImageUtils.loadTexture('res/path-1.png'),
            path2: THREE.ImageUtils.loadTexture('res/path-2.png'),
            path3: THREE.ImageUtils.loadTexture('res/path-3.png'),
            pathEdge: THREE.ImageUtils.loadTexture('res/path-edge.png'),
            ladder: THREE.ImageUtils.loadTexture('res/ladder.png')
        };

        //this.nm = THREE.ImageUtils.loadTexture("res/path-1-nm.png");




        this.materials.ladder.wrapS = THREE.RepeatWrapping;
        this.materials.ladder.repeat.y = 1;

        for (var m in this.materials) {
            this.materials[m].minFilter = THREE.LinearMipMapLinearFilter;
            this.materials[m].magFilter = THREE.NearestFilter;
        }

        for (var k = 0; k < 3; k++) {
            for (var j = 0; j < 3; j++) {
                for (var i = 0; i < 3; i++) {

                    var col = geom.colHSL((k * 3 + j * 3 + i) / 27, 0.8, Math.random()),
                        cube = new Cube(col).init(i - 1, j - 1, k - 1);

                    cube.addPeep(new Peep(col).init());

                    if (j < 2 && Math.random() < 0.2) {
                        var ladder = new Ladder().init();
                        cube.mesh.add(ladder.mesh);
                    }

                    this.cubes.push(cube);
                    this.cubeMeshes.push(cube.base);

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