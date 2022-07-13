import replicate
import flask
import pickle
import base64
import numpy as np
import cv2
import torch
import torchvision
import replicate
import json 
from pathlib import Path
from news_api import NewsAPIClient
import random 

from flask import (
    Flask,
    jsonify,
    render_template,
    send_from_directory,
    request,
)

def predict():
    if 1:#request.method == 'POST':

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

        # store outputs
        outputs = []
        preds = []
        for headline in headlines[:3]:
            print('Processing new headline......', headline)
            
            pred = replicate.predictions.create(
                version=version,
                input={
                    "prompt":str(headline),
                    "model": 'cc12m_32x1024_mlp_mixer_openclip_laion2b_ViTB32_256x256_v0.4.th',
                    "prior": False,
                    "grid": '1x1',
                    "seed": random.randint(0, 2**15-1),
                },
            )
            preds.append(pred)
        
        # sleep 
        import time
        time.sleep(30)

        # fetch prediction outputs
        for pred in preds:
            prediction = replicate.predictions.get(pred.id)
            output = None
            if prediction.output:
                outputs.append(prediction.output)
                
        print('outputs', outputs)

predict()