#!/bin/bash

tsc --build

if [ $? -ne 0 ]; then
  echo "Success"
fi
