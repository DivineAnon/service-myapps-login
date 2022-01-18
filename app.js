var login = require('./login');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

router.use((request, response, next) => {
  console.log('middleware');
  response.header('Access-Control-Allow-Origin', '*');
  next();
});
 
router.route('/login/:userlogin/:password').get((request, response) => {
    login.login(request.params.userlogin, request.params.password).then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/logindata/:userlogin/:password').get((request, response) => {
    login.login(request.params.userlogin, request.params.password).then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/menuprogram/:userlogin').get((request, response) => {
    login.menuProgram(request.params.userlogin).then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/menu/:userlogin/:kodeprogram').get((request, response) => {
    login.menu(request.params.userlogin, request.params.kodeprogram).then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/submenu/:userlogin/:kodeprogram/:kodemenu').get((request, response) => {
    login.submenu(request.params.userlogin, request.params.kodeprogram, request.params.kodemenu).then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/get-email/:userlogin').get((request, response) => {
    login.getdataemail(request.params.userlogin).then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/forgot-pass/:userlogin').get((request, response) => {
    login.forgotpass(request.params.userlogin).then((data) => {
      response.json(data[0]);
    })
  })

var  port = process.env.PORT || 8091;
app.listen(port);
console.log('Order API is runnning at ' + port);