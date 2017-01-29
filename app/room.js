
import * as d3 from 'd3';

export default class RoomView {
    constructor(MainView) {
        this.svg = d3.select('#content').append('svg')
            .classed('room-svg', true)
            .attr('width', 500)
            .attr('height', 500)
            .style('overflow', 'visible');

        this.xAxis = this.svg.append('g').classed('x-axis', true);
        this.yAxis = this.svg.append('g').classed('y-axis', true);

        this.config = {
            transitionDuration: 200
        };
    }

    draw(state) {
        console.log('draw state', state.objects[0].p[0]);
        this.scale = d3.scale.linear()
            .domain([0, state.room.size.width])
            .range([0, state.room.size.width]);

        const xAxis = d3.svg.axis()
            .tickSize([-3, 3])
            .ticks(10)
            .scale(this.scale)
            .orient('top');

        const yAxis = d3.svg.axis()
            .tickSize([3, 3])
            .ticks(10)
            .scale(this.scale)
            .orient('left');
        this.xAxis.call(xAxis);
        this.yAxis.call(yAxis);

        this.svg.attr('viewBox', '0 0 '+ state.room.size.height + ' ' + state.room.size.width);

        const accessibilityAreas = Array.prototype.concat(
            ...state.objects.map(o => o.accessibilityAreas.map(a => ({...a, parent: o}))));

        this.updateAccessibility(state, accessibilityAreas);

        const sel = this.svg.selectAll('image.furniture').data(state.objects, d => d.id);

        const enterFurniture = sel.enter().append('image')
            .classed('furniture active', true)
            .attr('fill', '#000')
            .attr('preserveAspectRatio', 'none')
            .attr( {
                width: d => d.width,
                height: d => d.height,
                x: d => d.p[0] - d.width/2,
                y: d => d.p[1] - d.height/2,
            })
            .attr('xlink:href', d => 'public/img/' + d.image)
            .style('opacity', 0);


        const exit = sel.exit()
            .classed('active', false)
            .transition()
            .duration(this.config.transitionDuration)
            .style('opacity', 0)
            .remove();

        const enterUpdateFurniture = this.svg.selectAll('image.furniture.active')
            .transition()
            .duration(this.config.transitionDuration)
            .attr( {
                width: d => d.width,
                height: d => d.height,
                x: d => d.p[0] - d.width/2,
                y: d => d.p[1] - d.height/2,
            })
            .style('opacity', 1);


    }

    updateAccessibility(state, data) {
        const selAccessibility = this.svg.selectAll('rect.accessibility')
            .data(data, (d, i) => d.parent.id + '.' + i);

        const enterAccessibility = selAccessibility.enter().append('rect')
            .classed('accessibility active', true)
            .attr('fill', 'green')
            .attr( {
                width: d => d.width,
                height: d => d.height,
                x: d => d.parent.p[0] + d.a[0] - d.width/2,
                y: d => d.parent.p[1] + d.a[1] - d.height/2,
            })
            .style('opacity', 0);

        const exitAccessibility = selAccessibility.exit()
            .classed('active', false)
            .transition()
            .duration(this.config.transitionDuration)
            .style('opacity', 0)
            .remove();

        const enterUpdateAccessibility = this.svg.selectAll('rect.active.accessibility')
            .transition()
            .duration(this.config.transitionDuration)
            .attr( {
                width: d => d.width,
                height: d => d.height,
                x: d => d.parent.p[0] + d.a[0] - d.width/2,
                y: d => d.parent.p[1] + d.a[1] - d.height/2,
            })
            .style('opacity', 0.2);
    }
}
