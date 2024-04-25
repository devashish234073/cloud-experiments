The lambda_surveillance_app_with_api_gw_and_authorizer.yaml create two lambdas one is authorizer and another takes image data in input request and stores them into s3 bucket.

Note: the bucket name needs to be changed to a valid bucket you have in your account.

CORS is enabled so that web clients can upload images and there is an uploader.html which does exactly that copy the dev invoke endpoint of the api gateway in it
and use the port 443 and it will keep sending picture from webcam to the api gateway and ultimately the lambda will store it in s3. 

The lambda has a attribute named "delay" which it returns on successful saves that value is used by the uploader client to modify the frequency in which to send the image.
Thus letting user control the frequency remotely.

Note: There is one manual process needed for this to work the lambda that gets the image and stored to s3 has the handler file named index.js that needs to be renamed to index.mjs
With inline code it was not possible to have the code go to an .mjs file so this is something required to be done manually.

For details see this video --> https://www.linkedin.com/posts/devashish-priyadarshi-96554112b_added-two-new-files-to-the-repo-https-activity-7189131390339207168-KfSA?utm_source=share&utm_medium=member_desktop
