'use strict';



export default class Algorithm {
    constructor(RoomObjects, options){
        console.log('TEST', options);
        this.inital_temp = options['inital_temp'];
        this.cool_rate = 1 - options['cool_rate'];
        this.objects = RoomObjects;

        console.log('TETS', this.inital_temp);
        return this.cool_rate;

    }

    compute_room(){


    }
    
    eval_room(){


    }

    generate_room(){


    }

}
