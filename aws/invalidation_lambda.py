import datetime
import os
import boto3

pipeline_client = boto3.client('codepipeline')
cloudfront_client = boto3.client('cloudfront')


def success(job, message):
    print('Job completed successfully')
    print(message)
    pipeline_client.put_job_success_result(JobId=job)


def failure(job, message):
    print('Job failed')
    print(message)
    pipeline_client.put_job_failure(
        JobId=job,
        failureDetails={'message': message, 'type': 'JobFailed'}
    )


def handler(event, context):
    job = event["CodePipeline.job"].id
    timestamp = datetime.datetime.now().timestamp()

    if 'CLOUDFRONT_ID' in os.environ:
        cloudfront_client.create_invalidation(
            DistributionId=os.environ['CLOUDFRONT_ID'],
            InvalidationBatch={
                'CallerReference': str(timestamp),
                'Paths': {
                    'Quantity': 1,
                    'Items': ['/*']
                }
            }
        )
    else:
        failure(job, 'CLOUDFRONT_ID env var not present')

    success(job, 'Distribution invalidated')
