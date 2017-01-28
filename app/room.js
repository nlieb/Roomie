
import * as d3 from 'd3';

export default class RoomView {
    constructor(MainView) {
        this.svg = d3.select('#content').append('svg')
            .classed('room-svg', true)
            .attr('width', 800)
            .attr('height', 800);
    }

    draw(state) {
        console.log('draw state', state);

        this.svg
            .attr('viewbox', '0 0 '+state.room.height + ' ' + state.room.width);
    }
}