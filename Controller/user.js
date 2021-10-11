const express = require("express");
const app = express.Router();
const db = require("../models/index");
const USERS = db.users;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../Constant");
// app.use(bodyparser.urlencoded({extended:true}));

const authenticationToken = (req, res, next) => {
  try {

const token=req.headers.authorization.split(" ")[1];
// console.log(req.headers)
// console.log(headerToken)

// console.log(token,"<<<this is token")
    if (token == null || token ==undefined) {
      // return res.Status(401).send({success:false,msg:"token expire / invalid"}); 
      next()
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err){ 
// invalid token null
        next()
      };
      req.user = user;
      console.log(user)
      next();
    });
  } catch (err) {
    console.log(err);
  }
};

const createToken = async (userId, userName) => {
  const token = await jwt.sign({ id: userId, userName: userName }, SECRET_KEY, {
    expiresIn: "1h",
  });
  console.log(token);
  return token;

  //  const userVerify=await jwt.verify(token,SECRET_KEY)
  //  console.log(userVerify)
};

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    maxAge: 3600000,
    resave: true,
    saveUninitialiazed: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.set(
      "Cache-Control",
      "no-cache,private, no-store, must-revalidate, post-check=0"
    );
    next();
  } else {
    res.redirect("/fail");
  }
};

app.post("/register", async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      res.send({ success: false, msg: "Fill All Fields" });
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, async (err, hashedvalue) => {
        try {
          const user = await USERS.create({ userName, password: hashedvalue });
          await user.save();
          const token = await createToken(user.id,user.userName)
          res.status(200).send({ success: true,user,token });
        } catch (e) {
          console.log(e, "<<<<this is error");
          if (e.errors[0].type == "unique violation") {
            res
              .status(200)
              .send({ succces: false, msg: "Try with different user name" });
          }
        }
      });
    });
  } catch (e) {
    console.log(e.parent);
  }
});

// ------------------------------------------------------------------------------------------------

passport.use(
  new localStrategy(
    { usernameField: "userName" },
    async (userName, password, done) => {
      //   console.log("linke 54")
      try {
        const data = await USERS.findOne({
          where: { username: userName },
        });

        if (!data) {
          return done(null, false);
        }
        console.log(data.dataValues, "<<<<<<<<This is data");
        bcrypt.compare(password, data.dataValues.password, (err, matches) => {
          if (err) {
            console.log(err);
            return done(null, false);
          }
          if (!matches) return done(null, false);
          if (matches) {
            return done(null, data);
          }
        });
      } catch (err) {
        console.log(err);
      }
      // const user=await USERS.findAll({
      //     where: { username:userName}
      // })

      // (err,data)=>{
      //     console.log(data,"line 59")
      //     if(err){
      //         console.log(err)
      //     }
      //     if(!data){
      //         return done(null,false)
      //     }
      //     console.log(data,"<<<<<<<<This is data")
      //     bcrypt.compare(password,data.password,(err,matches)=>{
      //         if(err) {
      //             console.log(err)
      //             return done(null,false)
      //         }
      //         if(!matches) return done(null,false)
      //         if(matches){
      //             return done(null,data)
      //         }
      //     })
      // }
      // )
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (user, cb) => {
  const User = await USERS.findAll(
    {
      where: { id: User.id },
    },
    (err, user) => {
      cb(err, user);
    }
  );
});

app.get("/success", checkAuthentication, async (req, res, next) => {
  console.log("filer");
  res
    .status(200)
    .send({ success: true, msg: "Passport successfull", user: req.user });
});
app.get("/fail", async (req, res, next) => {
  res.status(200).send({ success: false, msg: "Check User Name / Password" });
});

app.post("/login", authenticationToken, async (req, res, next) => {
  console.log("it is here");
  passport.authenticate("local", {
    failureRedirect: "/fail",
    successRedirect: "/success",
  })(req, res, next);
});

app.get("/login/:userName/:password", async (req, res) => {
  try {
    console.log("it is also here");

    const { userName, password } = req.params;
    const user = await USERS.findOne({
      where: { userName },
    });
    // res.status(200).send(user[0])
    if (!user) {
      console.log("not user");
      res.send({ success: false, msg: "!! Wrong Input: User name" });
    } else {
      bcrypt.compare(password, user.dataValues.password, (err, match) => {
        if (err) {
          console.log(error,"<<<<<<<<<<<<<")
          res.send({ success: false, msg: "Incorrect Password" });
        }
        console.log(match, "<<<<this is match");
        if (match) {
          const token = createToken(
            user.dataValues.id,
            user.dataValues.userName
          );
          res
            .status(200)
            .send({ success: true, msg: "Successfully logged in",token });
        }
      }); // true
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/logout", async (req, ers) => {
  try {
    req.logOut();
  } catch (e) {
    console.log;
  }
});
module.exports = app;
