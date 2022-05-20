#! /usr/bin/env node
//var rlv = require('readline-vim'),
const repl = require('repl');

var r = repl.start({
  prompt: "repl > ",
  input: process.stdin,
  output: process.stdout
});

r.displayPrompt();
