#!/usr/bin/env node

const port=3000;
const body = require('body-parser');
const express = require('express');
const session = require('express-session')

const app0 = express();
const app1 = express();
const app2 = express();

// Parse the request body as JSON
app1.use(body.json());
app2.use(body.json());

const handler = serverNum => (req, res) => {
  console.log(`server ${serverNum}`, req.method, req.url, req.body);
  res.send(`Hello from server ${serverNum}!`);
};

// Only handle GET and POST requests
app1.get('*', handler(1)).post('*', handler(1));
app2.get('*', handler(2)).post('*', handler(2));

app1.listen(3001);
app2.listen(3002);

//const express = require('express');
const request = require('request');

const servers = ['','http://localhost:3001', 'http://localhost:3002' ];//the server 0 is ignored ( because 0==false )

const handler0 = (req, res) => {
  if(!req.session.currentserver)req.session.currentserver=1+Math.round(Math.random()); 
  req.pipe(request({ url: servers[req.session.currentserver] + req.url })).pipe(res);
};

app0.use(session({ "secret":"vzcvbmbzxcvmbzxcv" ,"resave": true ,"saveUninitialized": true }));
const server = app0.get('*', handler0).post('*', handler0);

server.listen(port);
