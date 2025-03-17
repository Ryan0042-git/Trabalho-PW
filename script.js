// Função do botão de Login
function acionarBotaoLogin() {
    var textoNome = document.getElementById('txtNome').value;
    var textoEndereço = document.getElementById('txtEndereco').value;
  
    if(textoNome == "") {
      alert("Preencha o campo Nome!!!");  
    } else if(textoEndereço == "") {
      alert("Digite seu endereço!!!");
    } else {
      if(textoEmail == "senac@gmail.com" && textoSenha == "senac2025") {
        window.location.href = 'index.html'; // Redireciona para a página de teste
      } else {
        alert("Nome ou endereço incorreto!!");
      }
    }
  }
  
  // Função do botão de Cadastro
  function acionarBotaoCadastro() {
    var textoNome = document.getElementById('txtNome').value;
    var textoEmail = document.getElementById('txtEmail').value;
    var textoMensagem = document.getElementById('txtMensagem').value;
  
    if(textoNome == "") {
      alert("Preencha o campo nome!!!");
    } else if(textoEmail == "") {
      alert("Preencha o campo email");
    } else if(textoMensagem == "") {
      alert("Digite a mensagem");
    } else {
      if(textoMensagem == "pizza" && textoNome == "Ryan") {
        window.location.href = 'login.html'; // Redireciona para a página de teste
      } else {
        alert("Infelizmente não foi possivel efetuar o cadastro");
        return;
      }
    }
  }
  