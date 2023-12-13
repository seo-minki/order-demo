#!/bin/bash

export NODE_ENV=development

pm2 delete dev-payssam-front-order
pm2 start  pm2-dev.json
pm2 logs   dev-payssam-front-order

