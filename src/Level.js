var DIRS = {
    "north": 0,
    "east": 1,
    "south": 2,
    "west": 3
};

function Level () {
    this.cubes = null;
    this.peeps = null;
};
Level.prototype = {

    init: function () {
        this.cubes = [];
        this.peeps = [];

        var id = 0;

        for (var x = 0; x < 3; x++) {
            this.cubes.push([]);
            for (var y = 0; y < 3; y++) {
                this.cubes[x].push([]);
                for (var z = 0; z < 3; z++) {
                    var col = geom.colHSL((x * 3 + y * 3 + z) / 27, 0.8, Math.random()),
                        cube = new Cube(col, id++).init(x - 1, y - 1, z - 1);

                    cube.connectsTo = [
                        [x - 1, y - 1, z + 1]
                    ];
                    //if (id === 7) cube.addPeep(new Peep(col).init());

                    if (y < 2 && Math.random() < 0.2) {
                        cube.addThing(new Ladder().init());
                    }

                    this.cubes[x][y].push(cube);
                }
            }
        }

        for (x = 0; x < 3; x++) {
            this.cubes.push([]);
            for (y = 0; y < 3; y++) {
                this.cubes[x].push([]);
                for (z = 0; z < 3; z++) {
                    var ns = [null, null, null, null, null, null];

                    //if (k > 0) ns.push(this.cubes[k - 1][j][i]);
                    //if (k < 2) ns.push(this.cubes[k + 1][j][i]);

                    if (z > 0) ns[DIRS.north] = this.cubes[x][y][z - 1];
                    if (x < 2) ns[DIRS.east] = this.cubes[x + 1][y][z];

                    if (z < 2) ns[DIRS.south] = this.cubes[x][y][z + 1];
                    if (x > 0) ns[DIRS.west] = this.cubes[x - 1][y][z];


                    this.cubes[x][y][z].ns = ns;
                }
            }
        }

        this.createMesh();


        this.addPeep(new Peep(col).init());
        this.addPeep(new Peep(col).init());
        this.addPeep(new Peep(col).init());
        this.addPeep(new Peep(col).init());

        return this;
    },

    createMesh: function () {

        this.mesh = geom.container(geom.vec3(0, 0, 0));

    },

    addPeep: function (peep) {
        this.peeps.push(peep);
        this.mesh.add(peep.mesh);
    },

    removePeep: function (peep) {
        this.peeps = this.peeps.filter(function (p) {
            return p !== peep;
        });
        this.mesh.remove(peep.mesh);
    },

    tick: function () {
        for (var x = 0; x < 3; x++) {
            this.cubes.push([]);
            for (var y = 0; y < 3; y++) {
                this.cubes[x].push([]);
                for (var z = 0; z < 3; z++) {
                    var ns = [null, null, null, null, null, null];

                    //if (k > 0) ns.push(this.cubes[k - 1][j][i]);
                    //if (k < 2) ns.push(this.cubes[k + 1][j][i]);

                    if (z > 0) ns[2] = this.cubes[x][y][z - 1];
                    if (x < 2) ns[3] = this.cubes[x + 1][y][z];

                    if (z < 2) ns[4] = this.cubes[x][y][z + 1];
                    if (x > 0) ns[5] = this.cubes[x - 1][y][z];


                    this.cubes[x][y][z].tick(ns)
                }
            }
        }

        this.peeps.forEach(function (p) {
            p.tick();
        });
    }

};
