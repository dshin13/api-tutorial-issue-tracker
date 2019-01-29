/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');

var issueSchema = new mongoose.Schema({
  issue_title : {type: String, required: true},
  issue_text  : {type: String, required: true},
  created_on  : {type: Date, default: Date.now},
  updated_on  : {type: Date, default: Date.now},
  created_by  : {type: String, required: true},
  assigned_to : String,
  status_text : String,
  open        : {type: Boolean, default: true}
}, {versionKey: false});

module.exports = function (app, db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var Issue = db.model(project, issueSchema);
      var query = req.body;
      Issue.find(query, (err, doc) =>{
        if (err) res.status(400).send('Bad request');
        else res.json(doc);
      })
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var Issue = db.model(project, issueSchema);
    
      var issue = new Issue({
        issue_title  : req.body.issue_title,
        issue_text   : req.body.issue_text,
        created_by   : req.body.created_by,
        assigned_to  : req.body.assigned_to,
        status_text  : req.body.status_text
      });
      issue.save((err, data) => {
        if (err) res.status(400).send("POST error:" + err)
        else res.send( data )
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var Issue = db.model(project, issueSchema);
    
      if (!req.body._id) {
        res.status(400).send('_id error');
      }
    
      var updatedFields = Object.keys(req.body).reduce( (obj, key) => {
                                                        if (req.body[key]!='' && key!='_id') {
                                                         obj[key]=req.body[key];
                                                        }
                                                        return obj
                                                       }, {});
      
      if(Object.keys(updatedFields) == 0) {
        res.status(400).send('no updated fields sent');
      }
    
      else {
        updatedFields['updated_on'] = new Date();
        Issue.updateOne({_id: req.body._id},
                        updatedFields,
                        (err) => {
                          if (err) res.send('could not update ' + req.body._id)
                          else res.send('successfully updated ' + req.body._id)
                        });
      }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var Issue = db.model(project, issueSchema);
      
      if (!req.body._id) {
        res.send('_id error');
      }
    
      Issue.deleteOne({_id: req.body._id}, (err)=>{
        if (err) {
          res.send('could not delete ' + req.body._id)
        }
        else res.send('deleted ' + req.body._id)
      })
    });
    
};
