const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("my awesome project", () => {
    let io, serverSocket, clientSocket;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
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

    test("set user ID", (done) => {
        serverSocket.on("set userId", (cb) => {
            cb("derry");
        });
        clientSocket.emit("set userId", (arg) => {
            expect(arg).toBe("derry");
            done();
        });
    });

    test('should communicate', (done) => {
        // once connected, emit Hello World
        serverSocket.emit('echo', 'Hello World');
        clientSocket.once('echo', (message) => {
            // Check that the message matches
            expect(message).toBe('Hello World');
            done();
        });
        serverSocket.on('connection', (mySocket) => {
            expect(mySocket).toBeDefined();
        });
    });
    
});
