var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);
var Card = require('./card.js');

Card.create({
  nome: "Beethoven",
  descricao: "É considerado um dos pilares da música ocidental, pelo incontestável desenvolvimento, tanto da linguagem como do conteúdo musical demonstrado nas suas obras, permanecendo como um dos compositores mais respeitados e mais influentes de todos os tempos.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/220px-Beethoven.jpg"
});

Card.create({
  nome: "Freud",
  descricao: "Sigmund Freud foi um neurologista austríaco e fundador da psicanálise, um método clínico para o tratamento da psicopatologia através do diálogo entre um paciente e um psicanalista.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Sigmund_Freud_LIFE.jpg/200px-Sigmund_Freud_LIFE.jpg"
});

Card.create({
  nome: "Tiradentes",
  descricao: "Foi um dentista, tropeiro, minerador, comerciante, militar e ativista político que atuou no Brasil, mais especificamente nas capitanias de Minas Gerais e Rio de Janeiro.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Figueiredo-MHN-Tiradentes.jpg/240px-Figueiredo-MHN-Tiradentes.jpg"
});

Card.create({
  nome: "Fidel",
  descricao: "Fidel Castro foi um político e revolucionário cubano que governou a República de Cuba como primeiro-ministro de 1959 a 1976 e depois como presidente de 1976 a 2008",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Fidel_Castro_-_MATS_Terminal_Washington_1959.jpg/280px-Fidel_Castro_-_MATS_Terminal_Washington_1959.jpg"
});

Card.create({
  nome: "Aristóteles",
  descricao: "Foi um filósofo grego, aluno de Platão e professor de Alexandre, o Grande. Seus escritos abrangem diversos assuntos, como a física, a metafísica, as leis da poesia e do drama, a música, a lógica, a retórica, o governo, a ética, a biologia e a zoologia.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Aristotle_Altemps_Detail.jpg/200px-Aristotle_Altemps_Detail.jpg"
});

Card.create({
  nome: "Anne",
  descricao: "Anne Frank foi uma adolescente alemã de origem judaica, vítima do Holocausto. Ela se tornou uma das figuras mais discutíveis do século XX após a publicação do Diário de Anne Frank (1947), que tem sido a base para várias peças de teatro e filmes.",
  imagem: "https://upload.wikimedia.org/wikipedia/pt/thumb/1/1b/Anne-Frank_lightbox.jpg/220px-Anne-Frank_lightbox.jpg"
});

Card.create({
  nome: "Stephen",
  descricao: "Stephen Hawking é um físico teórico e cosmólogo britânico e um dos mais consagrados cientistas da atualidade. Doutor em cosmologia, foi professor lucasiano de matemática na Universidade de Cambridge.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/200px-Stephen_Hawking.StarChild.jpg"
});

Card.create({
  nome: "Bowie",
  descricao: "David Bowie foi um cantor, compositor, ator e produtor musical inglês. É considerado um dos músicos populares mais inovadores e ainda influentes de todos os tempos, sobretudo por seu trabalho nas décadas de 1970 e 1980.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Bowie-DD-1974-3.jpg/170px-Bowie-DD-1974-3.jpg"
});

Card.create({
  nome: "Michael",
  descricao: "Michale Jackson foi um famoso cantor, compositor, dançarino, produtor, empresário, arranjador vocal, filantropo, pacifista e ativista estadunidense. Segundo a revista Rolling Stone faturou em vida cerca de sete bilhões de dólares.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Michael_Jackson_in_1988.jpg/220px-Michael_Jackson_in_1988.jpg"
});

Card.create({
  nome: "Steve",
  descricao: "Steve Jobs foi um inventor, empresário e magnata americano no setor da informática. Notabilizou-se como co-fundador, presidente e diretor executivo da Apple Inc.",
  imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Steve_Jobs_Headshot_2010-CROP2.jpg/200px-Steve_Jobs_Headshot_2010-CROP2.jpg"
});
