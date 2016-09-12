

//  The URL for the database can be specified in one of three ways: 
  //  1. through an environment variable, 
  //  2. within the application using a global variable, 
  //  3. or by setting the NODE_ENV to production. It defaults to the shopping-list-dev database. 

exports.DATABASE_URL = process.env.DATABASE_URL || 
                       global.DATABASE_URL || 
                       (process.env.NODE_ENV === 'production' ?
                          'mongodb://localhost/shopping-list' :
                          'mongodb://localhost/shopping-list-dev');


//  The port is specified by an environment variable, defaulting to port 8080 if this is not supplied.

exports.PORT = process.env.PORT || 8080;

  