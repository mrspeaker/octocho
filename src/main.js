var octocho = {
    cubes: [],
    peeps: [],
    lastI: 0,
    lastMove: Date.now(),
    init: function (dom) {

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100); //THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
        this.camera.position.y = 0;
        this.camera.position.x = -3;
        this.camera.position.z = 5;

        this.camera.rotation.y = -35 * (Math.PI / 180);

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.addEventListener('change', function () {
            octocho.lastMove = Date.now();
        });

        this.scene = new THREE.Scene();

        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({color: 0x001300})
        );
        plane.position.y = -5;
        plane.position.x = 0;
        plane.position.z = 0;
        plane.rotation.x = -90 * (Math.PI / 180);
        //this.scene.add(plane);

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
                    var c = new THREE.Color();
                    c.setHSL((k * 3 + j * 3 + i) / 27, 0.8, Math.random());
                    var cube = new THREE.Object3D();

                    var cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshBasicMaterial({transparent: true, color: c, wireframe: true, opacity: 0.1 }));
                    cube.position.x = (i - 1) * 1;
                    cube.position.y = (j - 1) * 1;
                    cube.position.z = (k - 1) * 1;

                    var plane = new THREE.Mesh(
                        new THREE.PlaneGeometry(1, 1),
                        new THREE.MeshBasicMaterial({color: c})
                    );
                    plane.position.y = -0.5;
                    plane.rotation.x = -90 * (Math.PI / 180);
                    cube.add(plane);

                    var plane2 = new THREE.Mesh(
                        new THREE.PlaneGeometry(1, 1),
                        new THREE.MeshBasicMaterial({color: c})
                    );
                    plane2.position.y = -0.5;
                    plane2.rotation.x = 90 * (Math.PI / 180);
                    cube.add(plane2);

                    var peep = new Peep();
                    var c2 = new THREE.Mesh(
                        new THREE.CubeGeometry(peep.w, peep.h, peep.w),
                        new THREE.MeshLambertMaterial({color: c})
                    );
                    peep.init(c2);

                    this.peeps.push(peep);
                    cube.add(cubeMesh);
                    cube.add(c2);

                    this.scene.add(cube);
                    this.cubes.push(cube);

                }
            }
        }

        var ambientLight = new THREE.AmbientLight(0x774444);
        this.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0.1, 0.3, 0.1).normalize();
        this.scene.add(directionalLight);

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

        this.update();
        this.render();

        setTimeout(function () {
            octocho.run();
        }, 20);
    },

    update: function () {

        this.controls.update();

        this.cubes.forEach(function(c, i) {
            if (((Date.now() / 3000 % 27) | 0) === i) {
                if (i !== this.lastI) {
                    if (this.cubes[this.lastI]) {
                        this.cubes[this.lastI].rotation.x = 0;
                        this.cubes[this.lastI].rotation.y = 0;
                    }
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

        this.peeps.forEach(function (p) {
            //p.position.x += (Math.random() - 0.5) * 0.02;
            p.tick();
        });
    },

    render: function () {

        this.renderer.render(this.scene, this.camera);

        //this.camera.position.y += ((Math.sin(Date.now() / 1000) - 0.5 ) * 2) / 100;
    }
};
