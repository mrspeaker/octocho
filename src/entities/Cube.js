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
        var cubey = geom.basicCube(this.col)
        this.mesh = geom.container(geom.vec3(x, y, z));
        this.mesh.add(cubey);

        cubey.userData.cube = this;

        //console.log(this.mesh.userData)

        // Add the planes
        var plane = geom.basicPlane(this.col);
        plane.position.y = -0.5;
        plane.rotation.x = -90 * (Math.PI / 180);
        this.mesh.add(plane);
        plane = geom.basicPlane(this.col);
        plane.position.y = -0.5;
        plane.rotation.x = 90 * (Math.PI / 180);
        this.mesh.add(plane);

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
