ejecta.include('vendor/three.js');
ejecta.include('vendor/OrbitControls.js');

ejecta.include("src/utils/utils.js");
ejecta.include("src/geom.js");
ejecta.include("src/entities/Cube.js");
ejecta.include("src/entities/Peep.js");
ejecta.include("src/entities/Ladder.js");
ejecta.include("src/Level.js");
ejecta.include("src/main.js");

var container = document.createElement( 'div' );
document.body.appendChild( container );

octocho.init(container);