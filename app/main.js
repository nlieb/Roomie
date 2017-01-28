

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

let startState = {
    objects: [
        {type: 'table',
         p: [20, 20],
         b:  1, // half diagonal length of the bounding box
         d: 2, // distance to nearest wall
         theta: 0, // angle to nearest wall
         accessibilityAreas: [{ a: [5, 5], ad: 1},
                              { a: [15, 5], ad: 1},
                              { a: [5, 15], ad: 1},
                              { a: [15, 15], ad: 1},
                             ], // ax, ay, atheta relative to px py, theta
         viewFrustum: [{ v: [0, 0], vd: 1, vtheta: 0 },
                       ], // vx, vy, vtheta relative to px, py, theta
         pairs: [], // {id, pairD, pairTheta}
        },
        {type: 'table',
         p: [40, 40],
         b:  0, // half diagonal length of the bounding box
         d: 0, // distance to nearest wall
         theta: 0, // angle to nearest wall
         accessibilityAreas: [{ a: [5, 5], ad: 1},
                              { a: [15, 5], ad: 1},
                              { a: [5, 15], ad: 1},
                              { a: [15, 15], ad: 1},
                             ], // a, atheta relative to p, theta
         viewFrustum: [{ v: [0, 0], vd: 1, vtheta: 0 },
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
        const algo = new Algorithm(startState, options); 

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
