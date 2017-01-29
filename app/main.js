

import './lib/css/bootstrap.min.css';
import './lib/css/material-kit.css';

import './lib/js/jquery.min.js';
import './lib/js/bootstrap.min.js';
import './lib/js/material.min.js';
import './lib/js/material-kit.js';
import './lib/js/nouislider.min.js';


import './style.scss';
import RoomView from './room';
import Algorithm from './algorithm';
import Options from './options';

import VectorMath from './vectormath';

let noUiSlider = require('nouislider'); 

let sliderWidth = document.getElementById('sliderWidth');
let sliderHeight = document.getElementById('sliderHeight');

noUiSlider.create(sliderWidth, {
  start: 100,
  connect: 'lower',
  step: 1,
  range: {
    min: 50,
    max: 150
  },
});

let sliderWidthDisplayValue = document.getElementById('sliderWidthDisplayValue');

sliderWidth.noUiSlider.on('update', function( values, handle ) {
    sliderWidthDisplayValue.innerHTML = 'Room Width: ' + parseInt(values[handle]);
});

noUiSlider.create(sliderHeight, {
  start: 100,
  step: 1,
  connect: 'lower',
  range: {
    min: 50,
    max: 150
  }
});

let sliderHeightDisplayValue = document.getElementById('sliderHeightDisplayValue');

sliderHeight.noUiSlider.on('update', function( values, handle ) {
    sliderHeightDisplayValue.innerHTML = 'Room Length: ' + parseInt(values[handle]);
});




let startState = {
    objects: [
        {type: 'chair',
         p: [20, 25],
         width: 8,
         height: 8,
         b: 1, // half diagonal length of the bounding box
         d: 20, // distance to nearest wall
         thetaWall: Math.PI / 2, // angle to nearest wall
         theta: 0,
         accessibilityAreas: [  { a: [0, 3], width: 8, height: 6 }, // + ad
                                { a: [-3, 0], width: 6, height: 8},
                                { a: [0, -3], width: 6, height: 8},
                                { a: [3, 0], width: 8, height: 6},
                             ], // ax, ay, atheta relative to px py, theta
         viewFrustum: [ { v: [0, 5], width: 8, height: 2 }, // +vd
                        { v: [0, 7], width: 10, height: 2 },
                        { v: [0, 9], width: 12, height: 2 },
                       ], // vx, vy, vtheta relative to px, py, theta
         pairs: [], // {id, pairD, pairTheta}
        },
        {type: 'table',
         p: [50, 40],
         width: 24,
         height: 12,
         b: 1, // half diagonal length of the bounding box
         d: 40, // distance to nearest wall
         thetaWall: 0, // angle to nearest wall
         theta: 0,
         accessibilityAreas: [  { a: [0, 6], width: 24, height: 12 },
                                { a: [-9, 0], width: 18, height: 12 },
                                { a: [0, -6], width: 24, height: 12 },
                                { a: [9, 0], width: 18, height: 12 },
                             ], // ax, ay, atheta relative to px py, theta
         viewFrustum: [
                       ], // vx, vy, vtheta relative to px, py, theta
         pairs: [], // {id, pairD, pairTheta}
        }
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
        };
        const options =  Options.options;
        const algo = new Algorithm(this, startState, options);

        const initialState = startState;

        this.updateState(initialState);
        algo.computeRoom();
    }

    updateState(state) {
        this.state = state;
        this.views.roomView.draw(this.state);
    }
}

const app = new App();
