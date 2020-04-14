#!/usr/bin/env bash
set -e
# Add packages to Python lambda distribution
cd ./venv/lib/python3.6/site-packages/
zip -r -9 ${OLDPWD}/transformer.zip .

# Add transformer lambda code to Python distribution
cd -
zip -g transformer.zip transformer.py
zip -g transformer.zip covid_spreadsheet.csv
# Copy to source code bucket
aws s3 cp ./transformer.zip s3://aristotle-lambdas/
# Remove old ZIP
#rm ./transformer.zip

echo "Lambda changes uploaded"