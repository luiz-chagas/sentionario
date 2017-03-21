"use strict";


const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Palavra = require('../models/palavra.js');
const Voto = require('../models/votos.js');
const MetaDiaria = require('../models/metaDiaria.js');
const SugerirPalavra = require('../models/sugerirPalavra.js');
const pg = require('pg');
const client = new pg.Client();
const passport = require('../middleware/auth.js');

router.get('/palavras', function (req, res, next) {
  Palavra.findAll().then(function (palavras) {
    return res.status(200).json(palavras);
  });
});

router.post('/palavra', function (req, res, next) {
  Palavra.findOne({
    where: {
      nome: req.body.palavra
    }
  }).then(function (palavra) {
    if (palavra) {
      return res.status(500).json({
        status: "Palavra ja existe"
      });
    } else {
      Palavra.create({
        nome: req.body.palavra
      }).then(function (palavra) {
        return res.status(200).json({
          status: "Palavra inserida com sucesso"
        });
      }, function (err) {
        return res.status(500).json({
          status: "Erro do sistema"
        });
      });
    }
  }, function (erro) {
    return res.status(500).json({
      status: "Erro do sistema"
    });
  });
});

router.post('/voto', function (req, res, next) {
  var palavraId = req.body.palavraId;
  var userId = req.body.userId;
  var valor = req.body.valor;
  Voto.create({
    id: null,
    id_usuario: userId,
    id_palavra: palavraId,
    voto: valor
  }).then(function (voto) {
    Palavra.findById(voto.id_palavra)
      .then(function (palavra) {
        switch (valor) {
          case 1:
            palavra.set("votos1", ++palavra.votos1);
            palavra.set("total", palavra.total + 1);
            break;
          case 2:
            palavra.set("votos2", ++palavra.votos2);
            palavra.set("total", palavra.total + 2);
            break;
          case 3:
            palavra.set("votos3", ++palavra.votos3);
            palavra.set("total", palavra.total + 3);
            break;
          case 4:
            palavra.set("votos4", ++palavra.votos4);
            palavra.set("total", palavra.total + 4);
            break;
          case 5:
            palavra.set("votos5", ++palavra.votos5);
            palavra.set("total", palavra.total + 5);
            break;
          case 6:
            palavra.set("votos6", ++palavra.votos6);
            palavra.set("total", palavra.total + 6);
            break;
          case 7:
            palavra.set("votos7", ++palavra.votos7);
            palavra.set("total", palavra.total + 7);
            break;
          case 8:
            palavra.set("votos8", ++palavra.votos8);
            palavra.set("total", palavra.total + 8);
            break;
          case 9:
            palavra.set("votos9", ++palavra.votos9);
            palavra.set("total", palavra.total + 9);
            break;
        }
        palavra.set("qtdVotos", ++palavra.qtdVotos);
        palavra.set("votosmedia", palavra.total / palavra.qtdVotos);
        palavra.save();
        User.findById(voto.id_usuario)
          .then(function (user) {
            user.set("pontos", user.pontos + 5);
            MetaDiaria.findOne({
              where: {
                id_usuario: user.id,
                dia: new Date().getDate(),
                mes: new Date().getMonth(),
                ano: new Date().getYear()
              }
            }).then(function (meta) {
              if (!meta) {
                MetaDiaria.create({
                  id_usuario: req.user.id
                }).then(function (newmeta) {
                  meta = newmeta;
                  meta.votos = meta.votos + 1;
                  meta.save();
                  user.save().then(function () {
                    return res.status(200).json({
                      status: 'Voto computado com sucesso',
                      user: user,
                      meta: meta
                    });
                  });
                });
              } else {
                if (!meta.concluida) {
                  meta.votos = meta.votos + 1;
                  if (meta.votos == 20) {
                    meta.concluida = true;
                    user.set("pontos", user.pontos + 100);
                  }
                  meta.save();
                }
                user.save().then(function () {
                  user.password = undefined;
                  return res.status(200).json({
                    status: 'Voto computado com sucesso',
                    user: user,
                    meta: meta
                  });
                });
              }
            });
          });
      });
  });
});

router.post('/cadastro', function (req, res, next) {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (user) {
    if (!user) {
      User.create({
        id: null,
        nome: req.body.nome,
        email: req.body.email,
        pontos: 0,
        senha: req.body.senha
      }).then(function (user) {
        passport.authenticate('local', function (err, user, info) {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(401).json({
              err: info.message,
              user: null
            });
          }
          req.logIn(user, function (err) {
            if (err) {
              return res.status(500).json({
                err: 'Nao foi possivel logar',
                user: null
              });
            }
            res.status(200).json({
              user: req.user
            });
          });
        })(req, res, next);
      });
    } else {
      res.send("Usuario ja existe");
    }
  });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info.message,
        user: null
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Nao foi possivel logar',
          user: null
        });
      }
      res.status(200).json({
        user: req.user
      });
    });
  })(req, res, next);
});

