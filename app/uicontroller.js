/**
 * Created by James on 2017-01-28.
 */

import { Chair, Table } from './furniture';

export default class UIController {
    constructor(app) {
        this.app = app;
    }

    addObject(state, type, width, height) {
        let obj;

        //TODO: Random pos
        switch (type) {
            case 'chair':
                obj = new Chair([0, 0], width, height);
                break;
            case 'table':
                obj = new Table([0, 0], width, height);
        }

        state.objects.push(obj);

        this.app.updateState(state);
    }

    removeObject(state, index) {
        state.objects.splice(index, 1);
        this.app.updateState(state);
    }
}