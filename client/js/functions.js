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

function showModal() {
  // Get the modal
  var modal = document.getElementById('modal');

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function buscar() {
  var resultado = $(".resultadoBusca");
  if (resultado.hasClass("hide")) {
    resultado.removeClass("hide");
  } else {
    resultado.addClass("hide");
    setTimeout(buscar, 100);
  }
}

function myFunction() {
  $("#navMobile").toggleClass('hide');
}

function loginDiv(name) {
  $('.ativoBranco').removeClass('ativoBranco');

  $(this).addClass('ativoBranco');
}

function loginMenu() {
  $('#menuCadastro').removeClass('ativoBranco');
  $('#menuLogin').addClass('ativoBranco');
  $('#cadastro').addClass('hide');
  $('#login').removeClass('hide');
}

function cadastroMenu() {
  $('#menuLogin').removeClass('ativoBranco');
  $('#menuCadastro').addClass('ativoBranco');
  $('#login').addClass('hide');
  $('#cadastro').removeClass('hide');
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
