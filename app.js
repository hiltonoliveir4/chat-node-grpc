class Interpreter {
  constructor(bd) {
    this.bd = bd;
  }

  createAccount(user, senha) {
    this.bd.usuario.push({
      username: user,
      senha: senha,
      admin: false,
    });
  }

  createRoom(roomName) {
    this.bd.sala.push({
      roomName: roomName,
      users: [],
      currentRoomMessage: 0,
      messages: [],
    });
  }

  joinroom(user, roomIndex) {
    this.bd.online.map((item) => {
      if (item.user.username === user.username) {
        if (item.room == undefined) {
          item.room = roomIndex;
          this.bd.sala[roomIndex].users.push(user);
        } else {
          const indice = this.bd.sala[item.room].users.indexOf(user);
          this.bd.sala[item.room].users.splice(indice, 1);
          item.room = roomIndex;
          this.bd.sala[roomIndex].users.push(user);
        }
      }
    });
  }

  login(user) {
    this.bd.online.push({
      user: user,
      room: undefined,
      currentMessage: 0,
    });
  }

  promoteToAdmin(index) {
    this.bd.usuario[index].admin = true;
  }

  searchLoggedUser(user) {
    var response = false;
    this.bd.online.map((item, index) => {
      if (user == item.user.username) {
        response = [item, index];
      }
    });
    return response;
  }

  searchRoom(roomName) {
    var response = false;
    this.bd.sala.map((item, index) => {
      if (item.roomName == roomName) {
        response = [item, index];
      }
    });
    return response;
  }

  searchUser(user) {
    var response = false;
    this.bd.usuario.map((item, index) => {
      if (user == item.username) {
        response = [item, index];
      }
    });
    return response;
  }
}

module.exports = Interpreter;
