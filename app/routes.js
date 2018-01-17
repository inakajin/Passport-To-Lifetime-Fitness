var User = require("../app/models/user");
var Visit = require("../app/models/visit");
module.exports = function(app, passport) {
  app.get("/submitform", function(req, res) {
    res.render("submitform.ejs");
  });

  app.post("/form", isLoggedIn, function(req, res) {
    console.log(req.body, req.user);
    //       User.update({_id:req.user._id}, {$set:{firstname:req.body.firstname, lastname:req.body.lastname}},function(err,doc){
    //          console.log(err,doc);
    //            res.redirect("/profile");
    //        });
    let visit = new Visit(req.body);
    visit.userid = req.user._id;
    visit.date = new Date();
    visit.save(function(err) {
      res.redirect("/profile");
    });
  });
  // normal routes ===============================================================
  app.get("/approvalform/:id", function(req, res) {
    console.log(req.params);
    Visit.findOne({_id: req.params.id}).exec().then(visit => {
      res.render("visit.ejs", {
        user: req.user, 
        //admin: admin
        visit: visit
      });
      //console.log(visit)
    }).catch(err => { throw err })
  })

  app.post("/approvalform/:id", function(req, res) {
    console.log(req.params);
    Visit.update({_id: req.params.id}, {$set: {approved:true}}, 
      function(error, doc){
        console.log(doc, error, " updated");
        res.json({success:true});
      });
  })

  // show the home page (will also have our login links)
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function(req, res) {
    console.log(req.user);
    let admin;
    let query;
    if (req.user.admin) {
      admin = true;
      query = {}
    } else {
      admin = false;
      query = { userid: req.user._id }
    }
    let users;
    User.find(query)
        .exec()
        .then(users => {
          users=users;
          Visit.find(query)
            .exec()
            .then(visits => {
              res.render("profile.ejs", {
                user: req.user,
                visits: visits,
                admin: admin,
                users: users
              });
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(err => {
          throw err;
        });
  });

  app.post("/profile/approveuser", isLoggedIn, function(req, res) {
    console.log(req.body);
    User.update({_id: req.body.id}, {$set: {active:true}}, 
      function(error, doc){
        console.log(doc, error, " updated");
        res.json({success:true});
      });
  });

  app.post("/profile/deleteuser", isLoggedIn, function(req, res) {
    console.log(req.body);
    User.remove({_id: req.body.id},
      function(error, doc){
        console.log(doc, error, " removed");
        res.json({success:true});
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function(req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function(req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );

  // handle the callback after facebook has authenticated the user
  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get(
    "/auth/twitter",
    passport.authenticate("twitter", { scope: "email" })
  );

  // handle the callback after twitter has authenticated the user
  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  // google ---------------------------------

  // send to google to do the authentication
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // the callback after google has authenticated the user
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  // locally --------------------------------
  app.get("/connect/local", function(req, res) {
    res.render("connect-local.ejs", { message: req.flash("loginMessage") });
  });
  app.post(
    "/connect/local",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/connect/local", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get(
    "/connect/facebook",
    passport.authorize("facebook", { scope: ["public_profile", "email"] })
  );

  // handle the callback after facebook has authorized the user
  app.get(
    "/connect/facebook/callback",
    passport.authorize("facebook", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get(
    "/connect/twitter",
    passport.authorize("twitter", { scope: "email" })
  );

  // handle the callback after twitter has authorized the user
  app.get(
    "/connect/twitter/callback",
    passport.authorize("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  // google ---------------------------------

  // send to google to do the authentication
  app.get(
    "/connect/google",
    passport.authorize("google", { scope: ["profile", "email"] })
  );

  // the callback after google has authorized the user
  app.get(
    "/connect/google/callback",
    passport.authorize("google", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect("/profile");
    });
  });

  // facebook -------------------------------
  app.get("/unlink/facebook", isLoggedIn, function(req, res) {
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect("/profile");
    });
  });

  // twitter --------------------------------
  app.get("/unlink/twitter", isLoggedIn, function(req, res) {
    var user = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
      res.redirect("/profile");
    });
  });

  // google ---------------------------------
  app.get("/unlink/google", isLoggedIn, function(req, res) {
    var user = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
