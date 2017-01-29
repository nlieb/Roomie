'use strict';

import VectorMath from './vectormath';

/*
This class exposes one important function, 'computeRoom'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(app, state, options){
        this.initalTemp = options['initalTemp'];
        this.temp = options['initalTemp'];
        this.coolRate = 1 - options['coolRate'];
        this.state = state;
        this.room = state.room;
        this.app = app;

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
        console.log('runing');

        this.app.updateState(this.state);
        
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
            if(i++ % 1000 === 0){
                this.app.updateState(this.state);
            }
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

    swapFurniture(room, id1, id2){
        let p1 = room[id1].p;

        room[id1].p = room[id2].p;
        room[id2].p = p1;
        
        return room;
    }
    
    generateRoom(room){
        /**
           Generates a room based off the current room,
           should maybe decrease variation over time?
        **/
        
        let numSwaps = 1;
        for(let i=0; i<numSwaps; ++i){
            let id1 = Math.floor(Math.random() * room.length);
            let id2 = Math.floor(Math.random() * room.length);
            room = this.swapFurniture(room, id1, id2);
        }

        let tempRatio = this.temp/this.initalTemp;
        let g = this.create_gaussian_func(0, tempRatio);
        let r = this.room;
        
        room.forEach(function(fur, i_index) {
            let width = fur.width / 2;
            let height = fur.height / 2;
            let newx = fur.p[0] + g() * width;
            let newy = fur.p[1] + g() * height;
            if (0 <= newx && newx <= r.width) // check if valid x coord
                fur.p[0] = newx;
            if (0 <= newy && newy <= r.height) // check if valid y coord
                fur.p[1] = newy;
        });
        
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
                    let dem = b + ad; //TODO: i.b + area.ad

                    if (dem == 0 || isNaN(dem))
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

                    let b = VectorMath.magnitude(VectorMath.subtract(i.p, [i.p[0] - i.width / 2, i.p[1] - i.height / 2]));

                    for(let viewBox of j.viewFrustum) {
                        let vd = VectorMath.magnitude(VectorMath.subtract(viewBox.v, [viewBox.v[0] - viewBox.width / 2, viewBox.v[1] - viewBox.height / 2]));
                        let dem = b + vd;
                        if (dem == 0 || isNaN(dem))
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

    create_gaussian_func(mean, stdev) {
        let y2;
        let use_last = false;
        return function() {
            let y1;
            if(use_last) {
                y1 = y2;
                use_last = false;
            }
            else {
                let x1, x2, w;
                do {
                    x1 = 2.0 * Math.random() - 1.0;
                    x2 = 2.0 * Math.random() - 1.0;
                    w  = x1 * x1 + x2 * x2;               
                } while( w >= 1.0);
                w = Math.sqrt((-2.0 * Math.log(w))/w);
                y1 = x1 * w;
                y2 = x2 * w;
                use_last = true;
            }

            let retval = mean + stdev * y1;
            if(retval > 0) 
                return retval;
            return -retval;
        };
    }
}

//TODO: updatePosition() updates p and theta, calculates d
