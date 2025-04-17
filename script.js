
function acionarBotaoLogin() {
    var textoNome = document.getElementById('txtNome').value;
    var textoEndereço = document.getElementById('txtEndereco').value;
  
    if(textoNome == "") {
      alert("Preencha o campo Nome!!!");  
    } else if(textoEndereço == "") {
      alert("Digite seu endereço!!!");
    } else {
      if(textoNome == "Ryan" && textoEndereço == "rua fajao 97") {
        window.location.href = 'index.html';
      } else {
        alert("Nome ou endereço incorreto!!");
      }
    }
  }
  
  function acionarBotaoCadastro() {
    var textoNome = document.getElementById('txtNome').value;
    var textoEmail = document.getElementById('txtEmail').value;

    if(textoNome == "") {
      alert("Preencha o campo nome!!!");
    } else if(textoEmail == "") {
      alert("Preencha o campo email");
    } else {
      if(textoNome == "Ryan") {
        window.location.href = 'login.html'; 
      } else {
        alert("Infelizmente não foi possivel efetuar o cadastro");
        return;
      }
    }
  }
  
  async function rastrearPedido() {
    const numero = document.getElementById('numeroPedido').value;
    const resultado = document.getElementById('resultadoRastreamento');

    if (!numero) {
      alert("Digite o número do pedido!");
      return;
    }

    resultado.innerText = "Consultando pedido...";

    async function rastrearPedido() {
      const numero = document.getElementById('numeroPedido').value;
      const resultado = document.getElementById('resultadoRastreamento');
    
      if (!numero) {
        alert("Digite o número do pedido!");
        return;
      }
    
      resultado.innerText = "Consultando pedido...";
    
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      const pedidosFake = {
        "123": { status: "Pedido em separação" },
        "456": { status: "Pedido em transporte" },
        "789": { status: "Entregue" },
        "321": { status: "Cancelado" }
      };
    
      const dados = pedidosFake[numero];
    
      if (dados && dados.status) {
        resultado.innerText = `Status do Pedido #${numero}: ${dados.status}`;
      } else {
        resultado.innerText = "Pedido não encontrado.";
      }
    
    }
  }