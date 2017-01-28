'use strict';



export default class Algorithm {
    constructor(RoomObjects, options){
        this.inital_temp = options['inital_temp'];
        this.cool_rate = 1 - options['cool_rate'];
        this.objects = RoomObjects;

        return this.cool_rate;

    }

    compute_room(){
        let room = this.generate_room();
        console.log('TES', room);
    }
    
    eval_room(){


    }

    generate_room(){
        return this.objects;
    }

}
