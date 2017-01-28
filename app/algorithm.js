"use strict";

/*
This function exposes one function, 'compute_room'
that will be called from the interface to find
the optimal room layout.
 */

var compute_room;

(function(){
    function eval_room(){
        
    }

    function generate_room(){


    }


    compute_room = function(room_objects){
        this.inital_temp = 10000;
        this.cool_rate = 1 - 0.003;

        console.log("TETS", this.inital_temp);
        return this.cool_rate;
    }

})();
