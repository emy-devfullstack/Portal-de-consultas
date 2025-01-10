const url = 'https://cors-anywhere.herokuapp.com/https://www.receitaws.com.br/v1/cnpj/00275369000107';

function loadCnpjData() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                displayCnpjData(data);
            } else {
                document.getElementById('status').textContent = 'Erro ao carregar dados.';
                document.getElementById('status').classList.add('error');
            }
        })
        .catch(error => {
            document.getElementById('status').textContent = 'Erro de conexão.';
            document.getElementById('status').classList.add('error');
            console.error('Erro:', error);
        });
}

function displayCnpjData(data) {
    const container = document.getElementById('infoContainer');

    container.innerHTML = `
        <div class="section-title">Informações da Empresa</div>
        <div><strong>Nome:</strong> ${data.nome}</div>
        <div><strong>Nome Fantasia:</strong> ${data.fantasia}</div>
        <div><strong>CNPJ:</strong> ${data.cnpj}</div>
        <div><strong>Tipo:</strong> ${data.tipo}</div>
        <div><strong>Porte:</strong> ${data.porte}</div>
        <div><strong>Natureza Jurídica:</strong> ${data.natureza_juridica}</div>
        <div><strong>Atividade Principal:</strong> ${data.atividade_principal[0].text}</div>
        <div><strong>Atividade Secundária:</strong> ${data.atividades_secundarias[0].text}</div>
        <div><strong>Capital Social:</strong> R$ ${data.capital_social}</div>
        <div><strong>Abertura:</strong> ${data.abertura}</div>
        <div><strong>Situação:</strong> ${data.situacao}</div>
        <div><strong>Data da Situação:</strong> ${data.data_situacao}</div>
        <div><strong>Motivo da Situação:</strong> ${data.motivo_situacao}</div>
        <div><strong>Logradouro:</strong> ${data.logradouro}, ${data.numero}</div>
        <div><strong>Bairro:</strong> ${data.bairro}</div>
        <div><strong>Município:</strong> ${data.municipio}</div>
        <div><strong>UF:</strong> ${data.uf}</div>
        <div><strong>CEP:</strong> ${data.cep}</div>
        <div><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></div>
        <div><strong>Telefone:</strong> ${data.telefone}</div>
    `;

    container.innerHTML += `
        <div><strong>Simples Nacional:</strong> ${data.simples.optante ? 'Sim' : 'Não'}</div>
        <div><strong>Simei:</strong> ${data.simei.optante ? 'Sim' : 'Não'}</div>
    `;

    const statusElement = document.getElementById('status');
    statusElement.textContent = 'Dados carregados com sucesso!';
    statusElement.classList.add('ok');
}

loadCnpjData();
