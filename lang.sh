#!/bin/bash

CP=`pwd`
. ./server_var.sh

SERVER_LANG_PATH="/var/www/html/assets/i18n/"
LOCAL_LANG_PATH="/src/assets/i18n/"

case "$1" in
    prod)
        if [ -f "$PROD_KEY" ]
        then
            scp -i $PROD_KEY -r $PROD_USER@$PROD_IP:$SERVER_LANG_PATH* $CP$LOCAL_LANG_PATH
            echo "Language updated"
        else
            echo "ssh key \"$PROD_KEY\" not found."
        fi
    ;;
    test)
        if [ -f "$TEST_KEY" ]
        then
            scp -i $TEST_KEY -r $TEST_USER@$TEST_IP:$SERVER_LANG_PATH* $CP$LOCAL_LANG_PATH
            echo "Language updated"
        else
            echo "ssh key \"$TEST_KEY\" not found."
        fi
    ;;
esac
