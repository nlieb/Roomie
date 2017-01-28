

//import './lib/material-kit/style.css';
import RoomView from './room';
import Algorithm from './algorithm';
import Options from './options';

let start_state = {
    objects: [
        {type: 'table',
         p: [20, 20],
         b:  0, // half diagonal length of the bounding box
         d: 0, // distance to nearest wall
         theta: 0, // angle to nearest wall
         accessibilityAreas: [{ a: [5, 5], theta: 0},
                              { a: [15, 5], theta: 0},
                              { a: [5, 15], theta: 0},
                              { a: [15, 15], theta: 0},
                             ], // ax, ay, atheta relative to px py, theta
         viewFrustum: [{ v: [0, 0], vd: 0, vtheta: 0 },
                       ], // vx, vy, vtheta relative to px, py, theta
         pairs: [], // {id, pairD, pairTheta}
        },
        {type: 'table',
         p: [40, 40],
         b:  0, // half diagonal length of the bounding box
         d: 0, // distance to nearest wall
         theta: 0, // angle to nearest wall
         accessibilityAreas: [{ a: [5, 5], atheta: 0},
                              { a: [15, 5], atheta: 0},
                              { a: [5, 15], atheta: 0},
                              { a: [15, 15], atheta: 0},
                             ], // a, atheta relative to p, theta
         viewFrustum: [{ v: [0, 0], vd: 0, vtheta: 0 },
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
        const algo = new Algorithm(start_state, options); 

        const initialState = {
            objects: [],
        };

        this.updateState(initialState);
	algo.compute_room();
    }

    updateState(state) {
        this.state = state;
        this.views.roomView.draw(this.state);
    }
}

const app = new App();
