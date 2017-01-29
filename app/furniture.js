/**
 * Created by James on 2017-01-28.
 */

import * as GUID from 'guid';
import VectorMath from './vectormath';

class Furniture {
    //TODO: if centre = null => use random pos
    constructor(type, centre, width, height, image) {
        this.id = GUID.raw();
        this.type = type;

        this.p = centre;
        this.width = width;
        this.height = height;

        this.b = getDiagonal(this.p, this.width, this.height);

        this.d = Math.min(this.p[0], this.p[1]);
        this.theta = 0;
        this.thetaWall = 0;

        this.accessibilityAreas = [];
        this.viewFrustum = [];

        this.image = image;
    }

    wallCalc() {
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

        area.ad = getDiagonal(area.a, area.width, area.height);

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
            viewBox.vd = getDiagonal(viewBox.v, viewBox.width, viewBox.height);

            this.viewFrustum.push(viewBox);
            offset += 2;
        }
    }
}

class Chair extends Furniture {
    constructor(centre, width, height) {
        super('chair', centre, width, height, 'chair.png');

        this.addAccessibilityArea('x', 2);
        this.addAccessibilityArea('x', -2);
        this.addAccessibilityArea('y', 2);
        this.addAccessibilityArea('y', -2);

        this.addViewFrustum();
    }
}

class Table extends Furniture {
    constructor(centre, width, height) {
        super('table', centre, width, height, 'table.png');

        this.addAccessibilityArea('x', 3);
        this.addAccessibilityArea('x', -3);
        this.addAccessibilityArea('y', 3);
        this.addAccessibilityArea('y', -3);
    }
}

class GenericObject extends Furniture {
    constructor(type, centre, width, height, image) {
        super(type, centre, width, height, image);

        this.addAccessibilityArea('x', 3);
        this.addAccessibilityArea('x', -3);
        this.addAccessibilityArea('y', 3);
        this.addAccessibilityArea('y', -3);
    }
}

function getDiagonal(centre, width, height) {
    return VectorMath.magnitude([width / 2, height / 2]);
    //console.log(`Width: ${width} Height: ${height} D: ${d}`);
}

export {
    Chair,
    Table,
    GenericObject,
    getDiagonal,
};
