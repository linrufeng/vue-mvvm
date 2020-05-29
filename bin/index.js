#!/usr/bin/env node
const Core = require('./../index');

if(process.argv[2]){
    core = new Core(process.argv[2]);
    core.run();
}

