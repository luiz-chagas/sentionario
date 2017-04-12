// Iniciando app

var app = angular.module('sentionario', ['rzModule', 'ngRoute', 'ngAnimate']);

// Middleware

app.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.deslogar = function () {
    AuthService.logout()
      .then(function () {
        $location.path('/');
        $route.reload();
      });
  };

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    setMenu(next.$$route.originalPath);

    function setMenu(path) {
      path = path.substring(1); //Remover "/"
      $('.menu li a').each(function (ind, elem) {
        $(elem).removeClass("ativo");
      });
      $('.menu-' + path).addClass("ativo");
    }

    AuthService.getUserStatus()
      .then(function () {
        if (!AuthService.isLoggedIn()) {
          $rootScope.logado = false;
        } else {
          $rootScope.logado = true;
          $rootScope.user = AuthService.getUser();
          $rootScope.metaDiaria = AuthService.getMeta();
        }
      }).then(function () {
        if (next.restricted && !$rootScope.logado) {
          $location.path('/');
        } else if (next.admin && !$rootScope.user.admin) {
          $location.path('/');
        }
      });
  });
});

// Configurando rotas

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './partials/home.html',
      controller: 'HomeController'
    })
    .when('/ajuda', {
      templateUrl: './partials/ajuda.html',
      controller: 'AjudaController'
    })
    .when('/colaborar', {
      templateUrl: './partials/colaborar.html',
      controller: 'ColaborarController',
      restricted: true
    })
    .when('/consultar', {
      templateUrl: './partials/consultar.html',
      controller: 'ConsultarController'
    })
    .when('/download', {
      templateUrl: './partials/download.html',
      controller: 'DownloadController'
    })
    .when('/perfil', {
      templateUrl: './partials/perfil.html',
      controller: 'PerfilController',
      restricted: true
    })
    .when('/estatisticas', {
      templateUrl: './partials/estatisticas.html',
      controller: 'RankingController',
      restricted: true
    })
    .when('/conquistas', {
      templateUrl: './partials/conquistas.html',
      controller: 'ConquistasController',
      restricted: true
    })
    .when('/logout', {
      controller: 'LogoutController',
      restricted: true
    })
    .when('/administrar', {
      controller: 'AdministrarController',
      templateUrl: './partials/administrar.html',
      restricted: true
    })
    .when('/ademir', {
      controller: 'AdminController',
      templateUrl: './partials/ademir.html',
      restricted: true,
      admin: true
    });

  $locationProvider.html5Mode(true);
});

app.controller('HomeController', ["$scope", "$location", "AuthService", "$route", "$http", function ($scope, $location, AuthService, $route, $http) {

  let pontosNecessariosSugerir = 250;
  $scope.pontosNecessarios = pontosNecessariosSugerir;

  AuthService.getUserStatus().then(function () {
    if (AuthService.isLoggedIn()) {
      $scope.sugerir = AuthService.getUser().pontos > pontosNecessariosSugerir ? true : false;
      $scope.metaAvatar = ($scope.user.avatar === 'anonymous');
      $('#myBar').css("width", ($scope.metaDiaria.votos * 5) + "%");
    } else {
      $scope.sugerir = false;
    }
  });

  $scope.reset = function () {
    $scope.erro = "";
  };

  $scope.palavraSugerida = "";

  $scope.sugerirPalavra = function () {
    if (!$scope.palavraSugerida) {
      return;
    }
    data = {
      palavra: $scope.palavraSugerida.trim().toLowerCase()
    }
    $http.post("/api/sugerirpalavra", data)
      .then((response) => {
        $scope.palavraSugerida = "";
        $scope.status = response.data.status;
      })
      .catch((err) => {
        $scope.palavraSugerida = "";
        $scope.status = err.data.status;
      });
  };

  $scope.logar = function () {
    $scope.erro = "";
    if ($scope.email === null) {
      $scope.erro = "Preencha email corretamente";
      return;
    }
    AuthService.login($scope.email, $scope.senha)
      .then(function (response) {
        $route.reload();
      }, function (error) {
        $scope.erro = "Usuario ou senha invalidos";
      });
  };

  $scope.registrar = function () {
    if ($scope.senha != $scope.confirmaSenha) {
      $scope.erro = "Senhas devem ser iguais";
      return;
    }
    if ($scope.email === null) {
      $scope.erro = "Preencha email corretamente";
      return;
    }
    $scope.erro = "";
    AuthService.register($scope.nome, $scope.email, $scope.senha)
      .then(function () {
        AuthService.login($scope.email, $scope.senha)
          .then(function () {
            $route.reload();
          });
      })
      .catch(function () {
        $scope.erro = "Erro ao cadastrar no sistema";
      });
  };
}]);

