import numpy as np
import faiss
from flask import Flask, request, jsonify
import yaml
from flask_cors import CORS

from codesearch.flaskapihandler import FlaskAPIHandler

with open("./config.yaml", "r") as stream:
    try:
        configs = yaml.safe_load(stream)
    except yaml.YAMLError as exc:
        print("Error in reading config.yaml: ", exc)


app = Flask(__name__)
CORS(app)
flask_api_handler = FlaskAPIHandler(configs=configs)


@app.route("/encode", methods=["GET", "POST"])
def handle_encode():
    print("request: ", request)
    flask_api_handler.handle_encode(request=request)
    return "Encoding complete"


@app.route("/search", methods=["GET", "POST"])
def handle_search():
    result_dict = flask_api_handler.handle_search(request=request)
    return jsonify(result_dict)


if __name__ == "__main__":
    print("App running on host 0.0.0.0 at port 5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
