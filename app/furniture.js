/**
 * Created by James on 2017-01-28.
 */

import VectorMath from './vectormath';

class Furniture {
    constructor(type, centre, width, height) {
        this.type = type;

        this.p = centre;
        this.width = width;
        this.height = height;

        this.b = this.getDiagonal(this.p, this.width, this.height);

        this.accessibilityAreas = [];
        this.viewFrustum = [];
    }

    wallCalc() {

    }

    static getDiagonal(centre, width, height) {
        return VectorMath.magnitude(VectorMath.subtract(centre, [centre[0] - width / 2, centre[1] - height / 2]));
    }

    /**
     * @param axis: extension axis ('x' | 'y')
     * @param offset: offset PAST face on axis
     */
    addAccessibilityArea(axis, offset) {
        let area = {};

        if(axis == 'x') {
            area.a = [this.p[0] + Math.sign(offset) * this.width / 2 + offset, this.p[1]];
            area.ad = this.getDiagonal(area.a, this.width / 2 + Math.abs(offset), this.height);
        }
        else { //== 'y'
            area.a = [this.p[0], this.p[1] + Math.sign(offset) * this.width / 2 + offset];
            area.ad = this.getDiagonal(area.a, this.width, this.width / 2 + Math.abs(offset));
        }

        this.accessibilityAreas.push(area);
    }

    addViewFrustum() {
        let levels = this.height >> 2; //height / 4: int
        let offset = this.height / 2 + 1;

        for (let i = 0; i < levels; i++) {
            let viewBox = {};
            viewBox.v = [this.p[0], this.p[1] + offset];
            viewBox.vd = this.getDiagonal(viewBox.v, this.width + 2 * i, 2);

            this.viewFrustum.push(viewBox);
            offset += 2;
        }
    }
}

class Chair extends Furniture {
    constructor(centre, width, height) {
        super('chair', centre, width, height);

        this.addAccessibilityArea('x', 2);
        this.addAccessibilityArea('x', -2);
        this.addAccessibilityArea('y', 2);
        this.addAccessibilityArea('y', -2);

        this.addViewFrustum();
    }
}