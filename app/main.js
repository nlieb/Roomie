

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

let startState = {
    objects: [
        {type: 'chair',
         p: [20, 25],
         width: 8,
         height: 8,
         b:  VectorMath.magnitude(VectorMath.subtract(this.p, [this.p[0] - this.width / 2, this.p[1] - this.height / 2])), // half diagonal length of the bounding box
         d: 20, // distance to nearest wall
         thetaWall: 90, // angle to nearest wall
         theta: 0,
         accessibilityAreas: [  { a: [0, 5], ad: 1},
                                { a: [-5, 0], ad: 1},
                                { a: [0, -5], ad: 1},
                                { a: [5, 0], ad: 1},
                             ], // ax, ay, atheta relative to px py, theta
         viewFrustum: [ { v: [0, 5], vd: 1 },
                        { v: [0, 7], vd: 1 },
                        { v: [0, 9], vd: 1 },
                       ], // vx, vy, vtheta relative to px, py, theta
         pairs: [], // {id, pairD, pairTheta}
        },
        {type: 'table',
         p: [50, 40],
         width: 24,
         height: 12,
         b: VectorMath.magnitude(VectorMath.subtract(this.p, [this.p[0] - this.width / 2, this.p[1] - this.height / 2])), // half diagonal length of the bounding box
         d: 40, // distance to nearest wall
         thetaWall: 0, // angle to nearest wall
         theta: 0,
         accessibilityAreas: [  { a: [0, 9], ad: 3},
                                { a: [-15, 0], ad: 3},
                                { a: [0, -9], ad: 3},
                                { a: [15, 0], ad: 3},
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
