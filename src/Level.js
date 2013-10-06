function Level () {
    this.cubes = null;
    this.epoch = Date.now();
    this.graph;

};
Level.prototype = {

    init: function () {
        this.cubes = [];
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
                    cube.addPeep(new Peep(col).init());

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

        return this;
    },

    updateGraph: function () {

        var cubes = this.cubes,
            x,
            y,
            z,
            xl = cubes.length,
            yl = cubes[0].length,
            zl = cubes[0][0].length,
            cube,
            cx,
            cy,
            cz,
            cxl,
            cyl,
            czl,
            state;


        for (x = 0; x < xl; x++) {
            for (y = 0; y < yl; y++) {
                for (z = 0; z < xl; z++) {
                    cube = this.cubes[x][y][z];
                    cxl = cube.graph.length;
                    cyl = cube.graph[0].length;
                    czl = cube.graph[0][0].length;
                    for (cx = 0; cx < cxl; cx++) {
                        for (cy = 0; cy < cyl; cy++) {
                            for (cz = 0; cz < czl; cz++) {
                                state = cube.graph[cx][cy][cz];
                                this.graph[x][y][z][cx][cy][cz] = state;
                            }
                        }
                    }
                }
            }
        }

    },

    tick: function () {

        var epoch = false;
        if ((Date.now() - this.epoch > 3000)) {
            this.epoch = Date.now();
            epoch = true;
        }

        if (epoch) {
            // cubes x
            // cubes y
            // cubes z
                // cells x
                // cells y
                // cells z
        }

        for (var x = 0; x < 3; x++) {
            this.cubes.push([]);
            for (var y = 0; y < 3; y++) {
                this.cubes[x].push([]);
                for (var z = 0; z < 3; z++) {

                    if (epoch) {
                        var ns = [null, null, null, null, null, null];

                        //if (k > 0) ns.push(this.cubes[k - 1][j][i]);
                        //if (k < 2) ns.push(this.cubes[k + 1][j][i]);

                        if (z > 0) ns[2] = this.cubes[x][y][z - 1];
                        if (x < 2) ns[3] = this.cubes[x + 1][y][z];

                        if (z < 2) ns[4] = this.cubes[x][y][z + 1];
                        if (x > 0) ns[5] = this.cubes[x - 1][y][z];


                        this.cubes[x][y][z].tick(ns)
                    } else {
                        this.cubes[x][y][z].tick();
                    }

                }
            }
        }

    }

};
