'use strict';

import vectormath from './vectormath';

/*
This function exposes one function, 'compute_room'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(RoomObjects, options){
        this.temp = options['inital_temp'];
        this.cool_rate = 1 - options['cool_rate'];
        this.objects = RoomObjects;

        return this.cool_rate;

    }

    compute_room(){
        /*let cur_room = this.generate_room();
        let cur_room_score = this.eval_room(cur_room);
        let best_room = cur_room;
        let best_room_score = cur_room_score;

        while(this.temp > 1){
            cur_room = this.generate_room();
            cur_room_score = this.eval_room(cur_room);

            if ( this.accept_probability(best_score, proposed_score) > Math.random()){

            }

            if (cur_room_score > best_room_score){
                best_room = cur_room;
                best_room_score = cur_room_score;
            }

            this.temp *= this.cool_rate;
        }*/
    }

    eval_room(room){
        this.temp;

    }

    accept_probability(best_score, proposed_score){

        // this.temp


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
                    cost += Math.max(0, 1 - (vector_magnitude(vector_subtract(i.p, area.a)) / (i.b + area.ad)));
                }

            });
        });

        return cost;
    }

    //TODO: Visibility Cost
}
