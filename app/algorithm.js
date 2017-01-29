'use strict';

import VectorMath from './vectormath';
import {updatePosition, getCenterDistance, getAngle} from './furniture';

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
        return JSON.parse(JSON.stringify(obj));
    }

    computeRoom(){
        /**
           Main function of the algorithm, tries to find the best room
           given with the provided room objects
        **/
        let curState = this.generateState(this.clone(this.state));
        let curEnergy = this.evalFurniture(curState);

        // this.animationStates.push(this.clone(curState));
        
        let bestState = this.clone(curState);
        let bestEnergy = curEnergy;

        let i = 1, accepted = 0;
        setTimeout(this.send.bind(this), 1000);

        while(this.temp > 1){
            let newState = this.generateState(this.clone(curState));
            let newEnergy = this.evalFurniture(newState);

            if ( this.acceptProbability(curEnergy, newEnergy) > Math.random() ){
                curState = this.clone(newState);
                curEnergy = newEnergy;

                if(accepted++ % 500 === 0){
                    console.log('Accepted: ' + accepted/i * 100 + '%');
                    this.animationStates.push(this.clone(curState));
                }
            }
            
            if (curEnergy < bestEnergy){
                bestState = this.clone(curState);
                bestEnergy = curEnergy;
            }

            this.temp *= this.coolRate;
            i++;
        }
        
        console.log('Best room has a cost of', bestEnergy, 'iterations', i);
        console.log('Evaluation', this.evalFurniture(bestState));
        this.animationStates.push(this.clone(bestState));
    }

    send(){        
        if(this.animationStates.length){
            let state = this.animationStates.shift();
            this.callback(state);
            setTimeout(this.send.bind(this), 1000);
        }
    }
    
    evalFurniture(state){
        let objs = state.objects;
        let accCost = this.accessibilityCost(objs);
        let visCost = this.visibilityCost(objs);
        
        let [pairDCost, pairTCost] = this.pairwiseCost(state);
        
        return  accCost*100 + pairDCost*10 + pairTCost*100; //accCost*100 + visCost + pairDCost*1 + pairTCost*10; // 0.1*accCost + 0.01*visCost + 1*prevDCost + 10*prevTCost;
    }

    acceptProbability(energy, newEnergy){
        if (newEnergy < energy) { // if the solution is better, accept it
            return 1.0;
        }
        // If the new solution is worse, calculate an acceptance probability
        let exp = (energy - newEnergy) / this.temp * 40;
        let prob = Math.exp(exp);
        return prob;
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
            let newx = fur.p[0] + g() * width;
            let newy = fur.p[1] + g() * height;

            fur.theta += (g() / Math.PI) >> 2;
            fur.theta = fur.theta % (2 * Math.PI);

            if(0 <= (newx - width) && (newx + width) <= state.room.size.width)
                fur.p[0] = newx;
            if(0 <= (newy - height) && (newy + height) <= state.room.size.height)
                fur.p[1] = newy;

            state.objects[i_index] = updatePosition(state, i_index);
        }.bind(this));

        return this.clone(state);
    }

    //TODO: Combine accessibiltyCost and visibilityCost
    accessibilityCost(objs) {
        /**
         * i is the parent object
         * j is the child object
         */

        let cost = 0;
        
        objs.forEach(function(i) {
            objs.forEach(function(j) {

                if(i.id === j.id)
                    return;

                for(let area of j.accessibilityAreas) {
                    let dem = i.b + area.ad;

                    if (dem == 0 || isNaN(dem))
                        throw new Error('Error: Division by 0 at accessibility');

                    cost += Math.max(0, 1 - (VectorMath.magnitude(VectorMath.subtract(i.p, VectorMath.add(j.p, area.a))) / dem));
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

        objs.forEach(function(i) {
            objs.forEach(function(j) {

                if(i.id === j.id)
                    return;

                for(let viewBox of j.viewFrustum) {
                    let dem = i.b + viewBox.vd;
                    if (dem == 0 || isNaN(dem))
                        throw new Error('Error: Division by 0 at visbility');

                    cost += Math.max(0, 1 - (VectorMath.magnitude(VectorMath.subtract(i.p, VectorMath.add(j.p, viewBox.v))) / dem));
                }

            });
        });

        return cost;
    }

    //TODO: Path cost?

    priorCost(state) {
        let dCost = 0, tCost = 0;

        for (let i of state.objects) {

            if(state.positiveExamples[i.type] == null)
                continue;

            dCost += Math.abs(i.d - state.positiveExamples[i.type][0]);
            tCost += Math.abs(i.thetaWall - state.positiveExamples[i.type][1]);
        }

        return [dCost, tCost];
    }

    pairwiseCost(state) {
        let dCost = 0, tCost = 0;
        let curObj = state.objects;

        curObj.forEach(function(i, i_index) {
            if(state.positiveExamples.pairs[i.type] === undefined){
                return;
            }

            curObj.forEach(function(j, j_index) {
                if(i_index == j_index)
                    return;
                
                if(state.positiveExamples.pairs[i.type] == j.type){
                    let dist = getCenterDistance(i, j);
                    let angle = getAngle(i, j);
                    let hdiff = Math.abs(i.height/2 + j.height/2 - dist + 5);
                    let wdiff = Math.abs(i.width/2 + j.width/2 - dist + 5);
                    if(wdiff < hdiff){
                        dCost += hdiff;
                        tCost += angle;
                    }else{
                        dCost += wdiff;
                        tCost += Math.PI/2 - angle;
                    }
                }
            });
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
