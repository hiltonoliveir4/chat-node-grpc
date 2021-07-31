const PROTO_PATH = "./chat.proto";
var readline = require("readline");

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).chat;

const client = new protoDescriptor.MessageChat(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

var recursiveAsyncReadLine = function () {
  rl.question("", function (command) {
    if (command == "/sair") {
      return;
    } else {
      socket.write(command);
    }

    recursiveAsyncReadLine();
  });
};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var usuario = "";

var recursiveAsyncReadLine = function () {
  rl.question("", (command) => {
    const mensagem = command.split(" ");
    if (mensagem[0] == "/help") {
      //HELP
      client.Help({}, (err, res) => {
        const response = res;
        console.log(response.msg);
      });
    } else if (mensagem[0] == "/promotetoadmin") {
      //PROMOVER PARA ADMIN
      if (usuario == "") {
        console.log(
          "Você precisa se cadastrar ou logar para se promover para administrador!"
        );
      } else {
        client.PromoteToAdmin(
          {
            user: usuario,
            senha: mensagem[1],
          },
          (err, res) => {
            const response = res;
            console.log(response.msg);
          }
        );
      }
    } else if (mensagem[0] == "/createaccount") {
      //CRIAR CONTA
      const user = mensagem[1];
      const senha = mensagem[2];

      client.CreateAccount(
        {
          user: user,
          senha: senha,
        },
        (err, res) => {
          const response = res;
          if (response.status === 200 && usuario === "") {
            usuario = user;
          }
          console.log(response.msg);
        }
      );
    } else if (mensagem[0] == "/login") {
      //LOGIN
      client.Login(
        {
          user: mensagem[1],
          senha: mensagem[2],
        },
        (err, res) => {
          const response = res;
          if (response.status === 200) {
            usuario = mensagem[1];
          }
          console.log(response.msg);
        }
      );
    } else if (mensagem[0] == "/createroom") {
      //CRIAR SALA
      if (usuario == "") {
        console.log("Você precisa se cadastrar ou logar para criar salas!");
      } else {
        client.CreateRoom(
          {
            user: usuario,
            roomName: mensagem[1],
          },
          (err, res) => {
            const response = res;
            console.log(response.msg);
          }
        );
      }
    } else if (mensagem[0] == "/joinroom") {
      //ENTRAR NA SALA
      if (usuario == "") {
        console.log("Você precisa se cadastrar e logar para entrar em salas!");
      } else {
        client.Joinroom(
          {
            user: usuario,
            roomName: mensagem[1],
          },
          (err, res) => {
            const response = res;
            console.log(response.msg);
          }
        );
      }
    } else if (mensagem[0] == "/kick") {
      if (usuario == "") {
        console.log("Você precisa se cadastrar ou logar para kickar usuários!");
      } else {
        client.Kick(
          {
            user: mensagem[1],
            adminUser: usuario,
            roomName: mensagem[2],
          },
          (err, res) => {
            const response = res;
            console.log(response.msg);
          }
        );
      }
    } else if (mensagem[0] == "/ban") {
      if (usuario == "") {
        console.log("Você precisa se cadastrar ou logar para banir usuários!");
      } else {
        client.Ban(
          {
            user: mensagem[1],
            adminUser: usuario,
            roomName: mensagem[2],
          },
          (err, res) => {
            const response = res;
            console.log(response.msg);
          }
        );
      }
    } else if (mensagem[0] == "/showroom") {
      client.ShowRoom({}, (err, res) => {
        const response = res;
        console.log(response.msg);
      });
    } else if (mensagem[0][0] === "/") {
      console.log("Comando inválido, use /help para saber mais!");
    } else {
      if (usuario == "") {
        console.log(
          "Você precisa se cadastrar ou logar para enviar mensagens!"
        );
      } else {
        client.SendMessage(
          {
            user: usuario,
            message: command,
          },
          (err, res) => {
            const response = res;
            console.log(response.msg);
          }
        );
      }
    }
    // Chama a função recursivamente
    recursiveAsyncReadLine();
  });
};

recursiveAsyncReadLine();

// // //ENTRAR EM SALA
// client.Joinroom(
//   {
//     user: "Hilton",
//     roomName: "Sistemas Distribuidos",
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// );

// KICKAR USUÁRIO
// client.Kick(
//   {
//     user: "Pablo",
//     adminUser: "Hilton",
//     roomName: "Sistemas Distribuidos"
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// )

//BANIR USUÁRIO
// client.Ban(
//   {
//     user: "Pablo",
//     adminUser: "Hilton",
//     roomName: "Sistemas Distribuidos"
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// )

// // // //EXIBIR SALAS
// client.ShowRoom({}, (err, res) => {
//   const response = res;
//   console.log(response.status);
//   console.log(response.msg);
// });
