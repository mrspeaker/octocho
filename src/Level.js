function Level () {
    this.cubes = null;
};
Level.prototype = {

    init: function () {
        this.cubes = [];

        for (var x = 0; x < 3; x++) {
            this.cubes.push([]);
            for (var y = 0; y < 3; y++) {
                this.cubes[x].push([]);
                for (var z = 0; z < 3; z++) {
                    var col = geom.colHSL((x * 3 + y * 3 + z) / 27, 0.8, Math.random()),
                        cube = new Cube(col).init(x - 1, y - 1, z - 1);

                    cube.addPeep(new Peep(col).init());

                    if (y < 2 && Math.random() < 0.2) {
                        cube.addThing(new Ladder().init());
                    }

                    this.cubes[x][y].push(cube);
                }
            }
        }

        return this;
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

    }

};
