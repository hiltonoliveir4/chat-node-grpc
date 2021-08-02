class Interpreter {
  constructor(bd) {
    this.bd = bd;
  }

  ban(user, roomIndex) {
    if (this.bd.sala[roomIndex].blacklist.includes(user.user.username)) {
      return {
        status: 200,
        msg: `Usuário ${user.user.username} já está banido da sala`,
      };
    } else {
      this.bd.sala[roomIndex].blacklist.push(user.user.username);
      const response = this.kick(user, roomIndex);
      return {
        status: 200,
        msg: `Usuário ${user.user.username} banido da sala com sucesso`,
      };
    }
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
      blacklist: [],
      currentRoomMessage: 0,
      messages: [],
    });
  }

  getMessages(user) {
    const tam = this.bd.sala[user.room].messages.length;
    const mensagens =
      this.bd.sala[user.room].messages.slice(user.currentMessage, tam);
    user.currentMessage = tam;

    return mensagens;
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

  kick(user, roomIndex) {
    const indice = this.bd.sala[roomIndex].users.indexOf(user.user);
    if (indice != -1) {
      this.bd.sala[roomIndex].users.splice(indice, 1);
      user.room = undefined;
      return {
        status: 200,
        msg: `Usuário ${user.user.username} removido com sucesso da sala`,
      };
    } else {
      return {
        status: 404,
        msg: `Usuário ${user.user.username} não encontrado nessa sala`,
      };
    }
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

  sendMessage(username, msg, roomIndex) {
    this.bd.sala[roomIndex].messages.push({ user: username, message: msg });
    this.bd.sala[roomIndex].currentRoomMessage += 1;
  }

  showRoom() {
    var response = `SALAS\n`;
    this.bd.sala.map((item) => {
      response += `${item.roomName}\n`;
      item.users.map((user) => {
        response += `${user.username}\n`;
      });
      response += `\n`;
    });
    return {
      status: 200,
      msg: response,
    };
  }
}

module.exports = Interpreter;
