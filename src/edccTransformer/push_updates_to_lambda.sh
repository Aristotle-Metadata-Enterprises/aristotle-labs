#!/usr/bin/env bash
set -e
zip -ll transformer.zip transformer.py
aws s3 cp ./transformer.zip s3://aristotle-lambdas/