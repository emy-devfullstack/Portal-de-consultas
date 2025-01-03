document.getElementById('cnpjForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const cnpjs = document.getElementById('cnpjs').value
        .split(',')
        .map(c => c.trim());

    const response = await fetch('/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpjs })
    });

    const data = await response.json();

    document.getElementById('result').innerHTML = data.message;
});
