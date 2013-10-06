var CELLS = {
    "empty": -1,
    "off": 0,
    "on": 1
};

function Cube(col, id) {
    this.mesh = null;
    this.col = col;
    this.id = id;
    this.peeps = [];

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;

    this.rot = {
        y: 0,
        z: 0
    };

//    this.lastCells = null;
//    this.cells = null;

    this.inhabitants = null;
};

Cube.prototype = {

    init: function (x, y, z) {

        this.pos = x + ":" + y + ":" + z;

        /*var cells = [0, 1, 2];
        this.cells = cells.map(function (x) {
            return cells.map(function (z) {
                return null;
            });
        });
        this.lastCells = Object.clone(this.cells);

        this.graph = cells.map(function (x) {
            return cells.map(function (y) {
                return cells.map(function (z) {
                    return y === cells.length - 1 ? CELLS.off : CELLS.empty;
                });
            });
        });
        this.lastGraph = Object.clone(this.graph);
        */

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
            textures = [
                ["a", "d", "g"],
                ["b", "e", "h"],
                ["c", "f", "i"]
            ]
            mats = ["pathEdge", "pathEdge", textures[x + 1][z + 1], textures[x + 1][z + 1], "pathEdge", "pathEdge"].map(function (m) {
                return new THREE.MeshPhongMaterial({
                    map: octocho.materials[m]//,
                    //normalMap: octocho.materials.nm
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

    tick: function () {

        this.things.forEach(function (t) {
            t.tick();
        });
        this.peeps.forEach(function (t) {
            t.tick(this);
        }, this);

        if (this.rotating-- > 0) {
            if(this.rotateAxis) {
                this.rotY = (this.rotY + this.rotateAmount) % (Math.PI * 2);
            } else {
                this.rotZ = (this.rotZ + this.rotateAmount) % (Math.PI * 2);
            }
        }

        this.sync();
    },

    changePeep: function () {

    },

   /* propagate: function (cubeNs) {
        this.cells = Object.clone(this.lastCells);
        var out = [],
            cells = this.cells,
            h = this.cells.length,
            w = this.cells[0].length,
            neighbours = function (x, z) {
                var ns = [];
                for (var xx = 0; xx < 3; xx++) {
                    for (var zz = 0; zz < 3; zz++) {
                        // Don't check self
                        if (xx == 1 && zz == 1) continue;
                        // Don't check edges
                        if ((xx == 0 && zz == 0) ||
                            (xx == 0 && zz == 2) ||
                            (xx == 2 && zz == 0) ||
                            (xx == 2 && zz == 2)) continue;

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

        var ocells = [];
        for (var x = 0; x < 3; x++) {
            ocells.push([]);
            for (var z = 0; z < 3; z++) {
                var mesh = this.cells[x][z],
                    goOn = false;
                var n = neighbours(x, z).reduce(function (ac, el){
                    return ac + (el ? 1 : 0);
                }, 0);
                ocells[x][z] = null;
                if (mesh) {
                    //if (n > 1) {
                    this.mesh.remove(mesh);
                    ocells[x][z] = null;
                    goOn = false;
                    //}
                } else {
                    if (n > 0) {
                        //mesh = true;
                        goOn = true;
                    }
                }
                if (goOn && !mesh) {
                    ocells[x][z] = this.populate(x / 3, z / 3);
                }
            }
        }
        this.lastCells = ocells;
    },
    */

    rotate: function (blnY) {
        if (this.rotating > 0) {
            return;
        }
        this.rotating = 10;
        this.rotateAmount = ((90 / this.rotating) * (Math.PI / 180)) % (Math.PI * 2);
        this.rotateAxis = blnY ? true : false;

        if (!blnY) {
            if (this.rotZ > 0) {
                this.rotateAmount = -this.rotateAmount;
            }
        }

    },

    populate: function (x, z) {
        var cube = geom.cubeCol({
                x: 0.33,
                y: 0.1,
                z: 0.33
            }, 0x88000),
            off = 0.5 - (0.33 / 2);
        cube.position.set(x - off, -0.5, z - off);
        this.mesh.add(cube);
        return cube;
    },

    sync: function () {
        this.mesh.rotation.set(this.rotX, this.rotY, this.rotZ);
    }
};
