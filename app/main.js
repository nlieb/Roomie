

//import './lib/material-kit/style.css';
import RoomView from './room';
import Algorithm from './algorithm';
import Options from './options';

class App {
    constructor() {
        this.views = {
            roomView: new RoomView(this),
        };
        const options =  Options.options;
        const algo = new Algorithm({}, options);
        algo.compute_room();

        const initialState = {
            objects: [],
        };

        this.updateState(initialState);
    }

    updateState(state) {
        this.state = state;
        this.views.roomView.draw(this.state);
    }
}

const app = new App();
