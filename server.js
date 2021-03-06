// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dbConfig = require("./app/config/db.config");

// const app = express();

// var corsOptions = {
//   origin: "*"
// };

// app.use(cors(corsOptions));

// // parse requests of content-type - application/json
// app.use(bodyParser.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// const db = require("./app/models");
// const Role = db.role;

// db.mongoose
//   .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//     initial();
//   })
//   .catch(err => {
//     console.error("Connection error", err);
//     process.exit();
//   });

// // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

// // routes
// require("./app/routes/auth.routes")(app);
// // require("./app/routes/user.routes")(app);
// // require("./app/routes/address.routes")(app);
// // require("./app/routes/styles.routes")(app);

// // set port, listen for requests
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

// function initial() {
//   Role.estimatedDocumentCount((err, count) => {
//     if (!err && count === 0) {
//       new Role({
//         name: "site_manager"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'site_manager' to roles collection");
//       });

//       new Role({
//         name: "administrator"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'administrator' to roles collection");
//       });

//       new Role({
//         name: "customer"
//       }).save(err => {
//         if (err) {
//           console.log("error", err);
//         }

//         console.log("added 'customer' to roles collection");
//       });
//     }
//   });
// }


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const app = express();
// app.use(express.static(__dirname+'/public'));
var multer = require('multer');
app.use(cors());
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage }).single('file')

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
})

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

const db = require("./app/models");
db.sequelize.sync();

require("./app/routes/auth.routes")(app);
require("./app/routes/student.routes")(app);
require("./app/routes/group.routes")(app);
require("./app/routes/groupsstudents.routes")(app);
require("./app/routes/classes.routes")(app);
require("./app/routes/textbook.routes")(app);
require("./app/routes/languages.routes")(app);
require("./app/routes/howdidyouhear.routes")(app);
require("./app/routes/bill.routes")(app);

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.send(req.file)
  })
});

app.post('/fetchImage/:file(*)', function (req, res) {
  let file = req.params.file;
  let fileLocation = path.join('../public/', file);
  //res.send({image: fileLocation});
  // res.sendFile(`${fileLocation}`)
  res.sendFile(path.join(__dirname, '/public/', `${fileLocation}`));
})

const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

app.get('*', (req, res) => {
  if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`public/${req.url}`));
  }
});
const port = normalizePort("8080");

app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);