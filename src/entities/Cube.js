function Cube(col, id) {
    this.mesh = null;
    this.col = col;
    this.id = id;

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;

};

Cube.prototype = {

    init: function (x, y, z) {
        this.pos = x + ":" + y + ":" + z;

        this.worldPos = new THREE.Vector3(x, y, z);
        this.things = [];

        this.createMesh(x, y, z);

        return this;
    },

    createMesh: function (x, y, z) {
        this.mesh = geom.container(geom.vec3(x, y, z));

        var texture = "path" + ((Math.random() * 3 | 0) + 1),
            debugDextures = [
                ["a", "d", "g"],
                ["b", "e", "h"],
                ["c", "f", "i"]
            ],
            debug = debugDextures[x + 1][z + 1],
            mats = ["pathEdge", "pathEdge", texture, texture, "pathEdge", "pathEdge"].map(function (m) {
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

    tick: function () {
        this.things.forEach(function (t) {
            t.tick();
        });

        if (this.rotating-- > 0) {
            if(this.rotateAxis) {
                this.rotY = (this.rotY + this.rotateAmount) % (Math.PI * 2);
            } else {
                this.rotZ = (this.rotZ + this.rotateAmount) % (Math.PI * 2);
            }
        }

        this.sync();
    },

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

    sync: function () {
        this.mesh.rotation.set(this.rotX, this.rotY, this.rotZ);
    }
};
