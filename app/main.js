

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
        new Chair([20, 25], 8, 8),
        new Table([50, 40], 24, 12)
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

