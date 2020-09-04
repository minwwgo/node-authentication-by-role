const cors = require("cors");
const exp = require("express");
const bodyParser = require("body-parser");
const morgan= require("morgan");
const passport = require("passport");

const { connect } = require("mongoose");
const { success, error } = require("consola");


// App env
const { DB, PORT } = require("./config/index");

//Initialize the application
const app = exp();

//mddlewares
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize())

app.use(morgan("dev"));

require('./middlewares/passport')(passport)

// User Router Middleware
app.use('/api/users', require('./routes/users'));
app.use("/api/blogs", require("./routes/blogs"));

const startApp = async () => {
  try {
    //Connection with DB
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }).then(() =>
      success({
        message: `Successfully connected with the Database `,
        badge: true,
      })
    );
    //listening for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connected with the Database \n${err}`,
      badge: true,
    });
    startApp();
  }
};

startApp();
