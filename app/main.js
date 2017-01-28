


import RoomView from './room';

class App {
    constructor() {
        const roomView = new RoomView(this);

        let initialState = {
            objects: [],
        };

        roomView.draw(initialState);
    }
}

const app = new App();