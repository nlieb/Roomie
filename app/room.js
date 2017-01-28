
import * as d3 from 'd3';

export default class RoomView {
    constructor(MainView) {
        this.selection = d3.select('#content').append('svg').classed('room-svg');
    }

    draw(state) {

    }
}