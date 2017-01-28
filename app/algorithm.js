'use strict';

/*
This function exposes one function, 'compute_room'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(RoomObjects, options){
        console.log('TEST', options);
        this.inital_temp = options['inital_temp'];
        this.cool_rate = 1 - options['cool_rate'];
        this.objects = RoomObjects;

        console.log('TETS', this.inital_temp);
        return this.cool_rate;

    }

    compute_room(){


    }

    eval_room(){


    }

    generate_room(){


    }

    accessibilityCost() {
        let cost = 0;

        this.objects.forEach(function(i_objects, i_index, i) {
            this.objects.forEach(function(j_objects, j_index, j) {

                if(i_index === j_index)
                    return;

                for(let area in j.accessibilityAreas) {
                    cost += Math.max(0, 1 - (vector_magnitude(vector_subtract(i.p, area.a)) / (i.b + area.ad)));
                }

            });
        });

        return cost;
    }


}

function vector_add(v1, v2) {
    let result = [];

    if (v1.length != v2.length)
        throw new Error('Invalid vectors');

    for (let i = 0; i < v1.length; i++)
        result[i] = v1[i] + v2[i];

    return result;
}

function vector_subtract(v1, v2) {
    let result = [];

    if (v1.length != v2.length)
        throw new Error('Invalid vectors');

    for (let i = 0; i < v1.length; i++)
        result[i] = v1[i] - v2[i];

    return result;
}

function vector_magnitude(v) {
    let m = 0;
    for (let e in v) {
        m += e ^ 2;
    }

    return Math.sqrt(m);
}
