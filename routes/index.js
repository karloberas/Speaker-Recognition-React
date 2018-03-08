var express = require('express');
var router = express.Router();
var multer = require('multer');

var upload = multer({ dest: 'uploads/' }).single('blob');

var service = require('../services/service.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Speaker Recognition Backend' });
});

router.route('/profile')
.post(function(req, res) {
  service.AddProfile(req.body).then(function(result) {
    res.status(200).json(result);
  }, function(err) {
    res.status(500).send(err);
  });
})
.get(function(req, res) {
  service.GetProfiles().then(function(result) {
    res.status(200).json(result);
  }, function(err) {
    res.status(500).send(err);
  });
})
.put(function(req, res) {
  service.ResetEnrollment(req.body).then(function() {
    res.status(200).send();
  }, function(err) {
    res.status(500).send();
  });
})
.delete(function(req, res) {
  service.DeleteProfile(req.query.id).then(function() {
    res.status(200).send();
  }, function(err) {
    res.status(500).send();
  });
});

router.route('/enrollment/:id')
.post(function(req, res) {
  upload(req, res, function(err) {
    if(err) {
      console.log(err);
    }
    service.EnrollProfile(req.params.id, req.file).then(function(result) {
      res.status(200).send(result);
    }, function(err) {
      res.status(500).send(err);
    });
  });
});

router.route('/status')
.post(function(req, res) {
  service.CheckStatus(req.body).then(function(result) {
    console.log(result);
    res.status(200).json(result);
  }, function(err) {
    res.status(500).send(err);
  });
});

router.route('/identification')
.post(function(req, res) {
  upload(req, res, function(err) {
    if(err) {
      console.log(err);
    }
    service.IdentifyProfile(req.file).then(function(result) {
      res.status(200).send(result);
    }, function(err) {
      res.status(500).send(err);
    });
  });
});

module.exports = router;
