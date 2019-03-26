const debug = require('debug')('linto-admin:login')
const sha1 = require('sha1')
const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()

module.exports = (webServer) => {
  return [{
      path: '/userAuth',
      method: 'post',
      controller: async (req, res, next) => {
        if (req.body.email != "undefined" && req.body.password != "undefined") { // get post datas
          const email = req.body.email
          const password = req.body.password
          try {
            let user
            let getUser = await model.getUserByEmail(email)
            if (getUser.length > 0) {
              user = getUser[0]
            }
            if (typeof (user) === "undefined") { // User not found
              res.json({
                "status": "error",
                "field": "user",
                "msg": "User not found"
              })
            } else { // User found
              const userPswdHash = user.passwordHash
              const salt = user.salt
              // Compare password with database
              if (sha1(password + salt) == userPswdHash) {
                req.session.logged = 'on'
                req.session.user = user.emailHash
                req.session.save((err) => {
                  if (err) {
                    res.json({
                      "status": "error",
                      "field": "global",
                      "msg": "Error on saving session"
                    })
                  } else {
                    //Valid password
                    res.json({
                      "status": "success",
                      "field": "global",
                      "msg": "valid",
                      "userHash": user.emailHash
                    })
                  }
                })
              } else {
                // Invalid password
                res.json({
                  "status": "error",
                  "field": "password",
                  "msg": "Invalid password"
                })
              }
            }
          } catch (error) {
            console.error(error)
            res.json({
              "status": "error",
              "field": "global",
              "msg": error
            })
          }
        } else {
          res.json({
            "status": "error",
            "field": "global",
            "msg": "An error has occured whent trying to connect to database"
          })
        }
      }
    },
    {
      path: '/createUser',
      method: 'post',
      controller: async (req, res, next) => {
        const userInfos = req.body
        const createUser = await model.createUser(userInfos)
        if (createUser === 'success') {
          const getUser = await model.getUserByEmail(userInfos.email)
          req.session.logged = 'on'
          req.session.user = getUser[0].emailHash
          req.session.save((err) => {
            if (err) {
              res.json({
                "status": "error",
                "msg": "Error on saving session"
              })
            } else {
              res.json({
                status: 'success',
                msg: 'Compte créé avec succès',
                userHash: getUser[0].emailHash
              })
            }
          })
        } else {
          res.json({
            status: 'error',
            msg: createUser
          })
        }
      }
    },
    
    
  ]
}