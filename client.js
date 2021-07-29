const PROTO_PATH = "./chat.proto";

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

//PROMOTE TO ADMIN
// client.PromoteToAdmin(
//   {
//     user: "Hilton",
//     senha: "147852369",
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// );

//CRIAR CONTA
// client.CreateAccount(
//   {
//     user: "Pedro",
//     senha: "1234",
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// );

//LOGIN
// client.Login(
//   {
//     user: "Hilton",
//     senha: "1234",
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// );

// //CRIAR SALA
// client.CreateRoom(
//   {
//     user: "Hilton",
//     roomName: "Sistemas",
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// );

//ENTRAR EM SALA
// client.Joinroom(
//   {
//     user: "Hilton",
//     roomName: "Sistemas",
//   },
//   (err, res) => {
//     const response = res;
//     console.log(response.status);
//     console.log(response.msg);
//   }
// );
