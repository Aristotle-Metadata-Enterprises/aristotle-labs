#!/usr/bin/env bash
BUCKET_NAME=$1
set -e
# Add packages to Python lambda distribution
cd ./venv/lib/python3.6/site-packages/
zip -r -9 ${OLDPWD}/transformer.zip .

# Add transformer lambda code to Python distribution
cd -
zip -g transformer.zip transformer.py
zip -g transformer.zip covid_spreadsheet.csv
# Copy to source code bucket
aws s3 cp ./transformer.zip s3://BUCKET_NAME

echo "Lambda changes uploaded"