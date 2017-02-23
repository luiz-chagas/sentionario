//function getRandomWord(){
//    var words = [];
//    $.getJSON("http://localhost:8080/api/palavra", function(data){
//        $.each(data, function(key, val){
//            words.push(val.nome);
//        });
//        var i = Math.random() * words.length;
//        i = Math.floor(i);
//        return words[i];
//    });
//}

// $(document).ready(function(){
//     $("#busca").autoComplete({
//         minChars: 1,
//         source: function(term, suggest){
//             term = term.toLowerCase();
//             var choices = getWords();
//             var matches = [];
//             for (i=0; i<choices.length; i++)
//                 if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
//             suggest(matches);
//         }
//     });
// });

function buscar() {
  var resultado = $(".resultadoBusca");
  if (resultado.hasClass("hide")) {
    resultado.removeClass("hide");
  } else {
    resultado.addClass("hide");
    setTimeout(buscar, 50);
  }
}

function myFunction() {
  $("#navMobile").toggleClass('hide');
}

function loginDiv(name) {
  $("#login").addClass('hide');
  $('#cadastro').addClass('hide')
  $(name).removeClass('hide');
}

//function envia(){
//    var self = this;
//    $("#palavra").text("Carregando...");
//    $("#palavra").addClass("disabled");
//    $("#enviar").addClass("disabled");
//    setTimeout(function(){
//        $("#enviar").removeClass("disabled");
//        $("#palavra").removeClass("disabled");
//        $("#palavra").text(self.getRandomWord());
//        $('input[type="range"]').val(5).change();
//    }, 500);
//
//
//}

//function getWords(){
//    var palavras = [];
//    $.getJSON("http://localhost:8080/api/palavra", function(data){
//        $.each(data, function(key, val){
//            palavras.push(val.nome);
//        });
//        console.log(palavras);
//        return palavras;
//    });
//}
