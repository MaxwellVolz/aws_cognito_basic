// not yet setup
requirejs.config({
    baseUrl: 'libs',
    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: 'jquery-3.1.0.min',
        bootstrap: 'bootstrap.min',
        moment: 'moment',
        jsbnX: 'jsbn',
        jsbn2X: 'jsbn2',
        sjclX: 'sjcl',
        AWSCognitoX: 'aws-cognito-sdk.min',
        amazonCognitoIdentityX: 'amazon-cognito-identity.min',
        awsSdkX: 'aws-sdk',
    }
});


require(['jquery', 'bootstrap','moment','awsSdkX','jsbnX', 'jsbn2X', 'sjclX', 'AWSCognitoX'], function() {
// require([], function() {
    // require(['awsSdk','jsbn', 'jsbn2', 'sjcl', 'moment', 'AWSCognito', 'amazonCognitoIdentity' ]);
    // require(['AWSCognitoX']);
      require(['']);
    setTimeout(function(){
      require(['amazonCognitoIdentityX']);
    }, 500);
    
    // require(['amazonCognitoIdentityX']);



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

    $("button#testFuncButton").click(function() {
        testFunc();
    });
    $("button#loginButton").click(function() {
        validateUserX();
    });

    //for dynamodb table data
    var docClient = new AWS.DynamoDB.DocumentClient();

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

        console.log("foo");


        AWS.config.credentials.get(function(err) {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
            var cognitoSyncClient = new AWS.CognitoSync();
            cognitoSyncClient.listDatasets({
                IdentityId: AWS.config.credentials.identityId,
                IdentityPoolId: Identity_Pool_Id
            }, function(err, data) {
                console.log(JSON.stringify(data));
                if (!err) {
                    console.log(JSON.stringify(data));
                }
            })
        });

        console.log("bar");

        //you can now check that you can describe the DynamoDB table
        var params = {
            TableName: "ChatLogId"
        };
        var dynamodb = new AWS.DynamoDB({
            apiVersion: '2012-08-10'
        });

        // dynamodb.describeTable(params, function(err, data){
        //     console.log("err", err);
        //     console.log(JSON.stringify(data));
        // })
        // console.log("ed");

        var db = new AWS.DynamoDB();
        db.listTables(function(err, data) {
            console.log(data.TableNames);
        });


        // db.describeTable(params, function(err, data){
        //     console.log("err", err);
        //     console.log(JSON.stringify(data));
        // })



        var creds = new AWS.Credentials(Client_Access_Token, null, null);

        console.log("creds", creds);
        // accessKeyId (String) — the AWS access key ID
        // secretAccessKey (String) — the AWS secret access key
        // sessionToken (String) (defaults to: null) — the optional AWS session token



        // var allMovies = moviedata;
        // allMovies.forEach(function(movie,index) {
        //     var params = {
        //         TableName: "Movies",
        //         Item: {
        //             "year":  movie.year,
        //             "title": movie.title,
        //             "info":  movie.info,
        //             "Id":  index,
        //         }
        //     };

        //     docClient.put(params, function(err, data) {
        //        if (err) {
        //            console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
        //        } else {
        //            console.log("PutItem succeeded:", movie.title);
        //        }
        //    });
        // });

        //getTableData();




        // var params2 = {
        //     TableName : "Movies",
        //     KeyConditionExpression: "#yr = :yyyy",
        //     ExpressionAttributeNames:{
        //         "#yr": "year"
        //     },
        //     ExpressionAttributeValues: {
        //         ":yyyy":2013
        //     }
        // };

        // docClient.query(params2, function(err, data) {
        //     if (err)
        //         console.log(JSON.stringify(err, null, 2));
        //     else
        //         console.log(JSON.stringify(data, null, 2));
        // });



    }


    function getTableData() {
        var params = {
            TableName: "ChatLogId",
            Key: {
                "Id": 10,
                c
                // "Type": 'Message'
            }
        };

        console.log(docClient);

        docClient.query(params, function(err, data) {
            if (err) {
                console.log("err", err);
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            }
        });

    }



    function validateUserX() {

        var form = $("form#validateUser"),
            username = $(form).find("#name").val().replace(/\W/g, ""),
            password = $(form).find("#password").val();

        console.log("username", username);
        console.log("password", password);


        $(form).find("#name").val(username);


        if (username && password.length > 7) {

            console.log("Login Attempt beginning....");
            var authenticationData = {
                Username: username,
                Password: password,
            };
            var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
            console.log("authenticationDetails declared....");
            var poolData = {
                UserPoolId: User_Pool_Id,
                ClientId: Client_Id
            };
            var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
            console.log("userPool declared....");
            var userData = {
                Username: username,
                Pool: userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            console.log("cognitoUser declared....");
            cognitoUser.authenticateUser(authenticationDetails, {





                onSuccess: function(result) {
                console.log("authenticateUser declared....");

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

    var moviedata = [{
        "year": 2013,
        "title": "Rush",
        "info": {
            "directors": ["Ron Howard"],
            "release_date": "2013-09-02T00:00:00Z",
            "rating": 8.3,
            "genres": [
                "Action",
                "Biography",
                "Drama",
                "Sport"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTQyMDE0MTY0OV5BMl5BanBnXkFtZTcwMjI2OTI0OQ@@._V1_SX400_.jpg",
            "plot": "A re-creation of the merciless 1970s rivalry between Formula One rivals James Hunt and Niki Lauda.",
            "rank": 2,
            "running_time_secs": 7380,
            "actors": [
                "Daniel Bruhl",
                "Chris Hemsworth",
                "Olivia Wilde"
            ]
        }
    }, {
        "year": 2013,
        "title": "Prisoners",
        "info": {
            "directors": ["Denis Villeneuve"],
            "release_date": "2013-08-30T00:00:00Z",
            "rating": 8.2,
            "genres": [
                "Crime",
                "Drama",
                "Thriller"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTg0NTIzMjQ1NV5BMl5BanBnXkFtZTcwNDc3MzM5OQ@@._V1_SX400_.jpg",
            "plot": "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts. But just how far will this desperate father go to protect his family?",
            "rank": 3,
            "running_time_secs": 9180,
            "actors": [
                "Hugh Jackman",
                "Jake Gyllenhaal",
                "Viola Davis"
            ]
        }
    }, {
        "year": 2013,
        "title": "The Hunger Games: Catching Fire",
        "info": {
            "directors": ["Francis Lawrence"],
            "release_date": "2013-11-11T00:00:00Z",
            "genres": [
                "Action",
                "Adventure",
                "Sci-Fi",
                "Thriller"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTAyMjQ3OTAxMzNeQTJeQWpwZ15BbWU4MDU0NzA1MzAx._V1_SX400_.jpg",
            "plot": "Katniss Everdeen and Peeta Mellark become targets of the Capitol after their victory in the 74th Hunger Games sparks a rebellion in the Districts of Panem.",
            "rank": 4,
            "running_time_secs": 8760,
            "actors": [
                "Jennifer Lawrence",
                "Josh Hutcherson",
                "Liam Hemsworth"
            ]
        }
    }, {
        "year": 2014,
        "title": "X-Men: Days of Future Past",
        "info": {
            "directors": ["Bryan Singer"],
            "release_date": "2014-05-21T00:00:00Z",
            "genres": [
                "Action",
                "Adventure",
                "Fantasy",
                "Sci-Fi"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTQ0NzIwNTA1MV5BMl5BanBnXkFtZTgwNjY2OTcwMDE@._V1_SX400_.jpg",
            "plot": "The X-Men send Wolverine to the past to change a major historical event that could globally impact man and mutant kind.",
            "rank": 9,
            "actors": [
                "Jennifer Lawrence",
                "Hugh Jackman",
                "Michael Fassbender"
            ]
        }
    }, {
        "year": 2014,
        "title": "Transformers: Age of Extinction",
        "info": {
            "directors": ["Michael Bay"],
            "release_date": "2014-06-25T00:00:00Z",
            "genres": [
                "Action",
                "Adventure",
                "Sci-Fi"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTQyMDA5Nzg0Nl5BMl5BanBnXkFtZTgwNzA4NDcxMDE@._V1_SX400_.jpg",
            "plot": "A mechanic and his daughter make a discovery that brings down Autobots and Decepticons - and a paranoid government official - on them.",
            "rank": 10,
            "actors": [
                "Mark Wahlberg",
                "Nicola Peltz",
                "Jack Reynor"
            ]
        }
    }, {
        "year": 2013,
        "title": "Now You See Me",
        "info": {
            "directors": ["Louis Leterrier"],
            "release_date": "2013-05-21T00:00:00Z",
            "rating": 7.3,
            "genres": [
                "Crime",
                "Mystery",
                "Thriller"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTY0NDY3MDMxN15BMl5BanBnXkFtZTcwOTM5NzMzOQ@@._V1_SX400_.jpg",
            "plot": "An FBI agent and an Interpol detective track a team of illusionists who pull off bank heists during their performances and reward their audiences with the money.",
            "rank": 11,
            "running_time_secs": 6900,
            "actors": [
                "Jesse Eisenberg",
                "Common",
                "Mark Ruffalo"
            ]
        }
    }, {
        "year": 2013,
        "title": "Gravity",
        "info": {
            "directors": ["Alfonso Cuaron"],
            "release_date": "2013-08-28T00:00:00Z",
            "rating": 8.2,
            "genres": [
                "Drama",
                "Sci-Fi",
                "Thriller"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BNjE5MzYwMzYxMF5BMl5BanBnXkFtZTcwOTk4MTk0OQ@@._V1_SX400_.jpg",
            "plot": "A medical engineer and an astronaut work together to survive after an accident leaves them adrift in space.",
            "rank": 12,
            "running_time_secs": 5400,
            "actors": [
                "Sandra Bullock",
                "George Clooney",
                "Ed Harris"
            ]
        }
    }, {
        "year": 2013,
        "title": "We're the Millers",
        "info": {
            "directors": ["Rawson Marshall Thurber"],
            "release_date": "2013-08-03T00:00:00Z",
            "rating": 7.2,
            "genres": [
                "Comedy",
                "Crime"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMjA5Njc0NDUxNV5BMl5BanBnXkFtZTcwMjYzNzU1OQ@@._V1_SX400_.jpg",
            "plot": "A veteran pot dealer creates a fake family as part of his plan to move a huge shipment of weed into the U.S. from Mexico.",
            "rank": 13,
            "running_time_secs": 6600,
            "actors": [
                "Jason Sudeikis",
                "Jennifer Aniston",
                "Emma Roberts"
            ]
        }
    }, {
        "year": 2013,
        "title": "Riddick",
        "info": {
            "directors": ["David Twohy"],
            "release_date": "2013-09-04T00:00:00Z",
            "rating": 6.8,
            "genres": [
                "Action",
                "Sci-Fi",
                "Thriller"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTk5NzYwMzQ4MV5BMl5BanBnXkFtZTcwMjE5MTI1OQ@@._V1_SX400_.jpg",
            "plot": "Left for dead on a sun-scorched planet, Riddick finds himself up against an alien race of predators. Activating an emergency beacon alerts two ships: one carrying a new breed of mercenary, the other captained by a man from Riddick's past.",
            "rank": 14,
            "running_time_secs": 7140,
            "actors": [
                "Vin Diesel",
                "Karl Urban",
                "Katee Sackhoff"
            ]
        }
    }, {
        "year": 2013,
        "title": "The Family",
        "info": {
            "directors": ["Luc Besson"],
            "release_date": "2013-09-10T00:00:00Z",
            "rating": 6.5,
            "genres": [
                "Action",
                "Comedy",
                "Crime"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMjE2MzI0MzkyNV5BMl5BanBnXkFtZTcwMjQ2MDM2OQ@@._V1_SX400_.jpg",
            "plot": "The Manzoni family, a notorious mafia clan, is relocated to Normandy, France under the witness protection program, where fitting in soon becomes challenging as their old habits die hard.",
            "rank": 15,
            "running_time_secs": 6660,
            "actors": [
                "Robert De Niro",
                "Michelle Pfeiffer",
                "Dianna Agron"
            ]
        }
    }, {
        "year": 2013,
        "title": "Star Trek Into Darkness",
        "info": {
            "directors": ["J.J. Abrams"],
            "release_date": "2013-05-02T00:00:00Z",
            "rating": 7.9,
            "genres": [
                "Action",
                "Adventure",
                "Sci-Fi"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTk2NzczOTgxNF5BMl5BanBnXkFtZTcwODQ5ODczOQ@@._V1_SX400_.jpg",
            "plot": "After the crew of the Enterprise find an unstoppable force of terror from within their own organization, Captain Kirk leads a manhunt to a war-zone world to capture a one man weapon of mass destruction.",
            "rank": 16,
            "running_time_secs": 7920,
            "actors": [
                "Chris Pine",
                "Zachary Quinto",
                "Zoe Saldana"
            ]
        }
    }, {
        "year": 2013,
        "title": "After Earth",
        "info": {
            "directors": ["M. Night Shyamalan"],
            "release_date": "2013-05-01T00:00:00Z",
            "rating": 4.9,
            "genres": [
                "Action",
                "Adventure",
                "Sci-Fi"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTY3MzQyMjkwMl5BMl5BanBnXkFtZTcwMDk2OTE0OQ@@._V1_SX400_.jpg",
            "plot": "A crash landing leaves Kitai Raige and his father Cypher stranded on Earth, a millennium after events forced humanity's escape. With Cypher injured, Kitai must embark on a perilous journey to signal for help.",
            "rank": 17,
            "running_time_secs": 6000,
            "actors": [
                "Jaden Smith",
                "David Denman",
                "Will Smith"
            ]
        }
    }, {
        "year": 2013,
        "title": "The Great Gatsby",
        "info": {
            "directors": ["Baz Luhrmann"],
            "release_date": "2013-05-01T00:00:00Z",
            "rating": 7.3,
            "genres": [
                "Drama",
                "Romance"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTkxNTk1ODcxNl5BMl5BanBnXkFtZTcwMDI1OTMzOQ@@._V1_SX400_.jpg",
            "plot": "A Midwestern war veteran finds himself drawn to the past and lifestyle of his millionaire neighbor.",
            "rank": 18,
            "running_time_secs": 8580,
            "actors": [
                "Leonardo DiCaprio",
                "Carey Mulligan",
                "Joel Edgerton"
            ]
        }
    }, {
        "year": 2014,
        "title": "Divergent",
        "info": {
            "directors": ["Neil Burger"],
            "release_date": "2014-03-20T00:00:00Z",
            "genres": [
                "Action",
                "Adventure",
                "Romance",
                "Sci-Fi"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMjIyOTEyODQ4OV5BMl5BanBnXkFtZTgwMDIwNzEzMDE@._V1_SX400_.jpg",
            "plot": "Beatrice Prior, a teenager with a special mind, finds her life threatened when an authoritarian leader seeks to exterminate her kind in her effort to seize control of their divided society.",
            "rank": 20,
            "actors": [
                "Shailene Woodley",
                "Kate Winslet",
                "Zoe Kravitz"
            ]
        }
    }, {
        "year": 2013,
        "title": "We Are What We Are",
        "info": {
            "directors": ["Jim Mickle"],
            "release_date": "2013-01-18T00:00:00Z",
            "rating": 6.2,
            "genres": [
                "Drama",
                "Horror",
                "Thriller"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMjI3NjI3NjAyN15BMl5BanBnXkFtZTgwODE3NzMxMDE@._V1_SX400_.jpg",
            "plot": "The Parkers, a reclusive family who follow ancient customs, find their secret existence threatened as a torrential downpour moves into their area, forcing daughters Iris and Rose to assume responsibilities beyond those of a typical family.",
            "rank": 21,
            "running_time_secs": 6300,
            "actors": [
                "Bill Sage",
                "Ambyr Childers",
                "Julia Garner"
            ]
        }
    }]
});