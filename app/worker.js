'use strict';

import MyWorker from 'worker-loader!./run.js';

export default function work(app, state, options){
    let data = {
        'state': state,
        'options': options,
    };
    let worker = new MyWorker();
    worker.onmessage = function(e){
        let state = e.data;
        app.updateState(state);
    };
    worker.postMessage(data);
}
