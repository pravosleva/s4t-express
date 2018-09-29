//let other = require('./other');

module.exports = function(io){
  let theGameState = {
    clientlist: [],
    playerlist: [],
    started: false,
    chatHistory: [],
  };
	let cards = require('cards');
  function get36(){// We should create 36 card (not Poker but Fool)
    // New empty deck:
    let deck = new cards.Deck(); // Instead new cards.PokerDeck();
    // Add 36 cards:
    ['club', 'diamond', 'heart', 'spade'].map(function(suit, iS, suits){// 'club', 'diamond', 'heart', 'spade'
      for(let i=6, max=10; i<=max; i++){// 6 to 10
        deck.add(new cards.Card(suit, i));
      };
      ['J', 'Q', 'K', 'A'].map(function(rank, iR, ranks){// 'J', 'Q', 'K', 'A'
        deck.add(new cards.Card(suit, rank));
      }, this);
    }, this);//console.log(deck);
    deck.shuffleAll();
    //let card = deck.draw();
    return deck;
  };
  let deck;//= get36();
  //console.log(deck);
  //console.log(deck.draw());
  const startGameDelay = (ms=1000) => {
    return new Promise(function(resolve, reject){
      //console.log(theGameState);
      setTimeout(function(){
        //console.log(typeof theGameState.playerlist.length, theGameState.playerlist.length)
        if(theGameState.playerlist.length > 1){
          resolve();
        }else{
          console.log(typeof theGameState.playerlist.length, theGameState.playerlist.length, ' is not > 1')
          reject();
        }
      }, ms);
    });
  };// Usage: delay(3000).then(()=>{ /**/ });
  function getCurrentTime() {
    let datetime = new Date(),
        hours = datetime.getHours(),
        minutes = datetime.getMinutes(),
        seconds = datetime.getSeconds();
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    return (hours + ':' + minutes + ':' + seconds);
  };
  function chat(msg, cb){
    // This fn should update the theGameState.chatHistory then call cb()
    if(theGameState.chatHistory.length >= 30){
      theGameState.chatHistory.shift();
      theGameState.chatHistory.push(msg);
    }else{ theGameState.chatHistory.push(msg); }
    cb();
  };

  // --- --- ---
  //               IO
  // --- --- ---

  io.on('connection', function (socket) {
    //other(); // Tested.

    theGameState.clientlist.push({ socketId: socket.id });//console.log(`Users: ${theGameState.clientlist.length}`);

    // First test by Server & Client
    console.log(`Connection detected! Name should be requested / clients: ${theGameState.clientlist.length} players: ${theGameState.playerlist.length}`);
    io.emit('UPDATE_PEOPLE_NUMBERS', { clientsNumber: theGameState.clientlist.length, playersNumber: theGameState.playerlist.length });

    socket.emit(
      'TEST_BY_SERVER',
      {
        socketId: socket.id,
        clientsNumber: theGameState.clientlist.length,
				playersNumber: theGameState.playerlist.length,
        theGameStarted: theGameState.started,
        reporter: "Service Bot",
        inGame: false,
      }
    );
    //console.log(`EMITED to ${socket.id}: TEST_BY_SERVER / clients: ${theGameState.clientlist.length} players: ${theGameState.playerlist.length}`);
    chat(`[ ${getCurrentTime()} ] Service Bot: ${socket.id} connected... What's your name?`, function(){
      io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
    });

    // Add Client name to his Object in theGameState.clientlist:
    socket.on('ADD_CLIENT_NAME_PLEASE', function(data){
      theGameState.clientlist.map(function(cle, i, a){
        if(cle.socketId===socket.id){ cle.name = data.reporter; }
      }, this);
      chat(`[ ${getCurrentTime()} ] Service Bot: ${data.reporter} has been fixed to clientlist...`, function(){
        io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
      });
      socket.emit('YOU_ARE_WELCOME', { nameToSet: data.reporter,});
      //console.log(`EMITED to ${data.reporter}: YOU_ARE_WELCOME / clients: ${theGameState.clientlist.length} players: ${theGameState.playerlist.length}`);
      io.emit('UPDATE_PEOPLE_NUMBERS', { clientsNumber: theGameState.clientlist.length, playersNumber: theGameState.playerlist.length });
      //console.log(`EMITED: UPDATE_PEOPLE_NUMBERS`);
    });

    socket.on('I_AM_READY_TO_PLAY', function(data){
      if(theGameState.started===false){// We can do it!
        let msg = ``;
        theGameState.clientlist.map(function(e, i, a){
          if(e.socketId===socket.id){// В его объекте
            if(// Если он отсутствует в текущем playerlist, добавим
              theGameState.playerlist.find(function(player, iPlayer, players){
                return player.socketId === socket.id;
              }, this) === undefined
            ){
              theGameState.playerlist.push(e);
              if(theGameState.playerlist.length===2){
                chat(`[ ${getCurrentTime()} ] Service Bot: 20 seconds to start!`, function(){
                  io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
                });
                startGameDelay(20000).then(()=>{
                  theGameState.started = true;
                  io.emit('START_GAME', { playersNumber: theGameState.playerlist.length, reporter: `Service Bot`, theGameStarted: theGameState.started });
                  io.emit('YOU_ARE_IN_GAME', { playerlist: theGameState.playerlist });
                  chat(`[ ${getCurrentTime()} ] Service Bot: GAME HAS BEEN STARTED!`, function(){
                    io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
                  });
                  // Раздать карты
                  //...
                }).catch((err)=>{console.log(err);
                  chat(`[ ${getCurrentTime()} ] Service Bot: TROUBLES! Sorry, the Game wasn't started: ${err.message}`, function(){
                    io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
                  });
                });
              }else{ /* Nonhing. Only for second player! */ }
              msg = `${data.reporter}'s name has been added to theGameState.playerlist!`;
            }else{
              msg = `No, ${data.reporter}. You has been invited to playerlist early...`;console.log(msg);
            };
            io.emit('UPDATE_PEOPLE_NUMBERS', { clientsNumber: theGameState.clientlist.length, playersNumber: theGameState.playerlist.length });
            console.log(`EMITED: UPDATE_PEOPLE_NUMBERS`);
  				}// Player has added [or not], timer has started [or not], peoplelists was sent to all clients
        }, this);
        chat(`[ ${getCurrentTime()} ] Service Bot: ${msg}`, function(){
          io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
        });// Result was sent.
      }else{// We can't do it before the Game will be finished...
        chat(`[ ${getCurrentTime()} ] Service Bot: ${data.reporter} wants to invite to the Game, but we can't do it before the Game will be finished...`, function(){
          io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
        });// Result was sent.
      }
    });

    socket.on('SEND_MSG', function(data){
      //io.emit('CHAT_MSG', { msg: data.msg, reporter: data.reporter, socketId: socket.id });
      chat(`[ ${getCurrentTime()} ] ${data.msg}`, function(){
        io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
      });
    });

    //...

    socket.on('disconnect', function(){
			// Need to remove this user from arrays:
      theGameState.clientlist = theGameState.clientlist.filter(function(client, i){ return (socket.id !== client.socketId) }, this);

      if(// If he was in theGameState.playerlist...
        theGameState.playerlist.find(function(player, iPlayer, players){
          return player.socketId === socket.id;
        }, this) !== undefined
      ){// Thenthe Game should be finished
        theGameState.playerlist = theGameState.playerlist.filter(function(player, i){ return (socket.id !== player.socketId) }, this);

        console.log(`Somebody has disconnected / clients: ${theGameState.clientlist.length} players: ${theGameState.playerlist.length}`);
        io.emit('UPDATE_PEOPLE_NUMBERS', { clientsNumber: theGameState.clientlist.length, playersNumber: theGameState.playerlist.length });
        console.log(`EMITED: UPDATE_PEOPLE_NUMBERS`);

        theGameState.started = false;
        theGameState.playerlist = [];

        io.emit('GAME_OVER', { serviceMsg: (`${socket.id} has left with a scandal. DURAK DETECTED! GAME OVER.`), reporter: "Service Bot", theGameStarted: theGameState.started });
        chat(`[ ${getCurrentTime()} ] Service Bot: ${socket.id} has disconnected with a scandal...`, function(){
          io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
        });
      }else{// If he was in theGameState.clientlist only...
        console.log(`Somebody has disconnected / clients: ${theGameState.clientlist.length} players: ${theGameState.playerlist.length}`);
        io.emit('UPDATE_PEOPLE_NUMBERS', { clientsNumber: theGameState.clientlist.length, playersNumber: theGameState.playerlist.length });
        console.log(`EMITED: UPDATE_PEOPLE_NUMBERS`);
        chat(`[ ${getCurrentTime()} ] Service Bot: ${socket.id} has disconnected...`, function(){
          io.emit('CHAT_MSG', { chatHistory: theGameState.chatHistory });
        });
      }
    });
  });
}
