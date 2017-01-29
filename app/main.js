

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

let startState = {
    positiveExamples: {
        'chair': [18, 0],
        'table': [50, Math.PI / 2],
        'pairs': {'table': 'chair'}
    },
    objects: [
        new Chair([20, 25], 8, 8, {size: { width:100, height:100 }}),
        new Chair([20, 25], 8, 8, {size: { width:100, height:100 }}),
        new Chair([20, 25], 8, 8, {size: { width:100, height:100 }}),
        new Table([50, 40], 24, 12, {size: { width:100, height:100 }}),
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

        this.state = startState;

        const uiController = new UIController(this);
        this.options =  Options.options;

        this.updateState(this.state);
    }

    start(){
        work(this, this.state, this.options);
    }

    updateState(state) {
        this.state = state;
        this.views.roomView.draw(this.state);
    }
}

const app = new App();

