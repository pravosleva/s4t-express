const os = require('os');


module.exports = function(io){

  io.on('connection', function (socket) {
    // console.log(os.cpus());
    io.emit('os-cpus', os.cpus());

    socket.on('wsp', function(data){
      io.emit('os-cpus', os.cpus());
    });
  });
};
