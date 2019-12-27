const User=require('../models/user');
const OK_STATUS = 200;
const ERR_CLIENT_STATUS = 412;
const ERR_SERVER_STATUS = 500;

/**
 * UserControl
 *
 * This module represents the User Controller
 *
 * @module
 * @author Giannandrea Vicidomini
 *
 * 2019 - Copyright by Gang Of Four Eyes
*/


/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.delete=function(req, res) {
  const user=req.body.user;
  if (user==null) {
    res.status(ERR_CLIENT_STATUS);
    res.send({error: 'L\'utente non puo essere nullo'});
    return;
  }

  User.delete(user)
      .then((data)=>{
        res.status(OK_STATUS).send({result: true});
      })
      .catch((err)=>{
        res.status(ERR_SERVER_STATUS).send({error: false});
        return;
      });
};

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.search=function(req, res) {
  const param=req.body.param;

  if (param == null) {
    res.status(ERR_CLIENT_STATUS);
    res.send({error: 'L\'utente non puo essere nullo'});
    return;
  }

  const filter = {
    password: param.password,
    name: param.name,
    surname: param.surname,
    role: param.role,
    verified: param.verified,
  };

  User.search(filter)
      .then((users)=>{
        res.status(OK_STATUS).send({list: users});
      })
      .catch((err)=>{
        res.status(ERR_SERVER_STATUS).send({error: err});
      });
};

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.update=function(req, res) {
  const user=req.body.user;

  if (user == null) {
    res.status(ERR_CLIENT_STATUS);
    res.send({error: 'L\'utente non puo essere nullo'});
    return;
  }

  User.update(user)
      .then((newUser)=>{
        res.status(OK_STATUS).send({user: newUser});
      })
      .catch((err)=>{
        res.status(ERR_SERVER_STATUS).send({error: err});
      });
};

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.find=function(req, res) {
  const email = req.query.email;
  if (email == null) {
    res.status(ERR_CLIENT_STATUS);
    res.send({error: 'L\'email non puo essere nullo'});
    return;
  }
  User.findByEmail(email)
      .then((user)=>{
        res.status(OK_STATUS).send({user: user});
      })
      .catch((err)=>{
        res.status(ERR_SERVER_STATUS).send({error: err});
      });
};

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.findAll=function(req, res) {
  User.findAll()
      .then((userList)=>{
        res.status(OK_STATUS).send({list: userList});
      })
      .catch((err)=>{
        res.statusText(ERR_SERVER_STATUS).send({error: err});
      });
};