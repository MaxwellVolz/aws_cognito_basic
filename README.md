# aws_cognito_basic
Basic setup page for creating users with AWS Cognito, and checking the log in.


AWS Setup Requirements

	User Pool
		Create App
		Disable Verifications
		Enable Lambda Pre Sign-Up Trigger

	Lambda
		Create Function
		Runtime: Node.js 4.3
		Copy code from 'AWS\LambdaPreSignUp.js'