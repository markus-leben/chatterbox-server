/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};


var messages = [];

var parser = {};
parser['/classes/messages'] = {};
parser['/classes/messages'].GET = (request, response) => {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  var statusCode = 200;
  var mostRecentMessages = JSON.stringify(messages.slice(-100));
  console.log(`    Sending client: ${mostRecentMessages}`);
  response.writeHead(statusCode, headers);
  response.end(mostRecentMessages);
  // return {statusCode, headers, end};
};
// getter func needs to return header: status code, content type, defaults
// end: an array of the 100 latest and greatest messages from our storage variable --slice messages?
parser['/classes/messages'].POST = (request, response) => {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  var statusCode = 201;
  var end = '';
  let body = [];
  let now = Date.now();


  // asynch code
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // at this point, `body` has the entire request body stored in it as a string

    // get the body back to the user
    let message = JSON.parse(body);
    message.createdAt = now;
    message.message_id = messages.length;
    messages.push(message);
    response.writeHead(statusCode, headers);
    console.log(message);
    response.end(JSON.stringify(message));
  });

};

parser['/classes/messages'].OPTIONS = (request, response) => {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  var statusCode = 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(['GET', 'POST', 'OPTIONS']));
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // if we have a response for that url, do it
  if (request.url in parser) {
    parser[request.url][request.method](request, response);
  } else { // otherwise 404
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('Ya goofed up, this url don\'t exist.');
  }


};

exports.requestHandler = requestHandler;


/* vvvvvvvv   OLD COMMENTED OUT STUFF IS BELOW HERE, ENTER AT YOUR OWN RISK   vvvvvvvv */












// // The outgoing status.

// // See the note below about CORS headers.


// // Tell the client we are sending them plain text.
// //
// // You will need to change this if you are sending something
// // other than plain text, like JSON or HTML.

// // .writeHead() writes to the request line and headers of the response,
// // which includes the status and all headers.
// response.writeHead(statusCode, headers);

// // Make sure to always call response.end() - Node may not send
// // anything back to the client until you do. The string you pass to
// // response.end() will be the body of the response - i.e. what shows
// // up in the browser.
// //
// // Calling .end "flushes" the response's internal buffer, forcing
// // node to actually send all the data over to the client.
// console.log(body);
// response.end('[]');


// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.


// posterFunc;
// input:
// post func needs to return header: status, content type, defaults
// end: ???
// side effects: must save to messages an object formatted such that messages can be displayed by client



//
// var thisObect{...} = parser[request.url][request.method](something might go here)
// response.writeHead(thisObject.statusCode, thisObject.headers);
// response.end(thisObject.end)