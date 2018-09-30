const si = require('systeminformation');


let socketTimer;
const startTimer = () => {
  console.log("Timer statrted!");
  socketTimer = setTimeout(function () {
    console.log("Timer done!");
  }, 2000);
};
const stopTimer = () => {
  clearTimeout(socketTimer);
};

module.exports = function(io){

  io.on('connection', function (socket) {
    // console.log(os.cpus());
    // si.cpu().then((d) => {
    //   io.emit('systeminformation-cpu', d);
    // });
    // si.networkStats().then(d => {
    //   io.emit('systeminformation-networkStats', d);
    // });
    startTimer(); //"Timer started!", "user disconnected", (after 15s) "Timer done!"

    // socket.on('wsp', function(data){
    //   si.cpu()
    //     .then((d) => {
    //       io.emit('systeminformation-cpu', d);
    //     });
    // });

    socket.on("disconnect" ,function(){
       console.log("user disconnected");
       stopTimer();
     });
  });
};
