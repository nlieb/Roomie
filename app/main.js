

//import './lib/material-kit/style.css';
import RoomView from './room';

class App {
    constructor() {
        this.views = {
            roomView: new RoomView(this),
        };

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