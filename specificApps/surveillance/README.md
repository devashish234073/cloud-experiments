Details here --> https://www.linkedin.com/posts/devashish-priyadarshi-96554112b_created-an-aws-lambda-that-can-be-hit-with-activity-7188399073350115328-L1qU?utm_source=share&utm_medium=member_desktop


This is the html screen that uploads camera pic every few interval:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/fa287038-981d-4b29-9582-11558e35592e)

Images are stored by hitting the aws lambda which in turn saves the image to s3 bucket:

![image](https://github.com/devashish234073/cloud-experiments/assets/20777854/6d8c1be7-ba84-4b56-891e-2d00da509838)

the lambda.mjs file will require an aws-sdk layer if used with nodejs runtime 18+. If using nodejs16 or below it will work without aws layer.

FOr nodejs 18+ use the lambda-with-sdk-v3.mjs file

For automation , see this --> https://github.com/devashish234073/cloud-experiments/blob/main/aws/cloudformations/lambda_api_gw_authorizer/lambda_surveillance_app_with_api_gw_and_authorizer.yaml
