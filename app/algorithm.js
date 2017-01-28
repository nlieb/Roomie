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
        let cur_room = this.generate_room(cur_room);
        let best_room = cur_room;
        let best_cost = this.eval_room(cur_room);
        
        while(this.temp > 1){
            let temp_room = this.generate_room(cur_room);
            let cost = this.eval_room(cur_room);

            if ( this.accept_probability(best_cost, cost) > Math.random() ){
                cur_room = temp_room;
            }
            
            if (cost < best_cost){
                best_room = temp_room;
                best_cost = cost;
            }
            
            this.temp *= this.cool_rate;
        }

        console.log('Best room has a cost of', best_cost);
    }
    
    eval_room(room){
        return Math.random();
    }

    accept_probability(best_score, proposed_score){
        if (best_score < proposed_score) { // if the solution is better, accept it
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        return Math.exp((best_score - proposed_score) / this.temp);
    }

    generate_room(room){
        return this.objects;
    }

    //TODO: Combine cost functions
    accessibilityCost() {
        /**
         * i is the parent object
         * j is the child object
         */

        let cost = 0;

        this.objects.forEach(function(i, i_index) {
            this.objects.forEach(function(j, j_index) {

                if(i_index === j_index)
                    return;

                for(let area of j.accessibilityAreas) {
                    cost += Math.max(0, 1 - (vectormath.magnitude(vectormath.subtract(i.p, area.a)) / (i.b + area.ad)));
                }

            });
        });

        return cost;
    }

    visibilityCost() {
            /**
             * i is the parent object
             * j is the child object
             */

            let cost = 0;

            this.objects.forEach(function(i, i_index) {
                this.objects.forEach(function(j, j_index) {

                    if(i_index === j_index)
                        return;

                    for(let viewBox of j.viewFrustum) {
                        cost += Math.max(0, 1 - (vectormath.magnitude(vectormath.subtract(i.p, viewBox.v)) / (i.b + viewBox.vd)));
                    }

                });
            });

        return cost;
    }

    //TODO: Path cost?

    priorCost(curState, prevState) {
        let dCost = 0, tCost = 0;

        curState.forEach(function(i, i_index) {
            dCost += Math.abs(i.d - prevState[i_index].d);
            tCost += Math.abs(i.theta - prevState[i_index].theta);
        });

        return {dCost, tCost};
    }
}

//TODO: updatePosition() updates p and theta, calculates d