var User = require("../app/models/user");
var Visit = require("../app/models/visit");
module.exports = function(app, passport) {
  app.get("/submitform", isLoggedIn, function(req, res) {
    res.render("submitform.ejs", {user:req.user});
  });

//This is the logic to retrieve the form to use to submit a visit  
  app.get("/submitform/:id", isLoggedIn, function(req, res) {
    res.render("submitform.ejs", {user:req.user});  
  });
 
//This is the logic to submit a visit    
  app.post("/submitform", isLoggedIn, function(req, res) {
    let visit = new Visit(req.body);

    visit.userid = req.user._id;
    visit.firstname = req.user.firstname;
    visit.lastname = req.user.lastname;
    visit.date = new Date();
    visit.save(function(err) {
    res.redirect("/profile");
    });
  });

//This is the logic to allow an admin to submit a visit for a user  
    app.post("/submitform/:id", isLoggedIn, function(req, res) {
    console.log(req.body, req.user, req.params, req.query);
    let visit = new Visit(req.body);
    
      visit.userid = req.params.id;
      visit.firstname = req.query.first;
      visit.lastname = req.query.last;
  
    visit.date = new Date();
    visit.save(function(err) {
    res.redirect("/profile");
    });
  });  

  // normal routes ===============================================================
  
  //This brings up a submitted visit to be approved by an admin
  app.get("/approvalform/:id", function(req, res) {
    console.log(req.params);
    Visit.findOne({_id: req.params.id}).exec().then(visit => {
      res.render("visit.ejs", {
        user: req.user, 
        visit: visit
      });
    }).catch(err => { throw err })
  })


//This submits an approved visit and flips the approved tag to true
  app.post("/approvalform/:id", function(req, res) {
    console.log(req.params);
    console.log(req.body);
    Visit.update({_id: req.params.id}, {$set: 
      {
      approved:true, 
      activitylist:req.body.activitylist,
      presession:req.body.presession,
      postsession:req.body.postsession,
      health:req.body.health,
      bestpart:req.body.bestpart,
      worstpart:req.body.worstpart
    } }, 
      function(error, doc){
        console.log(doc, error, " updated");
        res.redirect("/profile");
      });
  })


//This is the logic that allows an admin to delete a visit
  app.post("/profile/deletevisit", isLoggedIn, function(req, res) {
    console.log(req.body);
    Visit.remove({_id: req.body.id},
      function(error, doc){
        console.log(doc, error, " removed");
        res.json({success:true});
      });
  });

//This shows the home page (will also have our login links)
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
//This retrieves the users profile page
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
  console.log("zebra");
          Visit.find(query)
            .exec()
            .then(visits => {
              console.log(visits)
              res.render("profile.ejs", {
                user: req.user,
                visits: visits.reverse(),
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

//This allows an admin to approve a registered user  
  app.post("/profile/approveuser", isLoggedIn, function(req, res) {
    console.log(req.body);
    User.update({_id: req.body.id}, {$set: {active:true}}, 
      function(error, doc){
        console.log(doc, error, " updated");
        res.json({success:true});
      });
  });

//This gives a registered user admin privileges
  app.post("/profile/adminpromote", isLoggedIn, function(req, res) {
    console.log(req.body);
    User.update({_id: req.body.id}, {$set: {admin:on}}, 
      function(error, doc){
        console.log(doc, error, " updated");
        res.json({success:true});
      });
  });

//This allows an admin to delete a user  
  app.post("/profile/deleteuser", isLoggedIn, function(req, res) {
    console.log(req.body);
    User.remove({_id: req.body.id},
      function(error, doc){
        console.log(doc, error, " removed");
        res.json({success:true});
      });
  });

//This allows an admin to update a user profile  
  app.post("/profile/updateuser", isLoggedIn, function(req, res) {
    console.log(req.body, "Mickey", req.params, req.query);
    User.update({_id: req.body.id}, {$set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          studentid: req.body.studentid,
          admin: req.body.admin, 
          school: req.body.school,     
    }
 },
      function(error, doc){
        console.log(doc, error, " updated");
        res.json({success:true});
        //res.redirect("../profile");
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

  



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
};
}
