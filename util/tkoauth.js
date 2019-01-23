const ClientOAuth2 = require('client-oauth2')
const Url = require("url")
const rp = require("request-promise-native")
const config = require("../config")
const claims = process.env.CLAIMS || config.claims
const host = process.env.HOST || config.host
const walletServiceUrl = process.env.walletServiceUrl||config.walletServiceUrl
console.log ("walletServiceUrl :", walletServiceUrl)
console.log ("host :", host)
console.log("clientid", config.clientId)
console.log("clientsecret",config.clientSecret)
const clientId = process.env.CLIENTID || config.clientId
const clientSecret = process.env.CLIENTSECRET || config.clientSecret

/*
 * Generic helper method used to generate claims
 * Used for showing how to generate claims for a larger list
 * of claims
 */
let genClaims = () => {
  let userinfo = claims.reduce((dict, claim) => {
    dict[claim] = null
    return dict
  }, {})
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
  redirectUri: Url.resolve(host, config.callbackRoute),
  scopes: scopes,
  state: state
})

var getAuthUri = (oauthClient, query, useClaims) => {
  useClaims = useClaims || false
  query = query || {}
  if (useClaims) query.claims = genClaims()
  return oauthClient.code.getUri({
    query: query
  })
}

var getCallbackToken = async (oauthClient, originalUrl) => {
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
