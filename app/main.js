


import RoomView from './room';
import Algorithm from './algorithm';
import Options from './options';

class App {
    constructor() {
        const roomView = new RoomView(this);
        const options =  Options.options;
        const algo = new Algorithm({}, options); 

        let initialState = {
            objects: [],
        };

        roomView.draw(initialState);
        algo.compute_room();
    }
}

const app = new App();
