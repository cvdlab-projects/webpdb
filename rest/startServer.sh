#!/bin/sh
node server_express.js > serverWeb.log 2>&1 &
ps | grep "node server_express"
