// Iniciando app

var app = angular.module('sentionario', ['rzModule', 'ngRoute']);

// Middleware

app.run(function($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    AuthService.getUserStatus()
      .then(function(event, next, current) {
        if (!AuthService.isLoggedIn()) {
          $rootScope.logado = false;
        } else {
          $rootScope.logado = true;
          $rootScope.user = AuthService.getUser();
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
      controller: 'ColaborarController'
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
      controller: 'PerfilController'
    })
    .when('/ranking', {
      templateUrl: './partials/ranking.html',
      controller: 'RankingController'
    })
    .when('/logout', {
      controller: 'LogoutController',
      access: {
        restricted: true
      }
    });

  $locationProvider.html5Mode(true);
});

app.controller('HomeController', ["$scope", "$location", "AuthService", "$route", function($scope, $location, AuthService, $route) {

  $scope.deslogar = function() {
    AuthService.logout()
      .then(function() {
        $location.path('/');
        $route.reload();
      });
  }

  $scope.logar = function() {
    $scope.error = false;
    $scope.disabled = true;

    AuthService.login($scope.email, $scope.senha)
      .then(function() {
        $scope.disabled = false;
        $route.reload();
      })
      .catch(function() {
        $scope.error = true;
        $scope.errorMessage = "Usuario ou senha invalidos";
        $scope.disabled = false;
      })
  }

  $scope.registrar = function() {
    if ($scope.senha != $scope.confirmaSenha)
      return;

    $scope.error = false;
    $scope.disabled = true;

    AuthService.register($scope.nome, $scope.email, $scope.senha)
      .then(function() {
        $scope.disabled = false;
        $route.reload();
      })
      .catch(function() {
        $scope.error = true;
        $scope.disabled = false;
      })
  }
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
    id: 0,
    nome: ''
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
        $timeout(function() {
          $route.reload();
        }, 500);
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
  $scope.disabled = false;
  $scope.output = $scope.estados[$scope.slider.value - 1];
  $scope.smiley = "../images/smiley" + $scope.slider.value + ".png";
  setPalavra = function() {
    var i = Math.random() * palavras.length;
    i = Math.floor(i);
    $scope.palavra = palavras[i];
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
    $timeout(function() {
      new Chartist.Bar('.' + palavra.nome, {
        labels: [
          "Ext. Negativo",
          "Muito Negativo",
          "Mod. Negativo",
          "Lev. Negativo",
          "Neutro",
          "Lev. Positivo",
          "Mod. Positivo",
          "Muito Positivo",
          "Ext. Positivo"
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
          offset: 70,
        },
        axisX: {
          onlyInteger: true,
          showGrid: false
        }
      });
    }, 800);
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
      return (data.nome.startsWith($scope.busca));
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
  });
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

  function login(senha, email) {
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
