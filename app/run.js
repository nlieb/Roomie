import Algorithm from './algorithm';

function app_callback(state){
    postMessage(state);
}

self.onmessage = function(e) {
    let Algo = new Algorithm(e.data.state, e.data.options, app_callback);
    Algo.computeRoom();
};
