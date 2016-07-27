// This Lambda function registers
// the user when they create a user
// name and password.
//
//
// Needs to be triggered by the 
// User Pool 
// in Pre Sign-Up


exports.handler = function(event, context) {
    // This is used to introduce custom validation of accounts that have signed up for your service.
    // This Lambda function returns a flag to indicate if a user should be auto confirmed.

    // Perform any necessary validations.
    // In this example, a condition that the minimum length of the username is 5 is imposed on all user pools.
    if (event.userName.length < 5) {
        context.done("Username length should be longer than 4", event);
        console.log("Username length should be longer than 4");
        throw new Error('failed!');
    }

    // Access your resource which contains the list of emails who were invited to sign-up
    
    event.response.autoConfirmUser = true;

    // Compare the list of email id from the request with the approved list
    // if(event.userPoolId === "yourSpecialUserPool") {
    //     if (event.request.userAttributes.email in listOfEmailsInvited) {
    //         event.response.autoConfirmUser = true;    
    //     }
    // }
    // Return result to Cognito
    context.done(null, event);
}