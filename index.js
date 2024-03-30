var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
var express = require('express');

var flash = require("connect-flash");
var passport = require("passport");
var path = require("path");
var session = require("express-session");
let http = require('http');
const os = require('os');

var setUpPassport = require("./resources/setuppassport");

var routes = require("./routes");
var routesUser = require("./routesUser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
        expires: false
      }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/',express.static('./public'));

app.use(express.static(path.join(__dirname, "public")));

setUpPassport();

app.use(routes);
app.use(routesUser);

////////Socket Code//////////
const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', function(socket) {
    // Send welcome message to the client
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('update', function (data) {
      io.emit('update', data);
  });
    socket.on('disconnect', function() {
        
    });
});
//////////////////////////////
const networkInterfaces = os.networkInterfaces();

// Find the internal IP address
let internalIpAddress;
for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const interfaceInfo of networkInterface) {
        if (!interfaceInfo.internal && interfaceInfo.family === 'IPv4') {
            internalIpAddress = interfaceInfo.address;
            break;
        }
    }
    if (internalIpAddress) break;
}

var port = process.env.PORT || 3000;
server.listen(port);
console.log('Internal IP Address:', internalIpAddress);
console.log("server listening on port " + port);
