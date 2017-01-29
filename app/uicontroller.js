/**
 * Created by James on 2017-01-28.
 */

import * as $ from 'jquery';
import { Chair, Table, Couch, GenericObject } from './furniture';

export default class UIController {
    constructor(app) {
        this.app = app;
        const self = this;

        $(document).on('click','.removeItem', function() {
            const $btn = $(this);
            const objArray = self.app.state.objects.filter(d => d.id === $btn.attr('data-id'));
            const obj = objArray.pop();
            const objIdx = self.app.state.objects.indexOf(obj);
            self.app.state.objects.splice(objIdx, 1);
            self.app.updateState(self.app.state);

            $btn.closest('tr').fadeOut();
        });
        $('#btnAddItem').on('click', () => this.addObject(this.app.state));
        $('#btnStart').on('click', () => this.app.start());

        let noUiSlider = require('nouislider'); 

        let sliderWidth = document.getElementById('sliderWidth');
        let sliderHeight = document.getElementById('sliderHeight');

        noUiSlider.create(sliderWidth, {
        start: 100,
        connect: 'lower',
        step: 1,
        range: {
            min: 50,
            max: 150
        },
        });

        let sliderWidthDisplayValue = document.getElementById('sliderWidthDisplayValue');

        sliderWidth.noUiSlider.on('update', function( values, handle ) {
            sliderWidthDisplayValue.innerHTML = 'Room Width: ' + parseInt(values[handle]);
        });

        noUiSlider.create(sliderHeight, {
        start: 100,
        step: 1,
        connect: 'lower',
        range: {
            min: 50,
            max: 150
        }
        });

        let sliderHeightDisplayValue = document.getElementById('sliderHeightDisplayValue');

        sliderHeight.noUiSlider.on('update', function( values, handle ) {
            sliderHeightDisplayValue.innerHTML = 'Room Length: ' + parseInt(values[handle]);
        });

        for(let obj of this.app.state.objects) {
            this.createRow(obj);
        }
    }

    addObject(state) {
        let type = $('input[name="AddTypeInput"]:checked').val();
        let width = parseInt($('#AddWidth').val());
        let height = parseInt($('#AddHeight').val());

        let obj;

        //TODO: Random pos
        const x = Math.random()*this.app.state.room.size.width;
        const y = Math.random()*this.app.state.room.size.height;

        switch (type) {
            case 'chair':
                obj = new Chair([x, y], width, height, state.room);
                break;
            case 'table':
                obj = new Table([x, y], width, height, state.room);
                break;
            case 'lamp':
                obj = new GenericObject(type, [x, y], width, height, 'lamp.png', state.room);
                break;
            case 'couch':
                obj = new Couch([x, y], width, height, state.room);
                break;
            case 'plant':
                obj = new GenericObject(type, [x, y], width, height, 'plant.png', state.room);
                break;
            default:
                return;
        }

        state.objects.push(obj);
        console.log(state.objects);
        this.createRow(obj);

        this.app.updateState(state);
    }

    //TODO: Need to delete off struct 
    removeObject(state, child) {

        let id = child.parents('tr')[0];
        let dataId = id.id;
        child.parents('tr').remove();

        // This part doesnt work, use dataID to find object to remove
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
                            <button type="button" rel="tooltip" title="Remove" data-id="${obj.id}" class="btn btn-danger removeItem btn-simple btn-xs rbutton">
                                <i class="fa fa-times"></i>
                            </button>
                        </td>
                      </tr>`;

        $('table tbody').append(markup);
    }
}

//<button type="button" rel="tooltip" title="Edit" class="btn btn-success btn-simple btn-xs">
//                                <i class="fa fa-edit"></i>
//                            </button>