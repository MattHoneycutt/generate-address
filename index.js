#!/usr/bin/env node
const AddressCreator = require('./AddressCreator');
const argv = require('yargs').argv
const ncp = require("copy-paste");

AddressCreator.getRandomAddress().then(x => {

    const output = argv.json ? 
        JSON.stringify(x) : 
        `${x.street}\r\n${x.city} ${x.state} ${x.zip}\r\n(${x.latitude}, ${x.longitude})`;

    if (argv.copy) {
        ncp.copy(output);
    }

    console.log(output);

});
