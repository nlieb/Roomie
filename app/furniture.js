/**
 * Created by James on 2017-01-28.
 */

import * as GUID from 'guid';
import VectorMath from './vectormath';

class Furniture {
    //TODO: if centre = null => use random pos
    constructor(type, centre, width, height, image, room, pairwiseCost) {
        this.id = GUID.raw();
        this.room = room;
        this.type = type;

        this.p = centre;

        this.width = width;
        this.height = height;

        this.b = getDiagonal(this.width, this.height);

        this.d = Math.min(this.p[0],
                          this.p[1],
                          room.width - this.p[0],
                          room.height - this.p[1]);
        
        this.theta = 0;
        this.thetaWall = 0;

        this.accessibilityAreas = [{as: [0,0], a:[0,0], width: this.width, height: this.height, ad: this.b}];
        this.viewFrustum = [];

        this.image = image;

        this.pairwiseCost=pairwiseCost;

    }

    roomRect() {
        return [[0, 0], [0, this.room.size.height], [this.room.size.width, this.room.size.height], [this.room.size.width, 0]];
    }

    /**
     * @param axis: extension axis ('x' | 'y')
     * @param offset: offset PAST face on axis
     */
    addAccessibilityArea(axis, offset) {
        let area = {};

        if(axis == 'x') {
            area.a = [Math.sign(offset) * (this.width / 2 + Math.abs(offset)) / 2, 0];
            area.width = this.width / 2 + Math.abs(offset);
            area.height = this.height;
        }
        else { //== 'y'
            area.a = [0, Math.sign(offset) * (this.height / 2 + Math.abs(offset)) / 2];
            area.width = this.width;
            area.height = this.height / 2 + Math.abs(offset);
        }

        area.ad = getDiagonal(area.width, area.height);

        this.accessibilityAreas.push(area);
    }

    addViewFrustum(levels) {
        levels = levels || this.height >> 2; //height / 4: int
        let offset = this.height / 2 + 1;

        for (let i = 0; i < levels; i++) {
            let viewBox = {};
            viewBox.v = [0, offset];
            viewBox.width = this.width + 2 * i;
            viewBox.height = 2;
            viewBox.vd = getDiagonal(viewBox.width, viewBox.height);

            this.viewFrustum.push(viewBox);
            offset += 2;
        }
    }
}

class Chair extends Furniture {
    constructor(centre, width, height, room, pairwiseCost=false) {
        super('chair', centre, width, height, 'chair.png', room, pairwiseCost);

        this.addAccessibilityArea('x', 2);
        this.addAccessibilityArea('x', -2);
        this.addAccessibilityArea('y', 2);
        this.addAccessibilityArea('y', -2);

        this.addViewFrustum();
    }
}

class Table extends Furniture {
    constructor(centre, width, height, room, pairwiseCost=false) {
        super('table', centre, width, height, 'table.png', room, pairwiseCost);

        this.addAccessibilityArea('x', 3);
        this.addAccessibilityArea('x', -3);
        this.addAccessibilityArea('y', 3);
        this.addAccessibilityArea('y', -3);
    }
}

class Couch extends Furniture {
    constructor(centre, width, height, room, pairwiseCost=false) {
        super('couch', centre, width, height, 'couch.png', room, pairwiseCost);

        this.addAccessibilityArea('y', 4);
        this.addAccessibilityArea('x', 1);
        this.addAccessibilityArea('x', -1);

        this.addViewFrustum(4);
    }
}

class GenericObject extends Furniture {
    constructor(type, centre, width, height, image, room, pairwiseCost=false) {
        super(type, centre, width, height, image, room, pairwiseCost);
    }
}

function getDiagonal(width, height) {
    return VectorMath.magnitude([width / 2, height / 2]);
    //console.log(`Width: ${width} Height: ${height} D: ${d}`);
}

function updatePosition(state, i){
    /* Updates all other furniture properties
       based off the x and y */

    let fur = state.objects[i];
    let room = state.room;

    let wt;
    let d = Math.min(fur.p[0], fur.p[1], room.width - fur.p[0], room.height - fur.p[1]);
    if(d == fur.p[0])
        wt = Math.PI / 2;
    else if (d == fur.p[1])
        wt = 0;
    else if (d == room.width - fur.p[0])
        wt = -Math.PI / 2;
    else
        wt = Math.PI;

    let new_furniture = {
        id: fur.id,
        type: fur.type,
        p: fur.p,
        width: fur.width,
        height: fur.height,
        b: getDiagonal(fur.width, fur.height),
        d: d,
        theta: fur.theta,
        thetaWall: fur.theta - wt,
        accessibilityAreas: fur.accessibilityAreas,
        viewFrustum: fur.viewFrustum,
        pairwiseCost: fur.pairwiseCost,
    };

    return new_furniture;
}

// Gets the distance between the nearest corner of two rectangles
function getCornerDistance(fur1, fur2){
    let f1x = fur1.p[0];
    let f1y = fur1.p[1];
    let f2x = fur2.p[0];
    let f2y = fur2.p[1];

    let xdiff = f1x - f2x;
    let ydiff = f1y - f2y;
    let x1add, x2add, y1add, y2add;
    if(xdiff < 0){
        x1add = fur1.width / 2;
        x2add = -fur2.width / 2;
    }else{
        x1add = -fur1.width / 2;
        x2add = fur2.width / 2;
    }
    if(ydiff < 0){
        y1add = fur1.height / 2;
        y2add = -fur2.height / 2;
    }else{
        y1add = -fur1.height / 2;
        y2add = fur2.height / 2;
    }
    
    xdiff = (f1x + x1add) - (f2x + x2add);
    ydiff = (f1y + y1add) - (f2y + y2add);
    
    return Math.sqrt(xdiff*xdiff + ydiff*ydiff);
}

function getCenterDistance(fur1, fur2){
    let f1x = fur1.p[0];
    let f1y = fur1.p[1];
    let f2x = fur2.p[0];
    let f2y = fur2.p[1];

    let xdiff = f1x - f2x;
    let ydiff = f1y - f2y;
    
    return Math.sqrt(xdiff*xdiff + ydiff*ydiff);
}


function getAngle(fur1, fur2){
    let f1x = fur1.p[0];
    let f1y = fur1.p[1];
    let f2x = fur2.p[0];
    let f2y = fur2.p[1];

    let xdiff = Math.abs(f1x - f2x);
    let ydiff = Math.abs(f1y - f2y);
    
    return Math.atan2(ydiff, xdiff);
}

export {
    Chair,
    Table,
    Couch,
    GenericObject,
    getDiagonal,
    getCornerDistance,
    getCenterDistance,
    getAngle,
    updatePosition,
};
