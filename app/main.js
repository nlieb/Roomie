

import './lib/css/bootstrap.min.css';
import './lib/css/material-kit.css';

import './lib/js/jquery.min.js';
import './lib/js/bootstrap.min.js';
import './lib/js/material.min.js';
import './lib/js/material-kit.js';
import './lib/js/nouislider.min.js';


import './style.scss';
import RoomView from './room';
import work from './worker';
import Options from './options';

import { Chair, Table, GenericObject } from './furniture';
import UIController from './uicontroller';
import VRView from './vr';
//import * as THREE from 'three';

let startState = {
    objects: [
        new Chair([20, 25], 8, 8, {size: { width:100, height:100 }}),
        new Table([50, 40], 24, 12, {size: { width:100, height:100 }})
    ],
    room: {
        size: { width:100, height:100 },
        paths: [{ x:0, y:0, width:20, height:20}],
    },
    
    progress: 0,
};


class App {
    constructor() {
        this.views = {
            roomView: new RoomView(this),
            vrView: new VRView(this),
        };
        const uiController = new UIController(this);
        const options =  Options.options;

        const initialState = startState;

        this.updateState(initialState);
        work(this, startState, options);
    }

    updateState(state) {
        this.state = state;
        this.views.roomView.draw(this.state);
    }
}

const app = new App();

/*let scene, camera, renderer;
let geometry, material, mesh;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}*/

