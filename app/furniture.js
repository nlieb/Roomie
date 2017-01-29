/**
 * Created by James on 2017-01-28.
 */

import * as GUID from 'guid';
import VectorMath from './vectormath';
import * as jsts from 'jsts';

class Furniture {
    //TODO: if centre = null => use random pos
    constructor(type, centre, width, height, image, room) {
        this.id = GUID.raw();
        this.room = room;
        this.type = type;

        this.p = centre;

        this.width = width;
        this.height = height;

        this.b = getDiagonal(this.width, this.height);

        this.d = Math.min(this.p[0], this.p[1]);
        this.theta = 0;
        this.thetaWall = 0;

        this.accessibilityAreas = [];
        this.viewFrustum = [];

        this.image = image;

        //this.georoom = jsts.io.bbox([0, 0, this.width, this.height]);
    }

    updatePosition() {
        let geop = jsts.io.Point(this.p);
        let closep = geop.nearestPoints(this.georoom);
        console.log(closep[0] + ' ' + closep[1]);
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

    addViewFrustum() {
        let levels = this.height >> 2; //height / 4: int
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
    constructor(centre, width, height, room) {
        super('chair', centre, width, height, 'chair.png', room);

        this.addAccessibilityArea('x', 2);
        this.addAccessibilityArea('x', -2);
        this.addAccessibilityArea('y', 2);
        this.addAccessibilityArea('y', -2);

        this.addViewFrustum();
    }
}

class Table extends Furniture {
    constructor(centre, width, height, room) {
        super('table', centre, width, height, 'table.png', room);

        this.addAccessibilityArea('x', 3);
        this.addAccessibilityArea('x', -3);
        this.addAccessibilityArea('y', 3);
        this.addAccessibilityArea('y', -3);
    }
}

class GenericObject extends Furniture {
    constructor(type, centre, width, height, image, room) {
        super(type, centre, width, height, image, room);

        this.addAccessibilityArea('x', 3);
        this.addAccessibilityArea('x', -3);
        this.addAccessibilityArea('y', 3);
        this.addAccessibilityArea('y', -3);
    }
}

function getDiagonal(width, height) {
    return VectorMath.magnitude([width / 2, height / 2]);
    //console.log(`Width: ${width} Height: ${height} D: ${d}`);
}

export {
    Chair,
    Table,
    GenericObject,
    getDiagonal,
};
