const express = require('express');
const router = express.Router();
const models = require('../models/index');
const util = require('../helpers/util');

module.exports = function(passport){
  /* GET home page. */
  router.get('/', function(req, res, next){
    res.render('login', { message: req.flash('loginMessage') });
  });

  // process the login form
  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // facebook Router
  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

  router.get('/connect/facebook', passport.authorize('facebook', {
    scope : 'email'
  }));

  // handle the callback after facebook has authorized the user
  router.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect : '/home',
    failureRedirect : '/'
  }));

  router.get('/auth/twitter', passport.authenticate('twitter', {
    scope: 'email'
  }));

  router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

  router.get('/connect/twitter', passport.authorize('twitter', {
    scope: 'email'
  }));

  router.get('/connect/twitter/callback', passport.authorize('twitter', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

  router.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup', { message: req.flash('signupMessage') });
  });

  // process the signup form
  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/home', function(req, res, next) {
    res.render('home')
  });

  router.get('/mainPlan', function(req, res, next) {
    models.Plan.findAll({
      where: {
        parentplan: null
      },
      order: [
        ['id', 'DESC'],
      ],
      raw: true
    }).then(function(plans){
      res.render('mainPlan', {
        plans: plans,
        util: util
      });
    });
  });

  router.post('/addMainPlan', function(req, res, next) {
    models.Plan.create({
      title: req.body.title,
      type: req.body.type,
      purpose: req.body.purpose,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      notes: req.body.notes,
      status: "on process",
      userid: 1
    }).then(function(plan){
      createLog("Add main plan", function(){
        res.redirect('../../mainPlan')
      });
    });
  });

  router.get('/addSubPlan/:id', function(req, res, next) {
    models.Plan.create({
      title: req.query.title,
      type: req.query.type,
      notes: req.query.notes,
      status: "on process",
      userid: 1,
      parentplan: req.params.id
    }).then(function(plan){
      res.redirect(`../../viewMainPlan/${req.params.id}`)
    });
  });

  router.get('/deleteMainPlan/:id', function(req, res, next) {
    models.Plan.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(plan){
      createLog("Delete main plan", function(){
        res.redirect('../../mainPlan')
      });
    });
  });

  router.get('/editMainPlan/:id', function(req, res, next) {
    models.Plan.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(data){
      res.render('editMainPlan', {
        data: data,
        util: util
      });
    });
  });

  router.post('/editMainPlan/:id', function(req, res, next) {
    models.Plan.find({
      where: {
        id: req.params.id
      },
    }).then(function(plan) {
      plan.updateAttributes({
        title: req.body.title,
        type: req.body.type,
        purpose: req.body.purpose,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        notes: req.body.notes,
        status: req.body.status
      }).then(function(plan) {
        createLog("Edit main plan", function(){
          res.redirect('../../mainPlan')
        });
      });
    });
  });

  router.get('/checkMainPlan/:id', function(req, res, next) {
    models.Plan.find({where: {id: req.params.id},}).then(function(plan) {plan.updateAttributes({status: "Success"}).then(function(plan) {
      models.Plan.find({where: {id: req.params.id},}).then(function(sub) {sub.updateAttributes({status: "Success"}).then(function(sub) {
        createLog("Check main plan", function(){
          res.redirect(`../../viewMainPlan/${req.params.id}`)
        });
      });
    });
  });
});
});

router.get('/checkSubPlan/:mainid/:subid', function(req, res, next) {
  models.Plan.find({where: {id: req.params.subid, parentplan : req.params.mainid}, }).then(function(plan) {plan.updateAttributes({status: "Success"}).then(function(plan) {
      createLog("Check main plan", function(){
        res.redirect(`../../viewMainPlan/${req.params.mainid}`)
      });
    });
  });
});

router.get('/addSubPlan', function(req, res, next) {
  res.render('addSubPlan');
});

router.get('/viewMainPlan/:id', function(req, res, next) {
  let id = req.params.id;
  models.Plan.findAll({where: {id: id}, raw: true}).then(function(data){
    models.Plan.findAll({where: {parentplan: id}, raw: true}).then(function(sub1){
      console.log(data);
      console.log(sub1);
      res.render('viewMainPlan', {
        data: data[0],
        sub1: sub1
      });
    });
  });
});

router.post('/viewMainPlan/:id', function(req, res, next) {
  models.Plan.find({
    where: {
      id: req.params.id
    },
  }).then(function(plan) {
    plan.findAll({
      title: title,
      type: type,
      purpose: purpose,
      startdate: startdate,
      enddate: enddate,
      notes: notes,
      status: status
    }).then(function(plan) {
      res.redirect('../../viewMainPlan')
    });
  });
});

router.get('/account', function(req, res, next) {
  res.render('account');
});

router.get('/report', function(req, res, next) {
  res.render('report');
});

router.get('/dailyActivity', function(req, res, next) {
  res.render('dailyActivity');
});

router.get('/logActivity', function(req, res, next) {
  models.Log.findAll({
    order: [
      ['id', 'DESC'],
    ],
    raw: true
  }).then(function(logs){
    res.render('logActivity', {
      logs: logs
    });
  });
});


function createLog(note, cb){
  models.Log.create({
    logdate: Date.now(),
    lognote: note,
  }).then(function(x){
    cb();
  });
}

return router;
}
