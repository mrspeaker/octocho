function Cube(col) {
    this.mesh = null;
    this.col = col;
    this.peeps = [];

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
};

Cube.prototype = {

    init: function (x, y, z) {
        //var cubey = geom.basicCube(this.col)
        this.mesh = geom.container(geom.vec3(x, y, z));
        //this.mesh.add(cubey);
        //cubey.userData.cube = this;

        var o = "path" + ((Math.random() * 3 | 0) + 1),
            mats = ["pathEdge", "pathEdge", o, o, "pathEdge", "pathEdge"].map(function (m) {
                return new THREE.MeshBasicMaterial({
                    map: octocho.materials[m]
                });
            });

        var plane = geom.basicCube2(this.col, mats);
        plane.position.y = -0.5;
        this.mesh.add(plane);
        this.base = plane;
        plane.userData.cube = this;

        return this;
    },

    addPeep: function (peep) {
        this.mesh.add(peep.mesh);
        this.peeps.push(peep);
    },

    tick: function () {
        this.peeps.forEach(function (p) {
            p.tick();
        });

        this.sync();
    },

    sync: function () {
        this.mesh.rotation.set(this.rotX, this.rotY, this.rotZ);
    }
};
