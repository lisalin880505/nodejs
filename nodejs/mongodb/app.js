var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app= express();

mongoose.connect('mongodb://localhost:27017/leannodejs')

app.set('views','./views/pages');
app.set('view engine','jade');

app.use(bodyParser())
app.use(express.static(path.join(__dirname,'bower_components')))
app.locals.moment = require('moment')
app.listen(port);

console.log('server started at:' + port);

//index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err) {
			console.log(err);
		}
		res.render('index',{
			title:'Home page',
			movies:movies
			/*
			movies:[{
				title: '机械战警',
				_id: 1,
				poster: "http://img3.yxlady.com/yl/UploadFiles_5361/20140319/2014031911384651.jpg"
			},{
				title: '机械战警',
				_id: 2,
				poster: "http://img3.yxlady.com/yl/UploadFiles_5361/20140319/2014031911384651.jpg"
			},{
				title: '机械战警',
				_id: 3,
				poster: "http://img3.yxlady.com/yl/UploadFiles_5361/20140319/2014031911384651.jpg"
			},{
				title: '机械战警',
				_id: 4,
				poster: "http://img3.yxlady.com/yl/UploadFiles_5361/20140319/2014031911384651.jpg"
			}
			]*/
		})
	});
})

//detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id;

	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:'Detail page of' + movie.title,
			movie:movie
		})
	});
	/*
	res.render('detail',{
		title:'Detail page',
		movie:{
			doctor:'何塞 帕迪利亚',
			country:'美国',
			title:'机械战警',
			year:2014,
			poster:'http://r3.ykimg.com/05160000530EE863675839160D0B79D5',
			language:'英语',
			flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			summary:'这个事简介'
		}
	})*/
})

app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'Admin page',
		movie:{
			doctor:'',
			country:'',
			title:'',
			year:2014,
			poster:'',
			language:'英语',
			flash:'',
			summary:''
		}
	})
})

app.get('/admin/update/:id',function(req,res){
	var id = req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'后台更新',
				movie:movie
			})
		})
	}
})

app.post('/admin/movie/new',function(req,res){
	console.log(req.body);
	var id=req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie

	if(id !=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})

		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}

			res.redirect('/movie/' + movie._id)
		})
	}
});


app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err) {
			console.log(err);
		}
		res.render('list',{
			title:'List page',
			movies:movies
		})
	});
	/*
	res.render('list',{
		title:'List page',
		movies:[{
			doctor:'何塞 帕迪利亚',
			country:'美国',
			title:'机械战警',
			year:2014,
			poster:'http://r3.ykimg.com/05160000530EE863675839160D0B79D5',
			language:'英语',
			flash:'http://player.youku.com/player/sid/XNjA1Njc0NTUy/v.swf',
			summary:'这个事简介'
		}]
	})*/
})
