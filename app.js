require('dotenv').config()
var login = require('./login');
var  express = require('express');
var  moment = require('moment');
var jwt = require('jsonwebtoken');
var  cors = require('cors');
var  app = express();
var  router = express.Router();
var  bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  true }));

 

 // to support URL-encoded bodies
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
  response.header('Authorization');
  next();
});
router.route('/login').post((request, response) => {
  let user = request.body?.user
  let password = request.body?.password
  login.login(user, password).then((data) => {
    var token = login.generateToken(data[0])
    response.json({status:'Succsess',message:'Login succsess',data:data[0],token});
    
  })
  
   
})
router.route('/login/:userlogin/:password').get((request, response) => {
    login.login(request.params.userlogin, request.params.password).then((data) => {
      var token = login.generateToken(data[0])
      // var decoded = jwt.decode(token, {complete: true});
      response.json({data:data[0],token});
      
    })
  })
  
  router.route('/logindata/:userlogin/:password').get((request, response) => {
    login.login(request.params.userlogin, request.params.password).then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/menuprogram').get((request, response) => {
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.menuProgram(decoded?.data[0]?.loginid).then((data) => {
      
        response.json({status:'Succsess',message:'Succsess fetch data',data:data[0]});
      })
    } catch(err) {
     
    
      if(err?.name==='TokenExpiredError'){
        response.status(401).json({ status: 'Unauthorized',message:'Your session expired', });
      }else{
        response.status(500).json({ status: 'Server Error',message:'Invalid token' });
         
      }
      // err
    }
   
    // login.menuProgram(request.params.userlogin).then((data) => {
    //   // var header = request.headers.authorization 
    //   response.json(data[0],header);
    // })
  })
  
  router.route('/menu/:kodeprogram').get((request, response) => {
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.menu(decoded?.data[0]?.loginid, request.params.kodeprogram).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess fetch data',data:data[0]});
      })
    } catch(err) {
      
      
      if(err?.name==='TokenExpiredError'){
        response.status(401).json({ status: 'Unauthorized',message:'Your session expired', });
      }else{
        response.status(500).json({ status: 'Server Error',message:'Invalid token' });
        
      }
      // err
    }
  })
  
  router.route('/submenu/:kodeprogram/:kodemenu').get((request, response) => {
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.submenu(decoded?.data[0]?.loginid, request.params.kodeprogram, request.params.kodemenu).then((data) => {
        response.json({status:'Succsess',message:'Succsess fetch data',data:data[0]});
      })
    } catch(err) {
        
        
      if(err?.name==='TokenExpiredError'){
        response.status(401).json({ status: 'Unauthorized',message:'Your session expired', });
      }else{
        response.status(500).json({ status: 'Server Error',message:'Invalid token' });
        
      }
      // err
    }
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