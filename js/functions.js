function getRandomWord(){
    var words = getWords();
    var i = Math.random() * words.length;
    i = Math.floor(i);
    return words[i];
}

$(document).ready(function(){
    $("#busca").autoComplete({
        minChars: 1,
        source: function(term, suggest){
            term = term.toLowerCase();
            var choices = getWords();
            var matches = [];
            for (i=0; i<choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
            suggest(matches);
        }
    });
});

function buscar(){
    var resultado = $(".resultadoBusca");
    if(resultado.hasClass("w3-hide")){
        resultado.removeClass("w3-hide");
    }else{
        resultado.addClass("w3-hide");
        setTimeout(buscar, 50);
    }
}

function myFunction() {
    var x = $("#navDemo");
    if(x.hasClass("w3-show"))
        x.removeClass("w3-show");
    else
        x.addClass("w3-show");
}

function loginDiv(name){
    $("#login").addClass("w3-hide");
    $("#cadastro").addClass("w3-hide");
    $(name).removeClass("w3-hide");
}

function envia(){
    var self = this;
    $("#palavra").text("Carregando...");
    $("#palavra").addClass("w3-disabled");
    $("#enviar").addClass("w3-disabled");
    setTimeout(function(){
        $("#enviar").removeClass("w3-disabled");
        $("#palavra").removeClass("w3-disabled");
        $("#palavra").text(self.getRandomWord());
        $('input[type="range"]').val(5).change();
    }, 500);
    
    
}

$(function() {
    var $element = $('input[type="range"]');
    var $output = $('output');
    
    var estados = [
        "Extremamente Negativo",
        "Muito Negativo",
        "Moderadamente Negativo",
        "Levemente Negativo",
        "Neutro",
        "Levemente Positivo",
        "Moderadamente Positivo",
        "Muito Positivo",
        "Extremamente Positivo"
    ]
    
    function updateOutput(el, val) {
        el.value = estados[val-1];
        $('#smileyFace').attr("src","images/smiley"+(val)+".png");
    }
    
    $element
      .rangeslider({
        polyfill: false,
        onInit: function() {
          updateOutput($output[0], this.value);
        }
      })
      .on('input', function() {
        updateOutput($output[0], this.value);
      });
});

function getWords(){
    return [
"Afectuoso",
"Ágil",
"Agradable",
"Amable",
"Ambicioso",
"Apasionado",
"Ardiente",
"Atento",
"Atrevido",
"Aventurero",
"Avispado",
"Basto",
"Bueno",
"Bello",
"Bonito",
"Brillante",
"Cauto",
"Celoso",
"Coherente",
"Considerado",
"Cordial",
"Cuidadoso",
"Curioso",
"De buen trato",
"Desconfiado",
"Diligente",
"Diplomático",
"Directo",
"Discreto",
"Divertido",
"Dulce",
"Educado",
"Eficiente",
"Elegante",
"Emprendedor",
"Encantador",
"Energetico",
"Entusiasmado",
"Equilibrado",
"Excentrico",
"Exigente",
"Experimentado",
"Estudioso",
"Extrovertido",
"Fervoroso",
"Fiable",
"Formal",
"Generoso",
"Gracioso",
"Habil",
"Hermoso",
"Imaginativo",
"Impaciente",
"Impetuoso",
"Impulsivo",
"Independiente",
"Inquieto",
"Insensible",
"Inteligente",
"Interesante",
"Intrepido",
"Jugueton",
"Listo",
"Leal",
"Locuaz",
"Lindo",
"Maduro",
"Meticuloso",
"Modesto",
"Mordaz",
"Noble",
"Notorio",
"Natural",
"Orgulloso",
"Paciente",
"Pacifico",
"Pasional",
"Pensativo",
"Perseverante",
"Picaro",
"Poderoso",
"Positivo",
"Práctico",
"Pretencioso",
"Provocador",
"Prudente",
"Puntual",
"Quisquilloso",
"Reacio",
"Realista",
"Receloso",
"Reservado",
"Responsable",
"Sagaz",
"Seguro",
"Sensato",
"Sensible",
"Sereno",
"Serio",
"Servicial",
"Simpático",
"Sincero",
"Sofisticado",
"Taciturno",
"Talentoso",
"Timido",
"Tranquilizador",
"Tranquilo",
"Travieso",
"Valiente",
"Util",
"Unico",
"Vivaz",
"Zarpado",
"WhiskyAdicto"
];
}