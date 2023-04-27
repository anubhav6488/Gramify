const jwt = require('jsonwebtoken');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];
const secret = stage.JWT_SECRET;
const OAuthBuilder = require("@zohocrm/nodejs-sdk-2.0/models/authenticator/oauth_builder").OAuthBuilder;
/*
* Create a Token instance that requires the following
* clientId -> OAuth client id.
* clientSecret -> OAuth client secret.
* refreshToken -> REFRESH token.
* accessToken -> Access token.
* grantToken -> GRANT token.
* id -> User unique id.
* redirectURL -> OAuth redirect URL.
*/
//Create a Token instance
// if refresh token is available
// The SDK throws an exception, if the given id is invalid.
let token = new OAuthBuilder()
.id("1000.3VAPF92IYUGJ0AYGNR1CQV8UDSHQFL")
.build();

// // if grant token is available
// let token = new OAuthBuilder()
// .clientId("clientId")
// .clientSecret("clientSecret")
// .grantToken("grantToken")
// .redirectURL("redirectURL")
// .build();

// // if ID (obtained from persistence) is available
// let token = new OAuthBuilder()
// .clientId("clientId")
// .clientSecret("clientSecret")
// .refreshToken("refreshToken")
// .redirectURL("redirectURL")
// .build();

// // if access token is available
// let token = new OAuthBuilder()
// .accessToken("accessToken")
// .build();
