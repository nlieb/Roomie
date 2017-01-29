
import * as d3 from 'd3';

export default class RoomView {
    constructor(MainView) {


        this.config = {
            transitionDuration: 200,
            size: 500,
            axisColor: '#ccc',
        };
        this.svg = d3.select('#content').append('svg')
            .classed('room-svg', true)
            .attr('width', this.config.size)
            .attr('height', this.config.size)
            .style('overflow', 'visible');
        this.xAxis = this.svg.append('g').classed('x-axis', true);
        this.yAxis = this.svg.append('g').classed('y-axis', true);
    }

    draw(state) {
        const self = this;
        console.log('draw state', state.room);
        //this.svg.attr('viewBox', '0 0 '+ state.room.size.height + ' ' + state.room.size.width);

        this.scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, this.config.size]);

        //const xScale = d3.scale.linear().domain([0, 100]).range([0, state.room.size.width]);
        const xAxis = d3.svg.axis()
            .scale(this.scale)
            .innerTickSize(-self.config.size)
            .orient('top');

        const yAxis = d3.svg.axis()
            .scale(this.scale)
            .innerTickSize(-self.config.size)
            .orient('left');
        this.xAxis.call(xAxis);
        this.yAxis.call(yAxis);

        this.svg.selectAll('path')
            .style({fill: 'none', stroke: self.config.axisColor});
        this.svg.selectAll('line')
            .style({stroke: self.config.axisColor, 'stroke-width': 0.5});



        const accessibilityAreas = Array.prototype.concat(
            ...state.objects.map(o => o.accessibilityAreas.map(a => ({...a, parent: o}))));

        this.updateAccessibility(state, accessibilityAreas);

        const sel = this.svg.selectAll('image.furniture').data(state.objects, d => d.id);

        const enterFurniture = sel.enter().append('image')
            .classed('furniture active', true)
            .attr('fill', '#000')
            .attr('preserveAspectRatio', 'none')
            .attr( {
                width: d => self.scale(d.width),
                height: d => self.scale(d.height),
                x: d => self.scale(d.p[0] - d.width/2),
                y: d => self.scale(d.p[1] - d.height/2),
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
                width: d => self.scale(d.width),
                height: d => self.scale(d.height),
                x: d => self.scale(d.p[0] - d.width/2),
                y: d => self.scale(d.p[1] - d.height/2),
            })
            //.attr('transform', d => 'rotate('+(d.theta\)+')')
            .style('opacity', 1);


    }

    updateAccessibility(state, data) {
        const self = this;
        const selAccessibility = this.svg.selectAll('rect.accessibility')
            .data(data, (d, i) => d.parent.id + '.' + i);

        const enterAccessibility = selAccessibility.enter().append('rect')
            .classed('accessibility active', true)
            .attr('fill', 'green')
            .attr( {
                width: d => self.scale(d.width),
                height: d => self.scale(d.height),
                x: d => self.scale(d.parent.p[0] + d.a[0] - d.width/2),
                y: d => self.scale(d.parent.p[1] + d.a[1] - d.height/2),
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
                width: d => self.scale(d.width),
                height: d => self.scale(d.height),
                x: d => self.scale(d.parent.p[0] + d.a[0] - d.width/2),
                y: d => self.scale(d.parent.p[1] + d.a[1] - d.height/2),
            })
            .style('opacity', 0.2);
    }
}
