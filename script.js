import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "SUA_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🎬 INICIAR
window.iniciar = () => {
  document.querySelector(".start").style.display="none";
  let video = document.getElementById("bgVideo");
  video.muted = false;
  video.play();
};

// FORM
window.abrirForm = () => {
  document.getElementById("form").style.display="block";
};

// ENVIAR
window.enviar = async () => {
  let nome = document.getElementById("nome").value;
  let adultos = document.getElementById("adultos").value;
  let criancas = document.getElementById("criancas").value;

  await addDoc(collection(db, "convidados"), {
    nome,
    adultos,
    criancas,
    data: new Date()
  });

  let texto = `Confirmado! 🎉
Nome: ${nome}
Adultos: ${adultos}
Crianças: ${criancas}`;

  window.open(`https://wa.me/55SEUNUMERO?text=${encodeURIComponent(texto)}`);
};

// 🔐 LOGIN
window.loginAdmin = () => {
  let senha = prompt("Senha:");

  if(senha === "1234"){
    carregar();
  }else{
    alert("Errado!");
  }
};

// 📊 CARREGAR
async function carregar(){
  let lista = await getDocs(collection(db, "convidados"));

  let div = document.getElementById("lista");
  div.style.display="block";
  div.innerHTML="<h3>Confirmados</h3>";

  let totalA=0,totalC=0;
  let dados=[];

  lista.forEach(doc=>{
    let d = doc.data();
    totalA += Number(d.adultos);
    totalC += Number(d.criancas);
    dados.push(d);

    div.innerHTML += `<p>${d.nome} - ${d.adultos}A / ${d.criancas}C</p>`;
  });

  div.innerHTML += `
  <hr>
  Adultos: ${totalA}<br>
  Crianças: ${totalC}
  <br><br>
  <button onclick="exportar()">📥 Excel</button>
  <canvas id="grafico"></canvas>
  `;

  window.listaGlobal = dados;
  grafico(totalA,totalC);
}

// 📥 EXPORTAR
window.exportar = () => {
  let csv="Nome,Adultos,Crianças\n";

  window.listaGlobal.forEach(d=>{
    csv+=`${d.nome},${d.adultos},${d.criancas}\n`;
  });

  let blob=new Blob([csv]);
  let link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download="lista.csv";
  link.click();
};

// 📊 GRAFICO
function grafico(a,c){
  new Chart(document.getElementById("grafico"),{
    type:'pie',
    data:{
      labels:['Adultos','Crianças'],
      datasets:[{
        data:[a,c],
        backgroundColor:['#ff4ecd','#00e0ff']
      }]
    }
  });
}