router.post('/avatar', function (req, res) {
  User.findById(req.user.id)
    .then(function (user) {
      if (user.avatar === 'anonymous') {
        user.set("pontos", user.pontos + 50);
      }
      user.set("avatar", req.body.avatar);
      user.save()
        .then(function () {
          res.status(200).json({
            user: user,
            status: "Avatar atualizado!"
          });
        });
    }, function () {
      return res.status(301).json({
        status: 'Favor efetuar login'
      });
    });
});

router.post('/perfil', function (req, res) {
  User.findById(req.user.id)
    .then(function (user) {
      user.set("nome", req.body.nome);
      user.set("email", req.body.email);
      user.save()
        .then(function () {
          res.status(200).json({
            status: "Perfil atualizado!",
            user: user
          });
        });
    }, function () {
      return res.status(500).json({
        status: 'Erro interno'
      });
    });
});

router.get('/ranking', function (req, res) {
  User.findAll({
    order: [
      ['pontos', 'DESC']
    ]
  }).then(function (users) {
    let top = [];
    let pos = 0;
    for (let i = 0, j = users.length; i < j || pos === 0; i++) {
      if (i < 10) {
        top.push(users[i]);
      }
      if (req.user.id === users[i].id) {
        pos = i + 1;
      }
    }
    return res.status(200).json({
      top: top,
      pos: pos
    });
  });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'Deslogado com sucesso!'
  });
});

router.get('/user', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      logado: false
    });
  }
  res.status(200).json({
    logado: true,
    user: req.user.dataValues
  });
});

router.get('/metaDiaria', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(301).json({
      status: "Favor realizar login"
    });
  } else {
    MetaDiaria.findAll({
      where: {
        id_usuario: req.user.id,
        dia: new Date().getDate(),
        mes: new Date().getMonth(),
        ano: new Date().getYear()
      }
    }).then(function (meta) {
      if (!meta.length) {
        MetaDiaria.create({
          id_usuario: req.user.id
        }).then(function (newmeta) {
          return res.status(200).json(newmeta);
        });
      } else {
        return res.status(200).json(meta);
      }
    });
  }
});

router.get('/estatistica', function (req, res) {
  var stats = {};
  User.findAll()
    .then(function (users) {
      stats.usuarios = users.length;
      Palavra.findAll()
        .then(function (palavras) {
          stats.palavras = palavras.length;
          Palavra.findAll({
            where: {
              votosmedia: {
                $gt: 5
              }
            }
          }).then(function (palavras) {
            stats.palavrasPos = palavras.length;
            Palavra.findAll({
              where: {
                votosmedia: {
                  $lt: 5
                }
              }
            }).then(function (palavras) {
              stats.palavrasNeg = palavras.length;
              return res.status(200).json(stats);
            });
          });
        });
    });
});

router.post('/sugerirpalavra', function (req, res) {
  let userId = req.user.id;
  let palavra = "" || req.body.palavra;
  if (palavra.length === 0) {
    return res.status(500).json({
      status: "Palavra Invalida"
    });
  }
  return Palavra.findOne({
    where: {
      nome: palavra
    }
  }).then((achouPalavra) => {
    if (achouPalavra)
      return res.status(500).json({
        status: "Erro! Palavra já existe"
      });
    return SugerirPalavra.findOne({
      where: {
        palavra: palavra
      }
    }).then((sugerir) => {
      if (sugerir)
        return res.status(500).json({
          status: "Erro! Palavra já foi sugerida"
        });
      return SugerirPalavra.create({
        id_usuario: userId,
        palavra: palavra
      }).then((sugerirPalavra) => {
        return res.status(200).json({
          status: "Palavra sugerida com sucesso"
        });
      });
    });
  });
});

router.get('/palavrasSugeridas', function (req, res) {
  return SugerirPalavra.findAll({
      where: {
        aceita: null
      }
    })
    .then((palavras) => {
      return res.status(200).json({
        palavras: palavras
      });
    })
});

router.post('/aceitarPalavra', function (req, res) {
  let id = req.body.palavra.id;
  SugerirPalavra.findById(id)
    .then((sugerir) => {
      sugerir.aceita = true;
      sugerir.id_avaliador = req.user.id;
      Palavra.create({
        nome: sugerir.palavra
      });
      sugerir.save()
        .then(() => {
          return res.status(200);
        });
    });
});

router.post('/recusarPalavra', function (req, res) {
  let id = req.body.palavra.id;
  SugerirPalavra.findById(id)
    .then((sugerir) => {
      sugerir.aceita = false;
      sugerir.id_avaliador = req.user.id;
      sugerir.save()
        .then(() => {
          return res.status(200);
        });
    });
});

router.get('*', function (req, res) {
  return res.status(404).json({
    status: "Pagina nao encontrada"
  });
});

module.exports = router;
