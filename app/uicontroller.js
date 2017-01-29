/**
 * Created by James on 2017-01-28.
 */

import * as $ from 'jquery';
import { Chair, Table, GenericObject } from './furniture';

export default class UIController {
    constructor(app) {
        this.app = app;

        $('#btnAddItem').on('click', () => this.addObject(this.app.state));
    }

    addObject(state) {
        let type = $('input[name="TypeInput"]:checked').val();
        let width = $('#width').val();
        let height = $('#height').val();

        let obj;

        //TODO: Random pos
        switch (type) {
            case 'chair':
                obj = new Chair([0, 0], width, height);
                break;
            case 'table':
                obj = new Table([0, 0], width, height);
                break;
            case 'lamp':
                obj = new GenericObject(type, [0, 0], width, height, 'lamp.png');
                break;
            default:
                return;
        }

        state.objects.push(obj);

        console.log(state.objects);

        this.app.updateState(state);
    }

    removeObject(state, index) {
        state.objects.splice(index, 1);
        this.app.updateState(state);
    }
}