app.controller('ColaborarController', ["$scope", "$http", "$timeout", "AuthService", "$route", function ($scope, $http, $timeout, AuthService, $route) {
  var palavras = [];

  $http.get("/api/palavras").
  then(function (response) {
    palavras = response.data;
    setPalavra();
  });

  function update() {
    $scope.output = $scope.estados[$scope.slider.value - 1];
    $scope.smiley = "../images/smiley" + $scope.slider.value + ".png";
  }
  $scope.palavra = {
    nome: 'Carregando...'
  };
  $scope.envia = function () {
    $scope.disabled = true;
    var data = {
      palavraId: $scope.palavra.id,
      userId: $scope.user.id,
      valor: $scope.slider.value
    };
    $scope.palavra.nome = "Carregando...";
    $http.post("/api/voto", data)
      .then(function (response) {
        $('#pontos').prop('number', $scope.user.pontos);
        $scope.user = response.data.user;
        $('#pontos').animateNumber({
          number: $scope.user.pontos
        }, 300);
        $scope.metaDiaria = response.data.meta;
        $('#myBar').animate({
          width: ($scope.metaDiaria.votos * 5) + "%"
        }, 300);
        setPalavra();
      });
  };
  $scope.slider = {
    value: 5,
    options: {
      floor: 1,
      ceil: 9,
      showTicks: true,
      hideLimitLabels: true,
      hidePointerLabels: true,
      onChange: update
    }
  };
  $scope.estados = [
    "Extremamente Negativo",
    "Muito Negativo",
    "Moderadamente Negativo",
    "Levemente Negativo",
    "Neutro",
    "Levemente Positivo",
    "Moderadamente Positivo",
    "Muito Positivo",
    "Extremamente Positivo"
  ];
  $scope.output = $scope.estados[$scope.slider.value - 1];
  $scope.smiley = "../images/smiley" + $scope.slider.value + ".png";

  function setPalavra() {
    var i = Math.random() * palavras.length;
    i = Math.floor(i);
    $scope.palavra.nome = palavras[i].nome;
    $scope.palavra.id = palavras[i].id;
    $scope.slider.value = 5;
    update();
    $scope.disabled = false;
  }
}]);

