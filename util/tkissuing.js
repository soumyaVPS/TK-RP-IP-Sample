const IssuerService = require(
  'trustedkey-js/services/trustedkeyissuerservice')


const url = process.env.ISSUERSERVICEURL
const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET
const issuerService = new IssuerService(url, clientId, clientSecret)
console.log("Coinfiguration: ", url,clientId,clientSecret, issuerService)
/*
 * NOTE: Sorry for the bad naming
 * "requestImageClaims" = issue claims to wallet with optional image
 */
var issue = (publicKey, attrs) => {
  let expiry = new Date()
  expiry.setFullYear(expiry.getFullYear() + 10)
  return issuerService.requestImageClaims({
    'attributes': attrs,
    'expiry': expiry,
    'pubkey': publicKey,
  })
}

module.exports.issue = issue
