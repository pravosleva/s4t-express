const os = require('os');


module.exports = function(io){

  io.on('connection', function (socket) {
    // console.log(os.cpus());
    io.emit('cpus', os.cpus());

    socket.on('wsp', function(data){
      io.emit('cpus', os.cpus());
    });
  });
};
