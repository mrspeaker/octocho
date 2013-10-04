var geom = {

    vec3: function (x, y, z) {
        return new THREE.Vector3(x || 0, y || 0, z || 0);
    },

    col: function (c) {
        return new THREE.Color(c);
    },

    colHSL: function (h, s, l) {
        var col = new THREE.Color();
        col.setHSL(h, s, l);
        return col;
    },

    container: function (pos) {
        var obj = new THREE.Object3D();
        obj.position = pos;
        return obj;
    },

    basicCube: function (color) {
        return new THREE.Mesh(
            new THREE.CubeGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                transparent: true,
                color: color,
                wireframe: true,
                opacity: 0.2
            })
        );
    },

    basicPlane: function (color, mat) {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({
                transparent: true,
                //color: color,
                side: THREE.DoubleSide,
                map: octocho.materials[mat]
            })
        );
    },

    basicCube2: function (color, mat) {
        return new THREE.Mesh(
            new THREE.CubeGeometry(1, 0.05, 1, 1, 1, 1),
            new THREE.MeshFaceMaterial(mat)
        );
    },

    peep: function (peep) {
        return new THREE.Mesh(
            new THREE.CubeGeometry(peep.w, peep.h, peep.w),
            new THREE.MeshLambertMaterial({color: peep.col})
        );
    },

    cubeCol: function (dims, color) {

        return new THREE.Mesh(
            new THREE.CubeGeometry(dims.x, dims.y, dims.z),
            new THREE.MeshPhongMaterial({
                transparent: true,
                opacity: 0.7,
                color: color})
        );
    },

    cube: function (dims, material) {

        return new THREE.Mesh(
            new THREE.CubeGeometry(dims.x, dims.y, dims.z),
            new THREE.MeshPhongMaterial({
                transparent: true,
                map: material
            })
        );
    },
    plane: function () {}

}