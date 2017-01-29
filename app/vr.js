/**
 * Created by James on 2017-01-29.
 */

import * as $ from 'jquery';
import * as THREE from 'three';

export default class VRView {
    constructor(app) {
        this.app = app;
        this.init = this.init.bind(this);
        this.animate = this.animate.bind(this);
        $('#btnStartVR').on('click', () => this.startVR());
        $('#btnStart').on('click', () => this.app.start());
    }

    startVR() {
        this.init();
        this.animate();
    }

    init() {

        ///////////
        // SCENE //
        ///////////
        this.scene = new THREE.Scene();
        ////////////
        // CAMERA //
        ////////////
        
        // set the view size in pixels (custom or according to window size)
        // var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
        let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
        // camera attributes
        let VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        // set up camera
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        // add the camera to the scene
        this.scene.add(this.camera);
        // the camera defaults to position (0,0,0)
        // 	so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
        this.camera.position.set(0,600,600);
        this.camera.lookAt(this.scene.position);	
        
        //////////////
        // RENDERER //
        //////////////
        
        // create and start the renderer; choose antialias setting.
        this.renderer = new THREE.WebGLRenderer();
        
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        
        // attach div element to variable to contain the renderer
        document.body.appendChild( this.renderer.domElement );
        // alternatively: to create the div at runtime, use:
        //   container = document.createElement( 'div' );
        //    document.body.appendChild( container );
        
        
        ////////////
        // EVENTS //
        ////////////
        // automatically resize renderer
        //this.THREEx.WindowResize(this.renderer, this.camera);
        // toggle full-screen on given key press
        //this.THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
        
        //////////////
        // CONTROLS //
        //////////////
        // move mouse and: left   click to rotate, 
        //                 middle click to zoom, 
        //                 right  click to pan
        
        let OrbitControls = require('three-orbit-controls')(THREE);
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        
        ///////////
        // STATS //
        ///////////
        
        
        ///////////
        // LIGHT //
        ///////////
        
        // create a light
        let light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        this.scene.add(light);
        let ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
        
        //////////////
        // GEOMETRY //
        //////////////
        let itemMaterial = new THREE.MeshLambertMaterial( {color: 0xff3333} ); 
        //Nathan please loop through stuff in the state here.
        let boxHeight = 150;
        for(let obj of this.app.state.objects) {
            //console.log('VR OBJECT', obj);
            switch(obj.type) {
                case 'chair':
                    boxHeight = 75;
                    break;
                    
                case 'table':
                    itemMaterial = new THREE.MeshLambertMaterial( {color: 0xff9933} );
                    boxHeight = 40;
                    break;
                case 'lamp':
                    break;
                case 'couch':
                    boxHeight = 60;
                    itemMaterial = new THREE.MeshLambertMaterial( {color: 0x3399ff} );
                    break;
                default:
                    return;
            }
            let cubeGeometry = new THREE.CubeGeometry( (obj.width * 10), boxHeight, (obj.height*10));
            let cube = new THREE.Mesh( cubeGeometry, itemMaterial );
            cube.position.set((obj.p[0]*10)-500, boxHeight/2, (obj.p[1]*10)-500);
            this.scene.add( cube );
        }
            
        
        //let itemMaterial = new THREE.MeshLambertMaterial( {color: 0xff3333} ); 
        // Cube parameters: width (x), height (y), depth (z), 
        //        (optional) segments along x, segments along y, segments along z
        //let cubeGeometry = new THREE.CubeGeometry( 200, 150, 100);
        // using THREE.MeshFaceMaterial() in the constructor below
        //   causes the mesh to use the materials stored in the geometry
        //let cube = new THREE.Mesh( cubeGeometry, itemMaterial );
        //cube.position.set(-100, 50, -50);
        //this.scene.add( cube );	


        // create a set of coordinate axes to help orient user
        //    specify length in pixels in each direction
        let axes = new THREE.AxisHelper(100);
        this.scene.add( axes );
        
        ///////////
        // FLOOR //
        ///////////
        
        // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
        let floorTexture = new THREE.MeshBasicMaterial( { color: 0xaaaaaa, side: THREE.BackSide } );
        //floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        //floorTexture.repeat.set( 10, 10 );
        // DoubleSide: render texture on both sides of mesh
        //let floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        let floor = new THREE.Mesh(floorGeometry, floorTexture);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        this.scene.add(floor);
        
        /////////
        // SKY //
        /////////
        
        // recommend either a skybox or fog effect (can't use both at the same time) 
        // without one of these, the scene's background color is determined by webpage background
        // make sure the camera's "far" value is large enough so that it will render the skyBox!
        let skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
        // BackSide: render faces from inside of the cube, instead of from outside (default).
        let skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xfafafa, side: THREE.BackSide } );
        let skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        this.scene.add(skyBox);
        
        // fog must be added to scene before first render
        this.scene.fog = new THREE.FogExp2( 0xfafafa, 0.00025 );
    }

    animate() {
        window.requestAnimationFrame( this.animate );

        this.renderer.render( this.scene, this.camera );

    }
}

