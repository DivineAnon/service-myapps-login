module.exports = {
  apps : [{
    name   : "portal",
    // instances:1,
    // exec_mode:'fork', 
    // watch: true,
    env: {
      NODE_ENV: 'development',
      PORT:'8096',
      TOKEN_SECRET:'awek@w3kw4kwaW123@abc5daSar%ic1k!wiR',
      ADDRESS:'127.0.0.1'
      
    },
    script : "./service-myapps-login/app.js"
  },
  {
    name   : "tiketing",
    // instances:1,
    // exec_mode:'fork',
    // watch: true,
    env: {
      NODE_ENV: 'development',
      PORT:'9010',
      TOKEN_SECRET:'awek@w3kw4kwaW123@abc5daSar%ic1k!wiR',
      ADDRESS:'127.0.0.1'
      
    },
    script : "./service-myapps-dashboard/app.js"
  },
  {
    name   : "dbcmk",
    // instances:1,
    // exec_mode:'fork',
    // watch: true,
    env: {
      NODE_ENV: 'development',
      PORT:'9011',
      TOKEN_SECRET:'awek@w3kw4kwaW123@abc5daSar%ic1k!wiR',
      ADDRESS:'127.0.0.1'
      
    },
    exec_mode:'fork',
    script : "./service-myapps-dbcmk/app.js"
  },
  {
    name   : "dbhrd",
  
    env: {
      NODE_ENV: 'development',
      PORT:'9013',
      TOKEN_SECRET:'awek@w3kw4kwaW123@abc5daSar%ic1k!wiR',
      ADDRESS:'127.0.0.1'
      
    },
    exec_mode:'fork',
    script : "./service-myapps-dbhrd/app.js"
  },
  {
    name   : "dbinfo",
     
    env: {
      NODE_ENV: 'development',
      PORT:'9014',
      TOKEN_SECRET:'awek@w3kw4kwaW123@abc5daSar%ic1k!wiR',
      ADDRESS:'127.0.0.1'
      
    },
    exec_mode:'fork',
    script : "./service-myapps-dbinfo/app.js"
  }
]
}
