'use strict';

/*
This function exposes one function, 'compute_room'
that will be called from the interface to find
the optimal room layout.
 */

export default class Algorithm {
    constructor(RoomObjects, Options){
        this.inital_temp = 10000;
        this.cool_rate = 1 - 0.003;
        this.objects = RoomObjects

        console.log('TETS', this.inital_temp);
        return this.cool_rate;

    }

    start(){


    }
    
    eval_room(){


    }

    generate_room(){


    }

}

exports.start = start;
