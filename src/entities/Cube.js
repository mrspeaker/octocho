
function Cube(col, id) {
    this.mesh = null;
    this.col = col;
    this.id = id;
};

Cube.prototype = {

    init: function (x, y, z, typ) {
        this.typ = typ;
        this.paths = PATHS[PATHS.idx[typ]];
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
        var texture = "path" + this.typ; //+ ((Math.random() * 3 | 0) + 1),
            debugDextures = [
                ["a", "d", "g"],
                ["b", "e", "h"],
                ["c", "f", "i"]
            ],
            debug = debugDextures[x + 1][z + 1],
            mats = ["pathEdge", "pathEdge", texture, texture, "pathEdge", "pathEdge"]
                .map(function (m) {
                    var opt = {map: octocho.materials[m]}
                    /*if (m === "path0") {
                        opt.normalMap = octocho.materials.nm
                    }*/

                    return new THREE.MeshPhongMaterial(opt);
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

    rotate: function (blnX) {
        if (this.rotating > 0) {
            return;
        }
        this.rotating = 10;
        this.rotateAmount = ((90 / this.rotating) * (Math.PI / 180)) % (Math.PI * 2);
        this.rotateAxis = blnX ? true : false;

        if (!blnX) {
            if (this.rot.z > 0) {
                this.rotateAmount = -this.rotateAmount;
            }
        } else {
            var newType = this.typ;
            switch (this.typ) {
                case PATHNAMES.TD: newType = PATHNAMES.TR; break;
                case PATHNAMES.TR: newType = PATHNAMES.TU; break;
                case PATHNAMES.TU: newType = PATHNAMES.TL; break;
                case PATHNAMES.TL: newType = PATHNAMES.TD; break;
                case PATHNAMES.CUL: newType = PATHNAMES.CDL; break;
                case PATHNAMES.CDL: newType = PATHNAMES.CDR; break;
                case PATHNAMES.CDR: newType = PATHNAMES.CUR; break;
                case PATHNAMES.CUR: newType = PATHNAMES.CUL; break;
            }
            this.setType(newType);
        }
    },

    setType: function (typ) {
        this.typ = typ;
        this.paths = PATHS[PATHS.idx[typ]];
    },

    sync: function () {
        this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    }

};
