#!/bin/bash

CP=`pwd`
. ./server_var.sh

SERVER_PATH="/var/www/html/"
DIST_PATH="/dist/"

case "$1" in
    prod)
        if [ -f "$PROD_KEY" ]
        then
            scp -i $PROD_KEY -r $CP$DIST_PATH* $PROD_USER@$PROD_IP:$SERVER_PATH
            echo "Done"
        else
            echo "ssh key \"$PROD_KEY\" not found."
        fi
    ;;
    test)
        if [ -f "$TEST_KEY" ]
        then
            scp -i $TEST_KEY -r $CP$DIST_PATH* $TEST_USER@$TEST_IP:$SERVER_PATH
            echo "Done"
        else
            echo "ssh key \"$TEST_KEY\" not found."
        fi
    ;;
esac