app.controller('ConsultarController', ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {

  var palavras = [];
  $http.get("/api/palavras").then(function (response) {
    palavras = response.data;
  });
  $scope.busca = "";
  $scope.palavrasFiltradas = [];
  $scope.estados = [
    "Extremamente Negativo",
    "Muito Negativo",
    "Moderadamente Negativo",
    "Levemente Negativo",
    "Neutro",
    "Levemente Positivo",
    "Moderadamente Positivo",
    "Muito Positivo",
    "Extremamente Positivo"
  ];

  $scope.loadGraph = function (palavra) {
    if (palavra.qtdVotos === 0) return;
    if ($('.btn-' + palavra.nome).text() === 'Esconder gráfico') {
      $('.btn-' + palavra.nome).text("Ver distribuição de classificações");
      $("." + palavra.nome).html("");
      $("." + palavra.nome).removeClass("ct-major-second");
      return;
    }
    $('.btn-' + palavra.nome).text("Esconder gráfico");
    $("." + palavra.nome).addClass("ct-major-second");
    $timeout(function () {
      new Chartist.Bar('.' + palavra.nome, {
        labels: [
          "Extremamente Negativo",
          "Muito Negativo",
          "Moderadamente Negativo",
          "Levemente Negativo",
          "Neutro",
          "Levemente Positivo",
          "Moderadamente Positivo",
          "Muito Positivo",
          "Extremamente Positivo"
        ],
        series: [
          [palavra.votos1, palavra.votos2, palavra.votos3, palavra.votos4, palavra.votos5, palavra.votos6, palavra.votos7,
            palavra.votos8, palavra.votos9
          ]
        ]
      }, {
        seriesBarDistance: 10,
        reverseData: true,
        horizontalBars: true,
        axisY: {
          offset: 90,
        },
        axisX: {
          onlyInteger: true,
          showGrid: false
        }
      });
    }, 100);
  };

  $scope.smileySrc = function (valor, votos) {
    if (votos === 0) return "../images/smiley5.png";
    return "../images/smiley" + Math.round(valor / votos) + ".png";
  };

  $scope.positividade = function (valor, votos) {
    if (votos === 0) return 0.5;
    return ((valor / votos) - 1) / 8;
  };

  $scope.sentimento = function (valor, votos) {
    if (votos > 0) {
      return $scope.estados[Math.round(valor / votos) - 1];
    } else {
      return $scope.estados[4];
    }
  };

  $scope.buscar = function () {
    if ($scope.busca.length === 0) {
      return;
    }
    $scope.palavrasFiltradas = palavras.filter(function (data) {
      return (data.nome.indexOf($scope.busca.toLowerCase()) > -1);
    });
    if ($scope.palavrasFiltradas.length === 0) {
      $scope.mostrarZeroResultados = true;
    } else {
      $scope.mostrarZeroResultados = false;
    }
  };

  function update() {
    $scope.output = $scope.estados[$scope.slider.value - 1];
  }

  $scope.output = "Extremamente Negativo";

  $scope.slider = {
    value: 1,
    options: {
      floor: 1,
      ceil: 9,
      showTicks: true,
      hideLimitLabels: true,
      hidePointerLabels: true,
      onChange: update
    }
  };

  $scope.like = function (palavra, like) {
    $http.post('/api/like', {
      palavra: palavra.id,
      like: like
    }).then((response) => {
      if (response.status === 200) {
        if (like > 0) {
          palavra.likePos++;
        } else {
          palavra.likeNeg++;
        }
      }
    });
  }

  $scope.liberar = function (palavra) {
    $scope.output = "Extremamente Negativo";
    $scope.slider.value = 1;
    if ($('div[class*="avaliar-' + palavra.nome + '"]').hasClass('hide')) {
      $('div[class*="avaliar"]').addClass('hide');
      $('div[class*="avaliar-' + palavra.nome + '"]').removeClass('hide');
    } else {
      $('div[class*="avaliar"]').addClass('hide');
    }
  };

  $scope.classificar = function (palavra) {
    var data = {
      palavraId: palavra.id,
      userId: $scope.user.id,
      valor: $scope.slider.value
    };
    $http.post("/api/voto", data)
      .then(function (response) {
        $('#pontos').prop('number', $scope.user.pontos);
        $scope.user = response.data.user;
        $scope.metaDiaria = response.data.meta;
        atualizarPalavra()
      });
  };

  function atualizarPalavra(id, value) {
    palavras.length = 0;
    $scope.palavrasFiltradas.length = 0;
    $http.get("/api/palavras").then(function (response) {
      palavras = response.data;
    });
  }
}]);

app.controller('RankingController', ["$scope", "$http", function ($scope, $http) {
  $scope.top10 = [];
  $scope.stats = {};
  $scope.pos = 0;

  if (!$scope.user.task_ranking) {
    $http.get("/api/taskRanking").
    then((response) => {
      $scope.user = response.data.user;
    });
  }

  $http.get("/api/ranking").then(function (response) {
    $scope.top10 = response.data.top;
    $scope.pos = response.data.pos;
  });

  $http.get("/api/estatistica").then(function (response) {
    $scope.stats = response.data;
    $scope.loadGraph();
  });

  $scope.loadGraph = function () {
    let totalPalavras = $scope.stats.palavras;
    let positivas = $scope.stats.palavrasPos;
    let negativas = $scope.stats.palavrasNeg;
    let data = {
      labels: ['Positivo (' + Number((positivas / totalPalavras) * 100).toFixed(2) + '%)',
        'Negativo (' + Number((negativas / totalPalavras) * 100).toFixed(2) + '%)',
        'Neutro (' + Number(((totalPalavras - positivas - negativas) / totalPalavras) * 100).toFixed(2) + '%)'
      ],
      series: [{
          value: $scope.stats.palavrasPos,
          className: 'pos-chart'
        },
        {
          value: $scope.stats.palavrasNeg,
          className: 'neg-chart'
        },
        {
          value: $scope.stats.palavras - ($scope.stats.palavrasPos + $scope.stats.palavrasNeg),
          className: 'neutro-chart'
        }
      ]
    };

    var sum = function (a, b) {
      return a + b;
    };

    var options = {
      chartPadding: 10,
      labelOffset: 20,
      plugins: [
        Chartist.plugins.legend({
          position: 'bottom'
        })
      ]
    };

    new Chartist.Pie('.graphPalavras', data, options);
  };
}]);

