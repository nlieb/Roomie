'use strict';

import VectorMath from './vectormath';
import updatePosition from './object';

/*
This class exposes one important function, 'computeRoom'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(state, options, callback){
        this.initalTemp = options['initalTemp'];
        this.temp = options['initalTemp'];
        this.coolRate = 1 - options['coolRate'];
        this.state = state;
        this.callback = callback;
        this.animationStates = [];

        return this.coolRate;
    }

    clone(obj) {
        if (null == obj || 'object' != typeof obj) return obj;
        let copy = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }


    computeRoom(){
        /**
           Main function of the algorithm, tries to find the best room
           given with the provided room objects
        **/
        let curState = this.generateState(this.state);
        let curEnergy = this.evalFurniture(curState.objects, curState.objects);
        let bestState = this.clone(curState);
        let bestEnergy = curEnergy;

        let i = 0;
        setTimeout(this.send.bind(this), 1000);

        while(this.temp > 1){
            let newState = this.generateState(curState);
            let newEnergy = this.evalFurniture(newState.objects, curState.objects);

            if ( this.acceptProbability(curEnergy, newEnergy) > Math.random() ){
                curState = this.clone(newState);
                curEnergy = newEnergy;
            }
            
            if (curEnergy < bestEnergy){
                bestState = this.clone(curState);
                bestEnergy = curEnergy;
            }

            this.temp *= this.coolRate;
            if(i++ % 1000 === 0){
		this.animationStates.push(this.clone(newState));
            }
        }
        
         console.log('Best room has a cost of', bestEnergy, 'iterations', i);
    }

    send(){
        if(this.animationStates.length){
            let state = this.animationStates.pop();
            this.callback(state);
        }
        setTimeout(this.send.bind(this), 1000);
    }
    
    evalFurniture(objs, prevObjs){
        let accCost = this.accessibilityCost(objs);
        let visCost = this.visibilityCost(objs);
        let [prevDCost, prevTCost] = this.priorCost(objs, prevObjs);
         
	console.log(`Costs: ${accCost.toString()} ${visCost.toString()} ${prevDCost.toString()} ${prevTCost.toString()}`);
        return 0.1*accCost + 0.01*visCost + 1*prevDCost + 10*prevTCost;
    }

    acceptProbability(energy, newEnergy){
        if (newEnergy < energy) { // if the solution is better, accept it
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        return Math.exp((energy - newEnergy) / this.temp);
    }

    swapFurniture(state, id1, id2){
        let p1 = state.objects[id1].p;

        state.objects[id1].p = state.objects[id2].p;
        state.objects[id2].p = p1;
        
        return state;
    }
    
    generateState(state){
        /**
           Generates a new state based off the current room
        **/
        let numSwaps = 1;
        for(let i=0; i<numSwaps; ++i){
            let id1 = Math.floor(Math.random() * state.objects.length);
            let id2 = Math.floor(Math.random() * state.objects.length);
            state = this.swapFurniture(state, id1, id2);
        }

        let tempRatio = this.temp/this.initalTemp + 0.5;
        let g = this.create_gaussian_func(0, tempRatio);


        state.objects.forEach(function(fur, i_index) {
            let width = fur.width / 2;
            let height = fur.height / 2;
            let newx = fur.p[0] + g() * width * 100;
            let newy = fur.p[1] + g() * height;
            if(0 <= (newx - width) && (newx + width) <= state.room.size.width)
                fur.p[0] = newx;
            if(0 <= (newy - height) && (newy + height) <= state.room.size.height)
                fur.p[1] = newy;

            state.objects[i_index] = updatePosition(fur);
        });

        return this.clone(state);
    }

    //TODO: Combine accessibiltyCost and visibilityCost
    accessibilityCost(objs) {
        /**
         * i is the parent object
         * j is the child object
         */

        let cost = 0;
        
        objs.forEach(function(i, i_index) {
            objs.forEach(function(j, j_index) {

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

    visibilityCost(objs) {
        /**
         * i is the parent object
         * j is the child object
         */

        let cost = 0;

        objs.forEach(function(i, i_index) {
            objs.forEach(function(j, j_index) {

                if(i_index === j_index)
                    return;

                for(let viewBox of j.viewFrustum) {
                    let dem = i.b + viewBox.vd;
                    if (dem == 0 || isNaN(dem))
                        throw new Error('Error: Division by 0 at visbility');

                    cost += Math.max(0, 1 - (VectorMath.magnitude(VectorMath.subtract(i.p, viewBox.v)) / dem));
                }

            });
        });

        return cost;
    }

    //TODO: Path cost?

    priorCost(curObj, prevObj) {
        let dCost = 0, tCost = 0;

        curObj.forEach(function(i, i_index) {
            dCost += Math.abs(i.d - prevObj[i_index].d);
            tCost += Math.abs(i.thetaWall - prevObj[i_index].thetaWall);
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
            return retval;
        };
    }
}

//TODO: updatePosition() updates p and theta, calculates d
