var express = require('express');
var app = express();
var fs = require("fs");
var path = require('path');
var jsonPath = path.join( __dirname , "data.json")
var shortid = require('shortid');
var bodyparser = require("body-parser")
app.use(bodyparser.json())

app.get('/chirps', function (req, res) {
    console.log('Markus')
   
   
     fs.readFile(jsonPath, function(err, file) {
            if (err) {
                res.writeHead(500);
                res.end('Could not read file');
            }

            res.write(file);
            res.end();
        });
});

app.post('/chirps', function (req, res) {
    console.log('Markus')
     var chunks = '',
            data;

        req.on('data', function(chunk) {
            chunks += chunk;

            if (chunks.length > 1e6) {
                req.connection.destroy();
            }

            data = JSON.parse(chunks);
        
         fs.readFile(jsonPath, 'utf-8', function(err, file) {
            if (err) {
                res.writeHead(500);
                res.end('Could not read file');
            }

            var arr = JSON.parse(file);

            data.id = shortid.generate();

            arr.push(data);

            fs.writeFile(jsonPath, JSON.stringify(arr), function(err, success) {
                if (err) {
                    res.writeHead(500);
                    res.end('Couldn\'t successfull store data');
                } else {
                    res.writeHead(201, 'Created');
                    res.end(JSON.stringify(arr));
                }
            });
        });

});

});   


app.put('/chirps/one/:id', function (req, res) {
    console.log('Markus')
   
       fs.readFile(jsonPath, 'utf-8', function(err, file) {
           if (err) {
               res.statusStatus(500);
           } else {
               var arr = JSON.parse(file);

               var response;

               var id = req.params.id;
               
               arr.forEach(function(a) {
                   if (a.id === id) {
                       response = a;
                       response.user = req.body.user;
                       response.message= req.body.message;
                   }
               });
           fs.writeFile(jsonPath, JSON.stringify(arr), function(err, success) {
               if (err) {
                   res.sendStatus(500);
               } else {
                   res.status(201);
                   res.send(req.body);
               }
           });
       }
       });
   })
    
app.delete('/chirps/one/', function (req, res) {
    console.log('Markus')

    fs.readFile(jsonPath, 'utf-8', function(err, file) {
            if (err) {
                res.writeHead(500);
                res.end('Could not read file');
            }

            var arr = JSON.parse(file);
            var id = req.params.id;
            var deleteIndex = -1;
            
            arr.forEach(function(a, i) {
                if (a.id === id) {
                    deleteIndex = i;
                }
            });
            if (deleteIndex != -1) {
                    arr.splice(deleteIndex, 1);
            }
            fs.writeFile(jsonPath, JSON.stringify(arr), function(err, success) {
                if (err) {
                    res.writeHead(500);
                    res.end('Couldn\'t successfull store data');
                } else {
                    res.writeHead(201, 'Created');
                    res.end(JSON.stringify(arr));
                }
            });
        });
});
  
// //    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
// //       var users = JSON.parse( data );
// //       var user = users["user" + req.params.id] 
// //       console.log( user );
// //       res.end( JSON.stringify(user));
// //    });
// })

app.listen(3000);

