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
import os

NEWS_API_TOKEN = os.getenv('NEWS_API_TOKEN')

app = Flask(__name__)

# Render index page
@app.route("/")
def index():
    return render_template("index.html")


# Predict
@app.route("/api/predict", methods=["POST"])
def predict():
    body = request.get_json()
    category = body['category']
    country = body['country']

    if country == "all": 
        country = None # all countries
    else: 
        country = country.split(' ')[0] # get country abbreviation

    # Get model
    print('Category: ', category, 'Country:', country)
    print('Fetching model and version......')
    model = replicate.models.get("mehdidc/feed_forward_vqgan_clip")
    version = model.versions.get(
        "28b5242dadb5503688e17738aaee48f5f7f5c0b6e56493d7cf55f74d02f144d8"
    )
    # Instantiate news API client
    print('Instantiating News API Client......')
    news_client = NewsAPIClient(NEWS_API_TOKEN = NEWS_API_TOKEN)
    print(f'Fetching news headlines for {category} category.......')
    result = news_client.get_headlines(category, country)
    
    # Result
    if not result:
        headline, src, url, description = None, None, None, None
    else:
        headline, src, url, description = result
        print('Processing new headline......', headline)

    # Create repliation prediction object
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
    return jsonify({"prediction_id": prediction.id, "headline":headline, "src":src, "url":url, "description":description})

# Get prediction by its ID
@app.route("/api/predictions/<prediction_id>", methods=["GET"])
def get_prediction(prediction_id):
    prediction = replicate.predictions.get(prediction_id)
    output = None
    
    if prediction.output:
        print('Prediction output', prediction.output)
        import time
        time.sleep(5)
    return jsonify({"output": prediction.output, "status": prediction.status})


@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory("static", path)


if __name__ == "__main__":
    app.run(debug=True)
