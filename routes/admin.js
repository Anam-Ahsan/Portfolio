var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname); //Appending .jpg
  }
})

var upload = multer({ storage: storage });

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'portfolio',


});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
 connection.query('SELECT * FROM projects',function(err,rows,fields){
   if(err) throw err;
   res.render('dashboard',{
     rows:rows
   });

 });
});

router.get('/new',function(req,res,next){
  res.render('new')
});

router.post('/new',upload.single('projectimage'),function(req,res,next){
var title =req.body.title;
var description =req.body.description;
var service=req.body.service;
var client=req.body.client;
var projectdate=req.body.projectdate;


// Check Image
if(req.file.filename){
  
  var projectImageOriginalName = req.file.originalname;
  var projectImageName = req.file.filename;
  var projectImageMime = req.file.mimetype;
  var projectImagePath = req.file.path;
  var projectImageExt = req.file.extension;
  var projectImageSize = req.file.size;
  }else{
  var mainImageName = 'noimage.jpg';
  }

req.checkBody('title','Title Field is Required').notEmpty();
req.checkBody('service','Service Field is Required').notEmpty();


var errors = req.validationErrors();

if(errors){
	
	res.render('addpost',{
		errors:errors,
		title:title,
    description:description,
    service:service,
    client:client
		
	});
}else{
	var project={
		title:title,
		description:description,
		service:service,
		client:client,
		date:projectdate,
		image:projectImageName
	};

  var query=connection.query('INSERT INTO PROJECTS set ?',project,function(err,result){
    // Project Inserted
    


  });
  req.flash('success','Project Added');
  res.location('/admin');
  res.redirect('/admin');
  
	
}
});

router.get('/edit/:id', function(req, res, next) {
  connection.query('SELECT * FROM projects WHERE id='+req.params.id,function(err,row,fields){
    if(err) throw err;
    res.render('edit',{
      row:row[0]
    });
 
  });
 });


 router.post('/edit/:id',upload.single('projectimage'),function(req,res,next){
  var title =req.body.title;
  var description =req.body.description;
  var service=req.body.service;
  var client=req.body.client;
  var projectdate=req.body.projectdate;
  
  
  // Check Image
  if(req.file.filename){
    
    var projectImageOriginalName = req.file.originalname;
    var projectImageName = req.file.filename;
    var projectImageMime = req.file.mimetype;
    var projectImagePath = req.file.path;
    var projectImageExt = req.file.extension;
    var projectImageSize = req.file.size;
    }else{
    var mainImageName = 'noimage.jpg';
    }
  
  req.checkBody('title','Title Field is Required').notEmpty();
  req.checkBody('service','Service Field is Required').notEmpty();
  
  
  var errors = req.validationErrors();
  
  if(errors){
    
    res.render('addpost',{
      errors:errors,
      title:title,
      description:description,
      service:service,
      client:client
      
    });
  }else{
    var project={
      title:title,
      description:description,
      service:service,
      client:client,
      date:projectdate,
      image:projectImageName
    };
  
    var query=connection.query('Update projects set ? WHERE id='+req.params.id,project,function(err,result){
      // Project Inserted
      
  
  
    });
    req.flash('success','Project Updated');
    res.location('/admin');
    res.redirect('/admin');
    
    
  }
  });
router.delete('/delete/:id',function(req,res){
  connection.query('DELETE FROM projects WHERE id='+req.params.id,function(err,result){
    if(err) throw err;
    

  });
  req.flash('success','Project Deleted');
  res.location('/admin');
  res.redirect('/admin');

});
module.exports = router;
