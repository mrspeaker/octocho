var octocho = {
    cubes: [],
    lastI: 0,
    lastMove: Date.now(),
    init: function (dom) {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100); //THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
        this.camera.position.y = 0;
        this.camera.position.x = -3;
        this.camera.position.z = 5;

        this.camera.rotation.y = -35 * (Math.PI / 180);
        //this.camera.rotation.y = 0;


        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.addEventListener('change', function () {
            octocho.lastMove = Date.now();
        });

        this.scene = new THREE.Scene();

        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({color: 0x001300})
        );
        plane.position.y = -3;
        plane.position.x = 0;
        plane.position.z = 0;
        plane.rotation.x = -90 * (Math.PI / 180);
        this.scene.add(plane);

        for (var k = 0; k < 3; k++) {
            for (var j = 0; j < 3; j++) {
                for (var i = 0; i < 3; i++) {
                    var c = new THREE.Color();
                    c.setHSL((k * 3 + j * 3 + i) / 27, 0.8, Math.random());
                    var cube = new THREE.Object3D();
                    var cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshBasicMaterial({transparent: true, color: c, opacity: 0.1 }));
                    cube.position.x = (i - 1) * 1;
                    cube.position.y = (j - 1) * 1;
                    cube.position.z = (k - 1) * 1;

                    var c2 = new THREE.Mesh(new THREE.CubeGeometry(0.1, 0.2, 0.1), new THREE.MeshBasicMaterial({color: c}));
                    c2.position.x = 0;
                    c2.position.y = -0.5 + 0.1;
                    c2.position.z = 0;

                    cube.add(cubeMesh);
                    cube.add(c2);

                    this.scene.add(cube);
                    this.cubes.push(cube);

                }
            }
        }

        var areaLight1 = new THREE.AreaLight( 0xffffff, 1 );
        areaLight1.position.set( 0.0001, 10.0001, -18.5001 );
        areaLight1.rotation.set( -0.74719, 0.0001, 0.0001 );
        areaLight1.width = 10;
        areaLight1.height = 1;

        this.scene.add( areaLight1 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        if (dom) {
            dom.appendChild(this.renderer.domElement);
        } else {
            document.getElementById("board").appendChild(this.renderer.domElement);
        }
        this.run();

    },
    run: function () {
        //this.cube.rotation.y += 0.02;
        this.cubes.forEach(function(c, i) {
            if (((Date.now() / 3000 % 27) | 0) === i) {
                if (i !== this.lastI) {
                    this.cubes[this.lastI].rotation.x = 0;
                    this.cubes[this.lastI].rotation.y = 0;
                    this.lastI = i;

                }
                if (((Date.now() / 3000 % 2) | 0) === 1) {
                    c.rotation.y += 0.05;// * (i % 4);
                }
                else {
                    c.rotation.x += 0.05;// * (i % 4);
                }
            }
            //c.rotation.x += 0.002;// * (i % 4);
        }, this);

        this.renderer.render(this.scene, this.camera);

        this.controls.update();
        this.camera.position.y += ((Math.sin(Date.now() / 1000) - 0.5 ) * 2) / 100;

        setTimeout(function () {
            octocho.run();
        }, 20);
    }
};
