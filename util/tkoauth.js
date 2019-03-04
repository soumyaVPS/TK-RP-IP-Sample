const ClientOAuth2 = require('client-oauth2')
const Url = require("url")
const rp = require("request-promise-native")


const host = process.env.HOST
const walletServiceUrl = process.env.WALLETSERVICEURL
console.log ("walletServiceUrl :", walletServiceUrl)
console.log ("host :", host)


const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

/*
 * Generic helper method used to generate claims
 * Used for showing how to generate claims for a larger list
 * of claims
 */
let genClaims = (claims) => {
  let userinfo = claims.reduce((dict, claim) => {
    dict[claim] = null
    return dict
  }, {})
  console.log(userinfo)
  return JSON.stringify({
    userinfo: userinfo
  })
}

/*
 * Generic helper method used to generate OAuth Client
 */
var genOauthClient = (scopes, state) => new ClientOAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  accessTokenUri: Url.resolve(walletServiceUrl, '/oauth/token'),
  authorizationUri: Url.resolve(walletServiceUrl, '/oauth/authorize'),
  redirectUri: Url.resolve(host, process.env.CALLBACKROUTE),
  scopes: scopes,
  state: state
})

var getAuthUri = (oauthClient, query, claims) => {
  query = query || {}
  if (claims != null) query.claims = genClaims(claims)
  return oauthClient.code.getUri({
    query: query
  })

}

var  getCallbackToken = async (oauthClient, originalUrl) => {
  let tok = await oauthClient.code.getToken(originalUrl)
  let accessToken = tok.accessToken
  return await rp({
    uri: Url.resolve(walletServiceUrl, '/oauth/user'),
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    json: true
  })
}

module.exports.genOauthClient = genOauthClient
module.exports.getAuthUri = getAuthUri
module.exports.getCallbackToken = getCallbackToken
