
import * as d3 from 'd3';

export default class RoomView {
    constructor(MainView) {
        this.svg = d3.select('#content').append('svg')
            .classed('room-svg', true)
            .attr('width', 800)
            .attr('height', 800);

        this.config = {
            transitionDuration: 1000
        };
    }

    draw(state) {
        console.log('draw state', state);

        this.svg
            .attr('viewbox', '0 0 '+state.room.size.height + ' ' + state.room.size.width);

        const sel = this.svg.selectAll('rect.furniture').data(state.objects);

        const enter = sel.enter().append('rect')
            .classed('furniture active', true)
            .attr('fill', '#333')
            .attr( {
                width: 20,
                height: 20,
            })
            .style('opacity', 0);

        const exit = sel.exit()
            .classed('active', false)
            .transition()
            .duration(this.config.transitionDuration)
            .style('opacity', 0)
            .remove();

        const enterUpdate = this.svg.selectAll('rect.furniture.active')
            .transition()
            .duration(this.config.transitionDuration)
            .style('opacity', 1);
    }
}