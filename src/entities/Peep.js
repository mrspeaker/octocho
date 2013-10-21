function Peep(col) {
    this.col = col;
    this.pos = null;
    this.rot = null;

    this.w = 0.05;
    this.h = 0.1;

    this.dir = 0;
    this.mesh = null;

    this.cellX = 0;
    this.cellZ = 0;
};

Peep.prototype = {

    pickDir: function () {
        return [0, 90, 180, 270][Math.random() * 4 | 0] * (Math.PI / 180);
    },

    init: function (cube) {
        this.mesh = geom.peep(this);
        this.cube = cube;

        this.dir = this.pickDir();
        this.speed = (Math.random() * 0.003) + 0.001;
        this.pos = geom.vec3(
            cube.pos.x,
            cube.pos.y + (-0.48 + (this.h / 2) + 0.001),
            cube.pos.z);

        this.rot = geom.vec3(0, 0, 0);

        return this;
    },

    tick: function (level) {
        var xo = this.speed * Math.sin(this.dir),
            zo = this.speed * Math.cos(this.dir),
            pos = this.pos,
            oldPos = geom.vec3().copy(pos),
            oldCube = this.cube;

        this.rot.y = this.dir;

        if (pos.x + xo < -1.5 || pos.x + xo > 1.5) {
            this.dir = this.pickDir();
            xo = 0;
        }
        if (pos.z + zo < -1.5 || pos.z + zo > 1.5) {
            this.dir = this.pickDir();
            zo = 0;
        }

        this.pos.add(geom.vec3(xo, 0, zo));

        var newCube = level.getCubeFromWorldPos(pos),
            changed = newCube !== this.cube,
            updateCubeGuys = false;

        if (changed) {
            if (newCube.rot.z !== 0) {
                this.pos.copy(oldPos);
                this.dir = Math.random() * (Math.PI * 2);
            } else {
                updateCubeGuys = true;
            }
        }

        var cellX = Math.round((pos.x) * 3) - (newCube.pos.x * 3),
            cellZ = Math.round((pos.z) * 3) - (newCube.pos.z * 3);
        if (cellX !== this.cellX || cellZ !== this.cellZ) {
            // Get the cell from the cube
            var road = newCube.paths[(cellX + 1) + ((cellZ + 1) * 3)];
            // if 1, ok to go
            if (road && !(cellX === 0 && cellZ === 0)) {
                this.cellX = cellX;
                this.cellZ = cellZ;
            } else  {
                // else - if one exit, go that way
                // else - if two exits, random?
                // else - go backwards
                this.pos.copy(oldPos);
                this.dir = this.pickDir();
                updateCubeGuys = false;
            }
        }

        if (updateCubeGuys) {
            oldCube.removePeep(this);
            newCube.addPeep(this);
            this.cube = newCube;
        }

        this.sync();
    },

    sync: function () {
        this.mesh.position = this.pos;
        this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    }
}

