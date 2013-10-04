function Cube(col) {
    this.mesh = null;
    this.col = col;
    this.peeps = [];

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;

    this.cells = null;

    this.inhabitants = null;
};

Cube.prototype = {

    init: function (x, y, z) {

        this.id = x + ":" + y + ":" + z;

        var cells = [0, 1, 2];
        this.cells = cells.map(function (x) {
            return cells.map(function (z) {
                return 0;
            });
        });

        this.peeps = [];
        this.things = [];

        this.createMesh(x, y, z);

        return this;
    },

    createMesh: function (x, y, z) {

        //var cubey = geom.basicCube(this.col)
        this.mesh = geom.container(geom.vec3(x, y, z));
        //this.mesh.add(cubey);
        //cubey.userData.cube = this;

        var o = "path" + ((Math.random() * 3 | 0) + 1),
            mats = ["pathEdge", "pathEdge", o, o, "pathEdge", "pathEdge"].map(function (m) {
                return new THREE.MeshPhongMaterial({
                    map: octocho.materials[m],
                    normalMap: octocho.materials.nm
                });
            });

        var plane = geom.basicCube2(this.col, mats);
        plane.position.y = -0.5;
        this.mesh.add(plane);
        this.base = plane;
        plane.userData.cube = this;

    },

    addThing: function (thing) {

        this.things.push(thing);
        this.mesh.add(thing.mesh);

    },

    addPeep: function (peep) {

        this.peeps.push(peep);
        this.mesh.add(peep.mesh);

    },

    tick: function (ns) {

        this.things.forEach(function (t) {
            t.tick();
        });
        this.peeps.forEach(function (t) {
            t.tick();
        });

        if (this.rotating-- > 0) {
            if(this.rotateAxis) {
                this.rotY += this.rotateAmount;
            } else this.rotZ += this.rotateAmount;

        }

        this.propogate(ns);

        this.sync();
    },

    propogate: function (cubeNs) {

        var out = [],
            cells = this.cells,
            h = this.cells.length,
            w = this.cells[0].length,
            neighbours = function (x, z) {
                var ns = [];
                for (var xx = 0; xx < 3; xx++) {
                    for (var zz = 0; zz < 3; zz++) {

                        // Don't check self
                        if (xx == 1 && zz ==1 ) continue;

                        var xc = x + xx - 1,
                            zc = z + zz - 1;

                        // North
                        if (zc < 0) {
                            if (xc < 0 || xc > w - 1) continue;
                            cubeNs[2] && ns.push(cubeNs[2].cells[xc][h - 1]);
                            continue;
                        }

                        // East
                        if (xc > w - 1) {
                            if (zc < 0 || zc > h - 1) continue;
                            cubeNs[3] && ns.push(cubeNs[3].cells[0][zc]);
                            continue;
                        }

                        // South
                        if (zc > h - 1) {
                            if (xc < 0 || xc > w - 1) continue;
                            cubeNs[4] && ns.push(cubeNs[4].cells[xc][0]);
                            continue;
                        }

                        // West
                        if (xc < 0) {
                            if (zc < 0 || zc > h - 1) continue;
                            cubeNs[5] && ns.push(cubeNs[5].cells[w - 1][zc]);
                            continue;
                        }

                        ns.push(cells[xc][zc]);
                    }
                }
                return ns;
            };

        if (window.lol && window.lol[0] === this.id) {
            var x = lol[1], //Math.random() * 3 | 0,
                z = lol[2], //Math.random() * 3 | 0;
                n = neighbours(x, z);

            window.lol = null;

            if (!this.cells[x][z]) {
                this.cells[x][z] = 1;
                this.populate(x / 3, z / 3);
            }
            console.log(n)
        }

    },

    rotate: function (blnX) {
        this.rotating = 10;
        this.rotateAmount = ((90 / this.rotating) * (Math.PI / 180)) % (Math.PI * 2);
        this.rotateAxis = blnX ? true : false;
    },

    populate: function (x, z) {
        var cube = geom.cubeCol({x:0.33, y:0.15, z:0.33}, "0x88000"),
            off = 0.5 - (0.33 / 2);
        cube.position.set(x - off, -0.5, z - off);
        this.mesh.add(cube);
    },

    sync: function () {
        this.mesh.rotation.set(this.rotX, this.rotY, this.rotZ);
    }
};
