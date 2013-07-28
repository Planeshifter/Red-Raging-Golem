var http    = require("http"); 
var url     = require("url"); 
var sqlite3 = require('sqlite3').verbose();
var util    = require('util');
var rio     = require('rio');
var fs = require('fs');
var spawn = require('child_process').spawn;

String.prototype.double_quotes = function() 
{ 
return this.replace(/[\\"]/g, '');
}

console.log("unsere Datenbank");


var tweet_db = null;
var db;

function init_database()
{
db = new sqlite3.Database('scraperdata.db');
tweet_db = new sqlite3.Database('tweetdata.db');
console.log("Datenbanken offenbar erfolgreich ");
}


init_database();

function db_query2(query, filename, n)
{
console.log("bin in query2")
init_R_string = "setwd(\"/home/martin/node/node-v0.10.4\"); require(RSQLite); getwd(); driver <- dbDriver('SQLite'); con <- dbConnect(driver,'scraperdata.db');  dbGetQuery(con,\"PRAGMA ENCODING = 'UTF-8'\");";
init_R_string += "x <- dbSendQuery(con,'" + query + "');";
init_R_string += filename + "<- fetch(res=x, n=" + n + ");";

var p = "/home/tc/twinkle-toskana/current/public/Downloads/";

init_R_string += "save(" + filename + ",file=\"" + p + filename + ".RData\");";

fs.writeFile('executeQuery.R', init_R_string, function (err) {
    if (err) return console.log(err);
    var deploySh = spawn('sh', [ 'executeQuery.sh' ], {
  });
});

//console.log(init_R_string)
//rio.evaluate(init_R_string);

// rio.evaluate(query_R_string);
console.log("rio beendet")
  
}

function db_query(query, name)
{
if (db) console.log("Datenbank bekannt")


var list = [];

var name = new sqlite3.Database(name);
name.run("CREATE TABLE IF NOT EXISTS Article (Id INTEGER PRIMARY KEY, title   VARCHAR(512), author CHAR(164), abstract TEXT, content TEXT, url VARCHAR(512), load_date INTEGER, published_in CHAR(80), pub_date INTEGER, empty_content INTEGER, clean_url VARCHAR(512)  )"); 

name.run("PRAGMA ENCODING = 'UTF-8'");


db.all(query, function(err, rows) {
       
        rows.forEach(function (obj) {    
          
          
          obj.content = obj.content.double_quotes();
          obj.abstract = obj.abstract.double_quotes();
          obj.title = obj.title.double_quotes();          
        
          
          console.log( util.inspect(obj) );
        /*
          var stm = 'INSERT INTO Article(url, title, content, abstract, pub_date, load_date, published_in, clean_url) VALUES("' + obj.url + '","' +    obj.title + '","' + obj.content; + '","' + obj.abstract + '","' + obj.pub_date +  '","' + obj.load_date + '","' + obj.published_in + '","' + obj.clean_url + '")'; 
          */
          
          
                    var stm = 'INSERT INTO Article(url, title, content, abstract) VALUES("' + obj.url + '","' +    obj.title + '","' +    obj.content + '","' +    obj.abstract + '")'; 
          
        console.log(stm);  
        name.run(stm);  
        });
   
    console.log("ALLES GETAN")  
      
    });

 
}




// db_query2('SELECT * FROM Article WHERE content LIKE "%Obama%"', "Obama.db", 200);


function execute_query(query, response)
{
  
console.log(query);  
var stmt = decodeURIComponent(query);
console.log(stmt);

var list =[];

db.all(stmt, function(err, rows) {
       
        rows.forEach(function (obj) {    
          
        list.push(obj);
       
        });
   
 
    
     response.writeHead(200, {
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin' : '*',
     });
        

  
     var msg = JSON.stringify(list);
     response.end(msg);
    
    
    
    
    });


}



function demo(response)
{
 console.log("THIS is the answer ");
  
 response.writeHead(200, {
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin' : '*',
   });
        
  var t = {};
  t.str = "I am the JSON speaking server";
  
  var msg = JSON.stringify(t);

  
  response.end(msg);
}



// Create the server. 
http.createServer(function (request, response) { 

  // var pathname = url.parse(request.url).pathname;
  console.log("1. der Server bekommt eine Anfrage - noch unspezifisch ");

  var queryData = "";

   if(request.method == 'GET') 
      {
      console.log("Hier kommt ein GET");
      var pathname = url.parse(request.url).pathname;
      var query    = url.parse(request.url).query;
      
      
      switch(pathname)
        {
               
        case "/info":

        break;
        
        case "/query":
          execute_query(query, response);
        break;
        
        
        case "/tweets":
          console.log("TWEET");
          demo(response);
        break;
        
        
        default:
          console.log(pathname);
        break;
        }
      
      };





   if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });
        
        
  
    request.on('end', function() {
      
        var pathname = url.parse(request.url).pathname;
        response.post = querystring.parse(queryData);
        var x = JSON.parse(response.post.data);   

        switch(pathname)
          {
          case "/create":
          break;
          
          case "/update":
          break;
          }
              
        
        // callback();
    })      

  }


}).listen(10000);
