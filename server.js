var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var note = require('./note');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();

mongoose.connect('mongodb://localhost:27017/notes');

// Middle Route 

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});


router.route('/notes').post(function (req, res) {
    console.log("in add");
    var p = new note();
    p.title = req.body.title;
    
    p.save(function (err) {
        if (err) {
            res.send(err);
        }
        console.log("added");
        res.send({ message: 'Note Saved Successfully' })
    })
});

router.route('/notes').get(function (req, res) {
    note.find(function (err, notes) {
        if (err) {
            res.send(err);
        }
        res.send(notes);
    });
});

router.route('/notes/:note_id').get(function (req, res) {


    note.findById(req.params.note_id, function (err, prod) {
        if (err)
            res.send(err);
        res.json(prod);
    });
});

router.route('/notes/:note_id').put(function (req, res) {

    note.findById(req.params.note_id, function (err, prod) {
        if (err) {
            res.send(err);
        }
        prod.title = req.body.title;
        
        prod.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Note Updated Successfully' });
        });

    });
});

router.route('/notes/:note_id').delete(function (req, res) {

    note.remove({ _id: req.params.note_id }, function (err, prod) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Note Deleted Successfully' });
    })

});


app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('REST API is runnning at ' + port);
