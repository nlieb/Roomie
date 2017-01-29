'use strict';

import {getDiagonal} from './furniture';

export default function updatePosition(fur){
    /* Updates all other furniture properties
       based off the x and y */
    let new_furniture = {
        id: fur.id,
        type: fur.type,
        p: fur.p,
        width: fur.width,
        height: fur.height,
        b: getDiagonal(fur.p, fur.width, fur.height),
        d: Math.min(fur.p[0], fur.p[1]),
        theta: 0,
        thetaWall: 0,
        accessibilityAreas: fur.accessibilityAreas,
        viewFrustum: fur.viewFrustum,
    };

    return new_furniture;
}
