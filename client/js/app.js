// Iniciando app

var app = angular.module('sentionario', ['rzModule', 'ngRoute']);

// Middleware

app.run(function($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    AuthService.getUserStatus()
      .then(function() {
        if (!AuthService.isLoggedIn()) {
          $rootScope.logado = false;
        } else {
          $rootScope.logado = true;
          $rootScope.user = AuthService.getUser();
        }
      }).then(function() {
        if (next.restricted && !$rootScope.logado) {
          $location.path('/');
        } else if (next.admin && !$rootScope.user.admin) {
          $location.path('/');
        }
      });
  });
});

// Configurando rotas

app.config(function($routeProvider, $locationProvider) {
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
    .when('/logout', {
      controller: 'LogoutController',
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

app.controller('HomeController', ["$scope", "$location", "AuthService", "$route", "$http", function($scope, $location, AuthService, $route, $http) {

  $scope.deslogar = function() {
    AuthService.logout()
      .then(function() {
        $location.path('/');
        $route.reload();
      });
  };

  $scope.metaDiaria = {
    votos: 0
  };

  if (typeof($scope.user) !== 'undefined') {
    $scope.metaAvatar = ($scope.user.avatar === 'anonymous');

    $http.get("/api/metaDiaria").then(function(response) {
      $scope.metaDiaria = response.data[0];
      $('#myBar').css("width", ($scope.meta.votos * 5) + "%");
    });
  }

  AuthService.getUserStatus().then(function() {
    if (AuthService.isLoggedIn()) {
      $scope.sugerir = AuthService.getUser().pontos > 499 ? true : false;
    } else {
      $scope.sugerir = false;
    }
  });

  $scope.reset = function() {
    $scope.erro = "";
  };

  $scope.logar = function() {
    $scope.erro = "";
    if ($scope.email === null) {
      $scope.erro = "Preencha email corretamente";
      return;
    }
    AuthService.login($scope.email, $scope.senha)
      .then(function(response) {
        $route.reload();
      }, function(error) {
        $scope.erro = "Usuario ou senha invalidos";
      });
  };

  $scope.registrar = function() {
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
      .then(function() {
        AuthService.login($scope.email, $scope.senha)
          .then(function() {
            $route.reload();
          });
      })
      .catch(function() {
        $scope.erro = "Erro ao cadastrar no sistema";
      });
  };
}]);


app.controller('ColaborarController', ["$scope", "$http", "$timeout", "AuthService", "$route", function($scope, $http, $timeout, AuthService, $route) {
  var palavras = [];
  $http.get("/api/palavras").then(function(response) {
    palavras = response.data;
    setPalavra();
  });
  update = function() {
    $scope.output = $scope.estados[$scope.slider.value - 1];
    $scope.smiley = "../images/smiley" + $scope.slider.value + ".png";
  };
  $scope.palavra = {
    nome: 'Carregando...'
  };
  $scope.envia = function() {
    $scope.disabled = true;
    var data = JSON.stringify({
      palavraId: $scope.palavra.id,
      userId: AuthService.getUser().id,
      valor: $scope.slider.value
    });
    $scope.palavra.nome = "Carregando...";
    $http.post("/api/voto", data)
      .then(function() {
        $route.reload();
      });
  }
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
  setPalavra = function() {
    var i = Math.random() * palavras.length;
    i = Math.floor(i);
    $scope.palavra.nome = palavras[i].nome;
    $scope.palavra.id = palavras[i].id;
    $scope.disabled = false;
  };
}]);

app.controller('ConsultarController', ["$scope", "$http", "$timeout", function($scope, $http, $timeout) {

  var palavras = [];
  $http.get("/api/palavras").then(function(response) {
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

  $scope.loadGraph = function(palavra) {
    if (palavra.qtdVotos == 0) return;
    $("." + palavra.nome).html("");
    $("." + palavra.nome).addClass("ct-major-second");
    $timeout(function() {
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
  }

  $scope.smileySrc = function(valor, votos) {
    if (votos == 0) return "../images/smiley5.png";
    return "../images/smiley" + Math.round(valor / votos) + ".png";
  };

  $scope.positividade = function(valor, votos) {
    if (votos == 0) return 0.5;
    return ((valor / votos) - 1) / 8;
  }

  $scope.sentimento = function(valor, votos) {
    if (votos > 0) {
      return $scope.estados[Math.round(valor / votos) - 1];
    } else {
      return $scope.estados[4];
    }
  }

  $scope.buscar = function() {
    $scope.palavrasFiltradas = palavras.filter(function(data) {
      return (data.nome.indexOf($scope.busca.toLowerCase()) > -1);
    });
  }
}]);

app.controller('RankingController', ["$scope", "$http", function($scope, $http) {
  $scope.top10 = [];
  $scope.stats = {};

  $http.get("/api/ranking").then(function(response) {
    $scope.top10 = response.data;
  });

  $http.get("/api/estatistica").then(function(response) {
    $scope.stats = response.data.stats;
    $scope.loadGraph();
  });

  $scope.loadGraph = function() {
    var data = {
      labels: ['Positivo', 'Negativo', 'Neutro'],
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

    var sum = function(a, b) {
      return a + b
    };

    var options = {
      chartPadding: 20,
      labelOffset: 50
    };

    new Chartist.Pie('.graphPalavras', data, options);
  }
}]);

app.controller('PerfilController', ["$scope", "$http", "$route", function($scope, $http, $route) {
  $scope.nome = $scope.user.nome;
  $scope.email = $scope.user.email;
  $scope.avatar = $scope.user.avatar;
  $scope.divInformacoes = true;
  $scope.divSeguranca = true;
  $scope.divAvatar = true;
  $scope.perfilResult = "";
  $scope.avatarResult = "";
  $scope.atualizarPerfil = function() {
    $scope.perfilResult = "";
    if (!$scope.nome.length || !$scope.email.length) {
      return;
    } else if ($scope.nome === $scope.user.nome && $scope.email === $scope.user.email) {
      return;
    }
    $http.post('/api/perfil', {
      nome: $scope.nome,
      email: $scope.email
    }).then(function(response) {
      $scope.user = response.data.user;
      $scope.perfilResult = response.data.status;
    });
  };
  $scope.trocarAvatar = function() {
    $scope.avatarResult = "";
    if (!$scope.avatarSelecionado.length) {
      return;
    } else if ($scope.avatarSelecionado === $scope.user.avatar) {
      return;
    }
    $http.post('/api/avatar', {
      avatar: $scope.avatarSelecionado
    }).then(function(response) {
      $scope.user = response.data.user;
      $scope.avatarResult = response.data.status;
    });
  };
}]);

app.controller('AdminController', ["$scope", "$http", function($scope, $http) {
  $scope.inserirPalavra = function() {
    var palavra = $scope.palavra.toLowerCase().split(' ', 1)[0];
    if (palavra.length == 0) return;
    $http.post('/api/palavra', {
      palavra: palavra
    }).then(function(response) {
      $scope.palavra = "";
    }, function(err) {
      $scope.palavra = "erro";
    });
  }
}]);

//#####################################################

app.directive('dadosJogador', function() {
  return {
    restrict: 'E',
    templateUrl: './directives/dadosJogador.html'
  };
});

//#####################################################

app.filter('percentage', ['$filter', function($filter) {
  return function(input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);

//#####################################################

app.factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
  var user = null;
  var userObject = null;

  function isLoggedIn() {
    if (user) {
      return true;
    }
    return false;
  }

  function getUserStatus() {
    return $http.get("/api/user")
      .then(function(response) {
        if (response.data.logado) {
          user = true;
          userObject = response.data.user;
        } else {
          user = false;
        }
      }, function(error) {
        user = false;
      });
  }

  function login(email, senha) {
    var deferred = $q.defer();

    $http.post("/api/login", {
      email: email,
      senha: senha
    }).then(function(response) {
      if (response.data.user) {
        user = true;
        deferred.resolve();
      } else {
        user = false;
        deferred.reject();
      }
    }, function(error) {
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
    }).then(function(response) {
      if (response.data.user) {
        user = true;
        deferred.resolve();
      } else {
        user = false;
        deferred.reject();
      }
    }, function(error) {
      deferred.reject();
    });

    return deferred.promise;
  }

  function logout() {
    var deferred = $q.defer();

    $http.get("/api/logout")
      .then(function(data) {
        user = false;
        deferred.resolve();
      }, function(error) {
        user = false;
        deferred.reject();
      });

    return deferred.promise;
  }

  function getUser() {
    return userObject;
  }

  return ({
    isLoggedIn: isLoggedIn,
    getUserStatus: getUserStatus,
    login: login,
    logout: logout,
    register: register,
    getUser: getUser
  });
}]);
