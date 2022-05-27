// const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const { server} = require('../../../server');

describe("my awesome project", () => {
    let io, serverSocket, clientSocket;
    // let serverSocket, clientSocket;

    beforeAll((done) => {
        const httpServer = server.httpServer;
        io = new Server(httpServer);
        server.init(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
        server.close();
    });

    test("should work", (done) => {
        clientSocket.on("hello", (arg) => {
            expect(arg).toBe("world");
            done();
        });
        serverSocket.emit("hello", "world");
    });

    test("should work (with ack)", (done) => {
        serverSocket.on("hi", (cb) => {
            cb("hola");
        });
        clientSocket.emit("hi", (arg) => {
            expect(arg).toBe("hola");
            done();
        });
    });
});