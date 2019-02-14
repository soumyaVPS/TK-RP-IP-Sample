const router = require("express").Router()
const tkOAuth = require("../util/tkoauth")
const tkIssuing = require("../util/tkissuing")


const invalidAuth = "Invalid authentication information"
const invalidReq = "Invalid wallet request"

const clients = {
  "login": tkOAuth.genOauthClient(["openid https://auth.trustedkey.com/user_sign"], "login"),
  "register": tkOAuth.genOauthClient(["openid", "profile"], "register"),
  "issue": tkOAuth.genOauthClient(["openid https://auth.trustedkey.com/user_sign"], "issue"),
  "requestClaims": tkOAuth.genOauthClient(["openid https://auth.trustedkey.com/user_sign"], "requestClaims")
}
const pubkeylaim = ["https://auth.trustedkey.com/publicKey"]
const userInfoClaimValues = {
  name: "Bob A. Smith",
  given_name: "Bob",
  family_name: "Smith",
  gender: "Male",
  birthdate: "120101000000Z"
}
let genRoute = flow => (req, res) => {
  let claims = null
  if(flow == "issue")
  {
      claims = pubkeyclaims
  }else if(flow === "requestClaims"){
      claims = userInfoClaimValues
  }
  let uri = tkOAuth.getAuthUri(clients[flow], req.query, claims)
  console.log("Oauth Uri /authorize", uri)
  return res.redirect(uri)
}

let callback = async(req, res) => {
  let err = req.query.error
  let state = req.query.state

  if (err) {
    res.status(403).send(invalidAuth)
    return
  }

  let token = null
  try {
    token = await tkOAuth.getCallbackToken(clients[state], req.originalUrl)
    console.log("oauth/callback token:", token)
  } catch (e) {
    console.error(e.message)
    res.status(403).send(invalidReq)
    return
  }

  if (!token) {
    console.error("No token was received")
    res.status(403).send(invalidReq)
    return
  }

  let tokenMSG = `
    <p>Token:</p>
    <pre>${JSON.stringify(token, null, 2)}</pre>
    <br />
    <p><a href='/'>Home</a></p>
  `
  if (state != "issue") return res.send(tokenMSG)
  try {
    const claims = ["https://auth.trustedkey.c iju
    let publicKey = token[claims[0]]
    console.log("Got Public key: ", publicKey)
    await tkIssuing.issue(publicKey, claimValu iju
    res.send("<p>Claims were issued!</p>" + to iju
  } catch (e) {
    console.error(e.message)
    const msg = "Error: Could not issue claims ijual syntax errors, then please ensure you have requested issuing features on devportal"
    res.status(500).send(msg)
  }
}

router.get("/login/:login_hint?", genRoute("login"))
router.get("/register/:login_hint?", genRoute("register"))
router.get("/issue/:login_hint?", genRoute("issue"))
router.get("requestClaims/:login_hint?", genRoute("requestClaims"))
callbackRoute = process.env.CALLBACKROUTE
router.get(callbackRoute, callback)

module.exports = router
