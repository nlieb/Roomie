/**
 * Created by James on 2017-01-28.
 */

import * as $ from 'jquery';
import { Chair, Table, GenericObject } from './furniture';

export default class UIController {
    constructor(app) {
        this.app = app;

        $('#btnAddItem').on('click', () => this.addObject(this.app.state));

        $('table tbody').on('click', 'button.rbutton', function() {
            //TODO: Doesn't werk
            this.removeObject(this.app.state, $(this));
        });

        console.log('yo');
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
        this.createRow(obj);

        this.app.updateState(state);
    }

    //TODO: Doesn't work
    removeObject(state, child) {
        let id = child.parents('tr')[0].val();
        child.parents('tr').remove();

        state.objects.find(o => o.id == id).forEach(function(e, i) {
            this.splice(i, 1);
        }, state.objects);

        this.app.updateState(state);
    }

    createRow(obj) {

        let markup = `<tr id="${obj.id}">
                        <td>${obj.type}</td>
                        <td>${obj.width}</td>
                        <td>${obj.height}</td>
                        <td class="td-actions text-right">
                            <button type="button" rel="tooltip" title="Edit" class="btn btn-success btn-simple btn-xs">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" rel="tooltip" title="Remove" class="btn btn-danger btn-simple btn-xs rbutton">
                                <i class="fa fa-times"></i>
                            </button>
                        </td>
                      </tr>`;

        $('table tbody').append(markup);
    }
}