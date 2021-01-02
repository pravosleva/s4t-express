const si = require('systeminformation');


const MakeTimer = (ms = 3000) => {
  return () => {
    let socketTimer;
    const startTimer = (cb) => {
      // console.log("Timer started!");
      socketTimer = setTimeout(function () {
        // console.log("Timer done and will be restarted.");
        if (cb) { cb() }
        startTimer(cb);
      }, ms);
    };
    const stopTimer = () => clearTimeout(socketTimer);
    return { startTimer, stopTimer };
  };
};

const timer1 = MakeTimer(2000)();
// const timer2 = MakeTimer()();
// const timer3 = MakeTimer()();
const timer4 = MakeTimer(10000)();
const timer5 = MakeTimer(2000)();
const timer6 = MakeTimer(2000)();

module.exports = function(io){

  io.on('connection', function (socket) {
    timer1.startTimer(() => si.cpu().then(d => socket.emit('systeminformation-cpu', d)));
    // timer2.startTimer(() => si.networkStats().then(d => io.emit('systeminformation-networkStats', d)));
    // timer3.startTimer(() => si.dockerContainerStats().then(d => io.emit('systeminformation-dockerContainerStats', d)));
    timer4.startTimer(() => si.processes().then(d => socket.emit('systeminformation-processes', d)));
    timer5.startTimer(() => si.currentLoad().then(d => socket.emit('systeminformation-currentLoad', d)));
    timer6.startTimer(() => si.mem().then(d => socket.emit('systeminformation-mem', d)));

    // EXAMPLE
    // socket.on('wsp', function(data){
    //   si.cpu()
    //     .then((d) => {
    //       io.emit('systeminformation-cpu', d);
    //     });
    // });

    socket.on("disconnect" ,function(){
       console.log("User disconnected");
       timer1.stopTimer();
       // timer2.stopTimer();
       // timer3.stopTimer();
       timer4.stopTimer();
       timer5.stopTimer();
     });
  });
};
