const IssuerService = require(
  'trustedkey-js/services/trustedkeyissuerservice')
const config = require("../config")

const url = process.env.issuerServiceUrl ||  config.issuerServiceUrl
const clientId = process.env.CLIENTID || config.clientId
const clientSecret = process.env.CLIENTSECRET || config.clientSecret
const issuerService = new IssuerService(url, clientId, clientSecret)
console.log("Coinfiguration: ", url,clientId,clientSecret, issuerService)
/*
 * NOTE: Sorry for the bad naming
 * "requestImageClaims" = issue claims to wallet with optional image
 */
var issue = (publicKey, attrs) => {
  let expiry = new Date()
  expiry.setFullYear(expiry.getFullYear() + config.expiryYears)
  return issuerService.requestImageClaims({
    'attributes': attrs,
    'expiry': expiry,
    'pubkey': publicKey,
  })
}

module.exports.issue = issue
