// not yet setup
var Client_Id = "3codk1jn79pq9v1bsjfa2ag775",
    User_Pool_Id = "us-east-1_QWIhCkBwT",
    Identity_Pool_Id = "us-east-1:24d63faf-f93b-4e34-b63c-f3d4256129c9",
    Client_Access_Token = "",
    username;

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: Identity_Pool_Id // your identity pool id here
});

AWSCognito.config.region = 'us-east-1';
AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: Identity_Pool_Id // your identity pool id here
});

$(function() {
    // Handler for .ready() called.
    // testFunc();
    // createTestUser();
});


$.getScript("keys.js", function() {

    console.log("keys.js loaded but not necessarily executed.");

});


function testFunc() {
    // Initialize the Amazon Cognito credentials provider

    // testing getting database files

    // check this url:
    // http://docs.aws.amazon.com/cognito/latest/developerguide/step2-getting-started.html
    // https://github.com/aws/amazon-cognito-js/


    
  
    AWS.config.credentials.get(function(err) {
        if (err) {
            console.log("Error: "+err);
            return;
        }
        console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
        var cognitoSyncClient = new AWS.CognitoSync();
        cognitoSyncClient.listDatasets({
                IdentityId: AWS.config.credentials.identityId,
                IdentityPoolId: Identity_Pool_Id
            }, function(err, data) {
                if ( !err ) {
                    console.log(JSON.stringify(data));
                }
            })
        });


        //you can now check that you can describe the DynamoDB table
        var params = {TableName: "ChatLogId" };
        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

        dynamodb.describeTable(params, function(err, data){
                console.log("err", err);
            console.log(JSON.stringify(data));
        })

    }



function validateUserX() {

    var form = $("form#validateUser"),
        username = $(form).find("#name").val().replace(/\W/g, ""),
        password = $(form).find("#password").val();

    console.log("username", username);
    console.log("password", password);


    $(form).find("#name").val(username);


    if (username && password.length > 7) {

        var authenticationData = {
            Username: username,
            Password: password,
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        var poolData = {
            UserPoolId: User_Pool_Id,
            ClientId: Client_Id
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {


            onSuccess: function(result) {
                console.log("result", result);
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                Client_Access_Token = result.getAccessToken().getJwtToken();

                var newDOM = "<br/>" +
                        "<h1 style=\"height:" + $("#validate_user_section").height() + "px\">" +
                        "Wow! " + username +
                        ", you are awesome.</h1>";
                    $("#validate_user_section").html(newDOM);
            },

            onFailure: function(err) {
                $("#login_text").text("Try Again");
                console.log("err", err);
                // alert(err);
            },

        });
    }

}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function createUserX() {

    var form = $("form#createUser"),
        username = $(form).find("#name").val().replace(/\W/g, ''),
        password = $(form).find("#password").val(),
        // password = $(form).find("#password").val(),
        email = $(form).find("#email").val();

    $(form).find("#name").val(username);

    console.log("username", username);
    console.log("email", email);

    if (validateEmail(email) && password.length > 7) {

        var poolData = {
            UserPoolId: User_Pool_Id,
            ClientId: Client_Id
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);


        attributeList.push(attributeEmail);

        userPool.signUp(username, password, attributeList, null, function(err, result) {

            console.log("result", result);
            console.log("err", err);


            if (err) {
                var errorMessage = "Error: " + err.toString().split(":")[0];


                $("#create_account_text").next().css("color", "red");

                console.log(err);
                return;
            } else {
                var newDOM = "<br/>" +
                    "<h1 style=\"height:" + $("#create_account_section").height() + "px\">" +
                    "Welcome, " + result.user.username +
                    "</h1>";
                $("#create_account_section").html(newDOM);


            }
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
        });
    }

}