from flask import Flask, request, jsonify, send_file
import asyncio
import aiohttp
import pandas as pd
import os
from pathlib import Path

app = Flask(__name__)

# Funções da automação
async def consultar_cnpj(session, cnpj):
    url = f"https://www.receitaws.com.br/v1/cnpj/{cnpj.replace('.', '').replace('/', '').replace('-', '')}"
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            data = await response.json()
            if "status" in data and data["status"] == "ERROR":
                return {"CNPJ": cnpj, "Status": f"Erro: {data.get('message', 'Erro desconhecido')}"}
            return {"CNPJ": cnpj, "Status": data.get("situacao", "Status desconhecido")}
    except Exception as e:
        return {"CNPJ": cnpj, "Status": f"Erro: {str(e)}"}

async def processar_cnpjs(cnpjs):
    resultados = []
    async with aiohttp.ClientSession() as session:
        tarefas = [consultar_cnpj(session, cnpj) for cnpj in cnpjs]
        resultados = await asyncio.gather(*tarefas)
    return resultados

def gerar_excel(resultados):
    df = pd.DataFrame(resultados)
    downloads_path = Path(os.path.expanduser("~")) / "Downloads"
    arquivo_excel = downloads_path / "CNPJs_Status.xlsx"
    df.to_excel(arquivo_excel, index=False)
    return arquivo_excel

# Rotas do Flask
@app.route('/')
def index():
    return open("index.html").read()

@app.route('/consultar', methods=['POST'])
def consultar():
    data = request.get_json()
    cnpjs = data.get('cnpjs', [])
    if not cnpjs or not isinstance(cnpjs, list):
        return jsonify({"message": "CNPJs inválidos!"}), 400

    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        resultados = loop.run_until_complete(processar_cnpjs(cnpjs))
        arquivo_excel = gerar_excel(resultados)
        return jsonify({
            "message": "Consulta realizada com sucesso!",
            "file": str(arquivo_excel)
        })
    except Exception as e:
        return jsonify({"message": f"Erro: {str(e)}"}), 500

@app.route('/download/<path:filename>')
def download(filename):
    if os.path.exists(filename):
        return send_file(filename, as_attachment=True)
    return jsonify({"message": "Arquivo não encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True)
