require('dotenv').config()
var login = require('./login');
var  express = require('express');
var  moment = require('moment');
var jwt = require('jsonwebtoken');
var  cors = require('cors');
var internetAvailable = require("internet-available");
// var timeout = require('connect-timeout')
// var cookieParser = require('cookie-parser')
var  app = express();
// app.use(timeout('1s'))
var  router = express.Router();
var  bodyParser = require('body-parser');

 
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
const { check,validationResult ,oneOf } = require('express-validator');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  true }));
// app.use()
 // to support URL-encoded bodies
app.use(cors());
app.use('/api', router);
 
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);
 
// function haltOnTimedout (req, res, next) {
//   if (!req.timedout) {next() }else{console.log('timeout')}
  
// }
router.use((request, response, next) => {
  internetAvailable({
    // Provide maximum execution time for the verification
    timeout: 10000,
    // If it tries 5 times and it fails, then it will throw no internet
    retries: 5
  }).then(() => {
    console.log('middleware');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Authorization');
  next();
    console.log('internet')
  }).catch(() => {
    console.log('no internet')
    response.status(503).json({ status: 'Connection error !',message:'Please check your connection' });
   
  })
  
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
  
  router.route('/list-menu').get((request, response) => {
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.listMenu(decoded?.data[0]?.loginid ).then((data) => {
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
  router.route('/user-data').get((request, response) => {
     
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.getLoginData(decoded?.data[0]?.loginid).then((data) => {
 
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
  router.route('/reset-password').post((request, response)  => {
     
    let password = request.body?.password
     
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      login.resetPasswordData(decoded?.data[0]?.loginid,password).then((data) => {
 
        response.json({status:'Succsess',message:'Reset Password Succsess',data});
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
  router.route('/ismenu-exist').post((request, response)  => {
   
    let code = request.body?.code
     
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      login.isExistMenu(code).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess check',data:data});
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
  router.route('/delete-menu').delete(
    
    check('code').exists().withMessage('code is not null'),
    check('code').custom((value, { req,res })=>{
      return   login.isExistMenu(req?.body?.code).then((data) => {
        if(data<1){
          return Promise.reject('Code not exist'); 
        }
       
      })
    }) ,(request, response)  => {
   
    let code = request.body?.code
     
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      login.deleteMenu(code).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess delete menu',data:data});
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
  router.route('/update-menu').post(
    check('code').exists().withMessage('code is not null'),
  check('code').custom((value, { req,res })=>{
    return   login.isExistMenu(req?.body?.code).then((data) => {
      if(data<1){
        return Promise.reject('Code not exist'); 
      }
     
    })
  }) ,
  check('file').exists().withMessage('file is not null'),
  check('name').exists().withMessage('name  is not null'),
  check('folder').exists().withMessage('folder is not null'),
    (request, response)  => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array()  });
      }
    let kode = request.body?.code
    let nama = request.body?.name
    let file = request.body?.file
    let folder = request.body?.folder 
     
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.updateMenu(kode,nama,file,folder,decoded?.data[0]?.loginid).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess update menu',data});
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
  router.route('/add-menu').post(
  check('code').exists().withMessage('code is not null'),
  check('code').custom((value, { req,res })=>{
    return   login.isExistMenu(req?.body?.code).then((data) => {
      if(data>0){
        return Promise.reject('Code is already exist'); 
      }
     
    })
  }) ,
  check('file').exists().withMessage('file is not null'),
  check('name').exists().withMessage('name  is not null'),
  check('folder').exists().withMessage('folder is not null'),
  (request, response)  => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array()  });
    }
    let kode = request.body?.code
    let nama = request.body?.name
    let file = request.body?.file
    let folder = request.body?.folder 
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      login.addMenu(kode,nama,file,folder,decoded?.data[0]?.loginid).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess add menu',data});
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
  router.route('/list-sub-menu/:kode').get((request, response) => {
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.listSubMenu(request.params.kode).then((data) => {
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
  
  router.route('/update-sub-menu').post(
    check('m_program').isLength({ min: 1 }).exists().withMessage('code is not null'),
    check('code').isLength({ min: 1 }).exists().withMessage('code sub is not null'),
   
    check('code').custom((value, { req,res })=>{
      return   login.isExistSubMenu(req?.body?.m_program,req?.body?.code).then((data) => {
        if(data<1){
          return Promise.reject('Code not exist'); 
        }
       
      })
    }) ,
    check('name').isLength({ min: 1 }).exists().withMessage('name is not null'),
    check('file').isLength({ min: 1 }).exists().withMessage('file name is not null'),
    check('child').isLength({ min: 1 }).exists().withMessage('child sub is not null'),
    (request, response)  => {
      const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array()  });
    }
    let m_program = request.body?.m_program
    let kode = request.body?.code
    let nama = request.body?.name
    let file = request.body?.file
    let child = request.body?.child 
     
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
       
      login.updateSubMenu(m_program,kode,nama,file,child,decoded?.data[0]?.loginid).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess update menu',data});
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
  router.route('/delete-submenu').delete(
    check('code').exists().withMessage('code is not null'),
    check('m_program').exists().withMessage('m_program is not null'),
    check('code').custom((value, { req,res })=>{
      return   login.isExistSubMenu(req?.body?.m_program,req?.body?.code).then((data) => {
        if(data<1){
          return Promise.reject('Code not exist'); 
        }
       
      })
    }) ,
    (request, response)  => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array()  });
      }
    let code = request.body?.code
    let m_program = request.body?.m_program
     
    let token = request.headers.authorization 
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      login.deleteSubMenu(m_program,code).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess delete sub menu',data:data});
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
  router.route('/add-sub-menu').post(
    check('m_program').exists().isLength({ min: 1 }).withMessage('code is not null'),
    check('code').exists().isLength({ min: 1 }).withMessage('code sub is not null'),
   
    check('code').custom((value, { req,res })=>{
      return   login.isExistSubMenu(req?.body?.m_program,req?.body?.code).then((data) => {
        if(data>0){
          return Promise.reject('Code already exist'); 
        }
       
      })
    }) ,
    check('name').isLength({ min: 1 }).exists().withMessage('name is not null'),
    check('file').exists().withMessage('file name is not null'),
    check('child').exists().withMessage('child sub is not null'),
    (request, response)  => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array()  });
    }
     
    let m_program = request.body?.m_program
    let kode = request.body?.code
    let nama = request.body?.name
    let file = request.body?.file
    let child = request.body?.child 


    let token = request.headers.authorization 
  
    try {
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      login.addSubMenu(m_program,kode,nama,file,child,decoded?.data[0]?.loginid).then((data) => {
 
        response.json({status:'Succsess',message:'Succsess add sub menu',data:data});
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
var  port = process.env.PORT || 8096;
app.listen(port);
console.log('Order API is runnning at ' + process.env.PORT);
console.log('Token ' + process.env.TOKEN_SECRET);