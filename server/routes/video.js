const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const fs = require('fs');

router.get('/all', async (req, res) => {
    res.json(await Video.find().sort({date: -1}));
});

router.get('/published', async (req, res) =>{
    res.json(await Video.find({publish: true}).sort({date: -1}));
});

router.post('/publish', async (req, res) => {
    await Video.findByIdAndUpdate(req.body.id, {publish:true});
    res.json({state: 'updated'});
});

router.post('/unpublish', async (req, res) => {
    await Video.findByIdAndUpdate(req.body.id, {publish:false});
    res.json({state: 'updated'});
});

router.delete('/del', async (req, res) => {
    await Video.findByIdAndRemove(req.body.id);
    fs.unlink('video/'+req.body.name, (err) =>{
        if (err) {
            console.log(err)
        } else {
            console.log('File ' + req.body.name + ' deleted')
        }
    })
    res.json({state: 'deleted'});
});

module.exports = router;