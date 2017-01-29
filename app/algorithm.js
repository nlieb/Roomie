'use strict';

import VectorMath from './vectormath';

/*
This class exposes one important function, 'computeRoom'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(app, state, options){
        this.temp = options['initalTemp'];
        this.coolRate = 1 - options['coolRate'];
        this.state = state;
        this.app = app;

        console.log('TEST', state.objects);

        return this.coolRate;

    }

    computeRoom(){
        /**
           Main function of the algorithm, tries to find the best room
           given with the provided room objects
        **/
        let curRoom = this.generateRoom(this.state.objects);
        let curEnergy = this.evalRoom(curRoom, curRoom);
        let bestRoom = curRoom;
        let bestEnergy = curEnergy;

        let i = 0;
        while(this.temp > 1){
            let newRoom = this.generateRoom(curRoom);
            let newEnergy = this.evalRoom(newRoom, curRoom);

            if ( this.acceptProbability(curEnergy, newEnergy) > Math.random() ){
                curRoom = newRoom;
                curEnergy = newEnergy;
            }
            
            if (curEnergy < bestEnergy){
                bestRoom = curRoom;
                bestEnergy = curEnergy;
            }

            this.temp *= this.coolRate;
            if(i++ % 1000 === 0)
                this.app.updateState(this.state);
        }
        console.log('Best room has a cost of', bestEnergy);
        this.app.updateState(this.state);
    }
    
    evalRoom(room, prevRoom){
        let accCost = this.accessibilityCost(room);
        let visCost = this.visibilityCost(room);
        let [prevDCost, prevTCost] = this.priorCost(room, prevRoom);

        return 0.1*accCost + 0.01*visCost;
    }

    acceptProbability(energy, newEnergy){
        if (newEnergy < energy) { // if the solution is better, accept it
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        return Math.exp((energy - newEnergy) / this.temp);
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

                let b = VectorMath.magnitude(VectorMath.subtract(i.p, [i.p[0] - i.width / 2, i.p[1] - i.height / 2]));

                for(let area of j.accessibilityAreas) {
                    let ad = VectorMath.magnitude(VectorMath.subtract(area.a, [area.a[0] - area.width / 2, area.a[1] - area.height / 2]));
                    let dem = b + ad; //i.b + area.ad

                    if (dem == 0)
                        throw new Error('Error: Division by 0 at accessibility');

                    //TODO: Consider that area is relative to p
                    cost += Math.max(0, 1 - (VectorMath.magnitude(VectorMath.subtract(i.p, area.a)) / dem));
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

                        cost += Math.max(0, 1 - (VectorMath.magnitude(VectorMath.subtract(i.p, viewBox.v)) / dem));
                    }

                });
            });

        return cost;
    }

    //TODO: Path cost?

    priorCost(curRoom, prevRoom) {
        let dCost = 0, tCost = 0;

        curRoom.forEach(function(i, i_index) {
            dCost += Math.abs(i.d - prevRoom[i_index].d);
            tCost += Math.abs(i.thetaWall - prevRoom[i_index].thetaWall);
        });

        return [dCost, tCost];
    }
}

//TODO: updatePosition() updates p and theta, calculates d
