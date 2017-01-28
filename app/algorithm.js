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
        let curEnergy = this.evalRoom(curRoom);
        let bestRoom = curRoom;
        let bestEnergy = curEnergy;
        
        while(this.temp > 1){
            let newRoom = this.generateRoom(curRoom);
            let newEnergy = this.evalRoom(newRoom);

            if ( this.acceptProbability(curEnergy, newEnergy) > Math.random() ){
                curRoom = newRoom;
                curEnergy = newEnergy;
            }
            
            if (curEnergy < bestEnergy){
                bestRoom = curRoom;
                bestEnergy = curEnergy;
            }

            this.temp *= this.coolRate;
        }
        console.log('Best room has a cost of', bestEnergy);
    }
    
    evalRoom(room){
        let accCost = this.accessibilityCost(room);
        let visCost = this.visibilityCost(room);
        
        return 0.1*accCost + 0.01*visCost;
    }

    acceptProbability(cost, newCost){
        if (newCost < cost) { // if the solution is better, accept it
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        return Math.exp((newCost - cost) / this.temp);
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
                    let dem = i.b + area.ad;
                        if (dem == 0)
                            throw new Error('Error: Division by 0 at accessibility');
                    cost += Math.max(0, 1 - (vectormath.magnitude(vectormath.subtract(i.p, area.a)) / dem));
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
                        let dem = i.b + viewBox.vd;
                        if (dem == 0)
                            throw new Error('Error: Division by 0 at visbility');

                        cost += Math.max(0, 1 - (vectormath.magnitude(vectormath.subtract(i.p, viewBox.v)) / dem));
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
