'use strict';

import vectormath from './vectormath';

/*
This function exposes one function, 'compute_room'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(RoomObjects, options){
        this.inital_temp = options['inital_temp'];
        this.cool_rate = 1 - options['cool_rate'];
        this.objects = RoomObjects;

        return this.cool_rate;

    }

    compute_room(){
        let room = this.generate_room();
        console.log('TES', room);
    }

    eval_room(){


    }

    generate_room(){
        return this.objects;
    }

    accessibilityCost() {
        /**
         * i is the parent object
         * j is the child object
         */

        let cost = 0;

        this.objects.forEach(function(i_objects, i_index, i) {
            this.objects.forEach(function(j_objects, j_index, j) {

                if(i_index === j_index)
                    return;

                for(let area in j.accessibilityAreas) {
                    cost += Math.max(0, 1 - (vectormath.magnitude(vectormath.subtract(i.p, area.a)) / (i.b + area.ad)));
                }

            });
        });

        return cost;
    }

    //TODO: Visibility Cost
}
