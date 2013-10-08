function Cube(col, id) {
    this.mesh = null;
    this.col = col;
    this.id = id;
};

Cube.prototype = {

    init: function (x, y, z) {
        this.pos = geom.vec3(x, y, z);
        this.rot = geom.vec3(0, 0, 0);

        this.mat = new THREE.Matrix4();
        this.mat.makeRotationY(5 * (Math.PI / 180));

        this.things = [];
        this.peeps = [];

        this.createMesh(x, y, z);

        return this;
    },

    createMesh: function (x, y, z) {
        var texture = "path" + ((Math.random() * 3 | 0) + 1),
            debugDextures = [
                ["a", "d", "g"],
                ["b", "e", "h"],
                ["c", "f", "i"]
            ],
            debug = debugDextures[x + 1][z + 1],
            mats = ["pathEdge", "pathEdge", texture, texture, "pathEdge", "pathEdge"]
                .map(function (m) {
                    return new THREE.MeshPhongMaterial({
                        map: octocho.materials[m],
                        normalMap: octocho.materials.nm
                    });
                }),
            ground = geom.basicCube2(this.col, mats);

        this.mesh = geom.container(geom.vec3(x, y, z));

        ground.position.y = -0.5;
        this.mesh.add(ground);
        this.base = ground;
        ground.userData.cube = this;
    },

    addThing: function (thing) {
        this.things.push(thing);
        this.mesh.add(thing.mesh);
    },

    addPeep: function (peep) {
        this.peeps.push(peep);
    },

    removePeep: function (peep) {
        this.peeps = this.peeps.filter(function (p) {
            return p !== peep;
        });
    },

    tick: function () {
        this.things.forEach(function (t) {
            t.tick();
        });

        if (this.rotating-- > 0) {
            if(this.rotateAxis) {
                this.rot.y = (this.rot.y + this.rotateAmount) % (Math.PI * 2);
                this.peeps.forEach(function (p) {
                    p.dir = (p.dir + this.rotateAmount) % (Math.PI * 2);
                }, this);
            } else {
                this.rot.z = (this.rot.z + this.rotateAmount) % (Math.PI * 2);
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
            if (this.rot.z > 0) {
                this.rotateAmount = -this.rotateAmount;
            }
        }
    },

    sync: function () {
        this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    }

};
