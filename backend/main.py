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


@app.route("/encode", methods=["POST"])
def handle_encode():
    flag = flask_api_handler.handle_encode(request=request)

    assert (
        flag == 0 or flag == 1 or flag == 2
    ), "The return flag from FlaskAPIHandler.handle_encode should be either 0, 1, 2"

    if flag == 0:
        return "Repository Already Encoded"
    elif flag == 1:
        return "Encoding Complete"
    elif flag == 2:
        return "Incorrect Input"
    else:  # flag == 3
        return "Repo Larger than 100MB"


@app.route("/search", methods=["GET", "POST"])
def handle_search():
    result_dict = flask_api_handler.handle_search(request=request)
    return jsonify(result_dict)


@app.route("/delete", methods=["DELETE"])
def handle_delete():
    flag = flask_api_handler.handle_delete(request=request)

    if flag == 0:
        return "Deletion Completed"
    else:
        return "Error in Deletion"


@app.route("/", methods=["GET"])
def handle_root():
    flag, project_data = flask_api_handler.handle_root()
    return jsonify(project_data)


if __name__ == "__main__":
    print("App running on host 0.0.0.0 at port 5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
