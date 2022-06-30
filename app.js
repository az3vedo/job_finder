const express    = require('express');
const path       = require('path');
const app        = express();
const exphbs     = require('express-handlebars');
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const Job        = require('./models/job.js');
const Sequelize  = require('sequelize');
const OP         = Sequelize.Op;

const PORT       = 3000;

app.listen(PORT, function() {
  console.log(`App listening port ${PORT}`);
})

//body_parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

// static folder
app.use(express.static(path.join(__dirname, 'public')));


// db connection
db
  .authenticate()
  .then(() => {
    console.log("conectou ao banco com sucesso");
  })
  .catch(err => {
    console.log("Ocorreu um erro ao conectar", err);
  })


// routes
app.get('/', (req, res) => {

  let search = req.query.job;
  let query = '%'+search+'%';
  if(!search){
    Job.findAll({order: [
      ['createdAt', 'DESC']
    ]})  
      .then(jobs =>{
        res.render('index', {
          jobs
        })
      })
      .catch(err => console.log(err));
  } else {
    Job.findAll({
      where: {title: {[OP.like]: query}}, 
      order: [
      ['createdAt', 'DESC']
    ]})  
      .then(jobs =>{
        res.render('index', {
          jobs, search
        })
      })
      .catch(err => console.log(err));
  }


})


//jobs routes
app.use('/jobs', require('./routes/jobs'));
