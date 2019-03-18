const debug = require('debug')('linto-admin:home')
//const sha1 = require('sha1')
/*const DBmodel = require(`${process.cwd()}/model/${process.env.BDD_TYPE}`)
const model = new DBmodel()*/

module.exports = (webServer) => {
  return [
    {
      path: '/',
      method: 'get',
      controller: async (req, res, next) => {
        console.log(req.session)
        res.sendFile(process.cwd() + '/dist/index.html')
      }
    }
  ]
}