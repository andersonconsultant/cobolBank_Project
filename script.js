document.getElementById('botao-click').addEventListener('click', function() {
    alert('Você clicou no botão!');
  });

const initCobol = document.getElementById('buttonStartCobol');

initCobol.addEventListener('click', () => {
  fetch('/api/cobol')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
});