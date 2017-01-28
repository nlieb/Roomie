'use strict';

import vectormath from './vectormath';

/*
This class exposes one important function, 'computeRoom'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(state, options){
        this.temp = options['initalTemp'];
        this.coolRate = 1 - options['coolRate'];
        this.state = state;

        console.log('TEST', state.objects);

        return this.coolRate;

    }

    computeRoom(){
        /**
           Main function of the algorithm, tries to find the best room
           given with the provided room objects
        **/
        let curRoom = this.generateRoom(this.state.objects);
        let bestRoom = curRoom;
        let bestCost = this.evalRoom(curRoom);
        
        while(this.temp > 1){
            let tempRoom = this.generateRoom(curRoom);
            let cost = this.evalRoom(curRoom);

            if ( this.acceptProbability(bestCost, cost) > Math.random() ){
                curRoom = tempRoom;
            }
            
            if (cost < bestCost){
                bestRoom = tempRoom;
                bestCost = cost;
            }
            
            this.temp *= this.coolRate;
        }
        console.log('Best room has a cost of', bestCost);
    }
    
    evalRoom(room){
        let accCost = this.accessibilityCost(room);
        let visCost = this.visibilityCost(room);
        
        return 0.1*accCost + 0.01*visCost;
    }

    acceptProbability(bestScore, proposedScore){
        if (bestScore < proposedScore) { // if the solution is better, accept it
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        return Math.exp((bestScore - proposedScore) / this.temp);
    }

    generateRoom(room){
        return room;
    }

    //TODO: Combine accessibiltyCost and visibilityCost
    accessibilityCost(room) {
        /**
         * i is the parent object
         * j is the child object
         */

        let cost = 0;
        
        room.forEach(function(i, i_index) {
            room.forEach(function(j, j_index) {

                if(i_index === j_index)
                    return;

                for(let area of j.accessibilityAreas) {
                    cost += Math.max(0, 1 - (vectormath.magnitude(vectormath.subtract(i.p, area.a)) / (i.b + area.ad)));
                }

            });
        });

        return cost;
    }

    visibilityCost(room) {
            /**
             * i is the parent object
             * j is the child object
             */

            let cost = 0;

            room.forEach(function(i, i_index) {
                room.forEach(function(j, j_index) {

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