app.controller('PerfilController', ["$scope", "$http", "$route", function ($scope, $http, $route) {
  $scope.avatares = [{
      nome: 'Homem',
      pontos: 0
    },
    {
      nome: 'Mulher',
      pontos: 0
    },
    {
      nome: 'Professor',
      pontos: 50
    },
    {
      nome: 'Cachorro',
      pontos: 100
    },
    {
      nome: 'Gato',
      pontos: 100
    },
    {
      nome: 'Aristoteles',
      pontos: 400
    },
    {
      nome: 'Shakespeare',
      pontos: 600
    },
    {
      nome: 'Tim-maia',
      pontos: 800
    },
    {
      nome: 'Adele',
      pontos: 1000
    },
    {
      nome: 'Tarantino',
      pontos: 1200
    },
  ];
  $scope.avatarSelecionado = "";
  $scope.nome = $scope.user.nome;
  $scope.email = $scope.user.email;
  $scope.avatar = $scope.user.avatar;
  $scope.divInformacoes = true;
  $scope.divSeguranca = true;
  $scope.divAvatar = true;
  $scope.perfilResult = "";
  $scope.avatarResult = "";
  $scope.senhaResult = "";
  $scope.atualizarPerfil = function () {
    $scope.perfilResult = "";
    if (!$scope.nome.length || !$scope.email.length) {
      return;
    } else if ($scope.nome === $scope.user.nome && $scope.email === $scope.user.email) {
      return;
    }
    $http.post('/api/perfil', {
      nome: $scope.nome,
      email: $scope.email
    }).then(function (response) {
      $scope.user = response.data.user;
      $scope.perfilResult = response.data.status;
    });
  };
  $scope.trocarAvatar = function () {
    $scope.avatarResult = "";
    if (!$scope.avatarSelecionado) {
      return;
    } else if ($scope.avatarSelecionado.toLowerCase() === $scope.user.avatar) {
      return;
    }
    $http.post('/api/avatar', {
      avatar: $scope.avatarSelecionado.toLowerCase()
    }).then(function (response) {
      $scope.user = response.data.user;
      $scope.avatarResult = response.data.status;
      document.querySelector("#userAvatar").src = 'images/' + $scope.user.avatar + '.png';
    });
  };
  $scope.trocarSenha = function () {
    $scope.senhaResult = "";
    if ($scope.novaSenha !== $scope.confirmaNovaSenha) {
      $scope.senhaResult = "Erro! Validação da senha não confere."
      return;
    }
    $http.post('/api/atualizarSenha', {
      senhaAntiga: $scope.senhaAtual,
      senhaNova: $scope.novaSenha
    }).then((response) => {
      $scope.senhaResult = response.data.status;
    }, (err) => {
      console.log(err);
      $scope.senhaResult = err.data.status;
    });
  };
}]);

app.controller('AdminController', ["$scope", "$http", function ($scope, $http) {
  $scope.inserirPalavra = function () {
    var palavra = $scope.palavra.toLowerCase().split(' ', 1)[0];
    if (palavra.length === 0) return;
    $http.post('/api/palavra', {
      palavra: palavra
    }).then(function (response) {
      $scope.palavra = "";
    }, function (err) {
      $scope.palavra = "erro";
    });
  };

  $scope.palavrasSugeridas = [];

  $http.get('/api/palavrasSugeridas')
    .then((response) => {
      console.log(response);
      $scope.palavrasSugeridas = response.data.palavras;
    }, (err) => {

    });

  $scope.aceitarPalavra = function (palavra) {
    console.log(palavra);
    $http.post('/api/aceitarPalavra', {
      palavra: palavra
    });
    let index = $scope.palavrasSugeridas.indexOf(palavra);
    $scope.palavrasSugeridas.splice(index, 1);
  };

  $scope.recusarPalavra = function (palavra) {
    console.log(palavra);
    $http.post('/api/recusarPalavra', {
      palavra: palavra
    });
    let index = $scope.palavrasSugeridas.indexOf(palavra);
    $scope.palavrasSugeridas.splice(index, 1);
  };
}]);

app.controller('AdministrarController', ["$scope", "$http", function ($scope, $http) {

  $scope.palavrasSugeridas = [];
  $scope.lider = false;

  $http.get('/api/lider')
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
        $scope.lider = response.data.lider;
      }
    });

  $http.get('/api/palavrasSugeridas')
    .then((response) => {
      $scope.palavrasSugeridas = response.data.palavras;
    }, (err) => {

    });

  $scope.aceitarPalavra = function (palavra) {
    console.log(palavra);
    $http.post('/api/aceitarPalavra', {
      palavra: palavra
    });
    let index = $scope.palavrasSugeridas.indexOf(palavra);
    $scope.palavrasSugeridas.splice(index, 1);
  };

  $scope.recusarPalavra = function (palavra) {
    console.log(palavra);
    $http.post('/api/recusarPalavra', {
      palavra: palavra
    });
    let index = $scope.palavrasSugeridas.indexOf(palavra);
    $scope.palavrasSugeridas.splice(index, 1);
  };
}]);

