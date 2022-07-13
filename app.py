import json
import replicate
from flask import (
    Flask,
    jsonify,
    render_template,
    send_from_directory,
    request,
)
import random 
from news_api import NewsAPIClient


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/predict", methods=["POST"])
def predict():

    body = request.get_json()
    category = body['category']
    print('category', category)
    # fetch model and version
    print('Fetching model and version......')
    model = replicate.models.get("mehdidc/feed_forward_vqgan_clip")
    version = model.versions.get(
        "28b5242dadb5503688e17738aaee48f5f7f5c0b6e56493d7cf55f74d02f144d8"
    )
    # instantiate news API client
    print('Instantiating News API Client......')
    news_client = NewsAPIClient()
    print('Fetching news headlines.......')
    headlines = news_client.get_headlines()
    headline = random.choice(headlines)
    print('Processing new headline......', headline)

    prediction = replicate.predictions.create(
            version=version,
            input={
                "prompt":headline,
                "model": 'cc12m_32x1024_mlp_mixer_openclip_laion2b_ViTB32_256x256_v0.4.th',
                "prior": False,
                "grid": '1x1',
                "seed": random.randint(0, 2**15-1),
            },
    )
    return jsonify({"prediction_id": prediction.id, "headline":headline})


@app.route("/api/predictions/<prediction_id>", methods=["GET"])
def get_prediction(prediction_id):
    prediction = replicate.predictions.get(prediction_id)
    output = None
    if prediction.output:
        print('pred out', prediction.output)
        # output = json.loads(prediction.output)
    return jsonify({"output": prediction.output, "status": prediction.status})


@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory("static", path)


if __name__ == "__main__":
    app.run(debug=True)
