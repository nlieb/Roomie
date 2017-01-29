
import * as d3 from 'd3';

export default class RoomView {
    constructor(MainView) {
        this.svg = d3.select('#content').append('svg')
            .classed('room-svg', true)
            .attr('width', 400)
            .attr('height', 400);

        this.config = {
            transitionDuration: 1000
        };
    }

    draw(state) {
        console.log('draw state', state);

        this.svg
            .attr('viewBox', '0 0 '+state.room.size.height + ' ' + state.room.size.width);

        const sel = this.svg.selectAll('rect.furniture').data(state.objects);

        const enter = sel.enter().append('rect')
            .classed('furniture active', true)
            .attr('fill', '#000')
            .attr( {
                width: d => d.width,
                height: d => d.height,
                x: d => Math.random() * (state.room.size.width - d.width),
                y: d => Math.random() * (state.room.size.height - d.height),
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
            .style('opacity', 0.6)
            .attr({
                x: d => d.p[0],
                y: d => d.p[1],
            });
    }
}