app.controller('LogoutController', ["$scope", 'AuthService', function ($scope, AuthService) {}]);

app.controller('ConquistasController', ["$scope", '$http', function ($scope, $http) {
  let debounce = true;
  let preco = 500;

  function loadUserCards() {
    $http.get('/api/userCards')
      .then((response) => {
        console.log(response);
        $scope.cards = response.data.cards;
        $http.get('/api/cards')
          .then((response) => {
            $scope.items = response.data.cards
            $scope.items.length -= $scope.cards.length;
            $scope.cardsAvailable = Math.floor($scope.user.pontos / preco) + 1 - $scope.cards.length;
            $scope.pointsToNextCard = preco - ($scope.user.pontos % preco);
            debounce = true;
          });
      });
  }

  $scope.cards = [];
  $scope.items = [];
  $scope.modal = {};
  $scope.cardsAvailable = 0;
  $scope.pointsToNextCard = 0;
  loadUserCards();

  $scope.newCard = function () {
    if (debounce) {
      debounce = false;
      let cardsUsed = $scope.cards.length;
      if ($scope.user.pontos > cardsUsed * preco) {
        $http.get('/api/newCard')
          .then((response) => {
            if (response.data.user) {
              $scope.user = response.data.user;
            }
            setTimeout(loadUserCards, 300);
          });
      }
    }

  };
  $scope.loadModal = function (title, image, description) {
    $scope.modal.descricao = description;
    $scope.modal.imagem = image;
    $scope.modal.titulo = title;
    showModal();
  };
}]);

//#####################################################

app.directive('dadosJogador', function () {
  return {
    restrict: 'E',
    templateUrl: './directives/dadosJogador.html'
  };
});

//#####################################################

app.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);

//#####################################################

app.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {
  let user = null;
  let userObject = null;
  let metaObject = null;

  function isLoggedIn() {
    if (user) {
      return true;
    }
    return false;
  }

  function getUserStatus() {
    var deferred = $q.defer();
    $http.get("/api/user")
      .then(function (response) {
        if (response.data.logado) {
          user = true;
          userObject = response.data.user;
          $http.get("/api/metaDiaria").then(function (response) {
            metaObject = response.data[0];
            deferred.resolve();
          });
        } else {
          user = false;
          deferred.resolve();
        }
      }, function (error) {
        user = false;
        deferred.reject();
      });

    return deferred.promise;
  }

  function login(email, senha) {
    var deferred = $q.defer();

    $http.post("/api/login", {
      email: email,
      senha: senha
    }).then(function (response) {
      if (response.data.user) {
        user = true;
        deferred.resolve();
      } else {
        user = false;
        deferred.reject();
      }
    }, function (error) {
      user = false;
      deferred.reject();
    });

    return deferred.promise;
  }

  function register(nome, email, senha) {
    var deferred = $q.defer();

    $http.post("/api/cadastro", {
      email: email,
      senha: senha,
      nome: nome
    }).then(function (response) {
      if (response.data.user) {
        user = true;
        deferred.resolve();
      } else {
        user = false;
        deferred.reject();
      }
    }, function (error) {
      deferred.reject();
    });

    return deferred.promise;
  }

  function logout() {
    var deferred = $q.defer();

    $http.get("/api/logout")
      .then(function (data) {
        user = false;
        deferred.resolve();
      }, function (error) {
        user = false;
        deferred.reject();
      });

    return deferred.promise;
  }

  function getUser() {
    return userObject;
  }

  function getMeta() {
    return metaObject;
  }

  return ({
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register,
    getUser: getUser,
    getMeta: getMeta
  });
}]);

//#################

$('.settings').click(function () {
  $('.dropdown').toggleClass('show');
})

$(document).on('click', function (e) {
  if (e.target.id !== 'userAvatar')
    $('.dropdown').removeClass('show');
});

$(window).on('load', function () {
  switch (window.location.pathname) {
  case '/estatisticas':
    $('.menu-estatistica').toggleClass('ativo');
    break;
  }
});
