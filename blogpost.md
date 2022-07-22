# Daily Dose of News with Replicate's API

Hi! I'm Vivian from Replicate. 
Today I'll be showing you how to use Replicate's API to visualize today's top news headlines with AI.

:star: [Website](https://daily-dose-of-news.vercel.app/) | :computer: [Repo](https://github.com/vccheng2001/daily-dose-of-news) | :rocket: [Model on Replicate](https://replicate.com/mehdidc/feed_forward_vqgan_clip)

## Overview

![Demo](images/demo.gif)

[Daily Dose of News](https://daily-dose-of-news.vercel.app/) is an interactive, easy-to-use news feed that renders AI-generated visualizations of today's top headlines using the [Feedforward VQGAN-CLIP model](https://replicate.com/mehdidc/feed_forward_vqgan_clip). 

VQGAN-CLIP is capable of producing high-quality images from complex text without any training by using a multimodal encoder to guide image generations; you can find the original Github repo [here.](https://github.com/mehdidc/feed_forward_vqgan_clip)

## Usage
Go to https://daily-dose-of-news.vercel.app/ and choose a category (business, health, sports, entertainment, etc...) and country (source of the article), then click anywhere to start loading up your news feed! A new article is loaded every 10 seconds by default.

**Note**: The first time you load the page up will take some time for the article to show up (as the servers take time to spin up). 

**Note**: The NewsAPI collects limited number of articles from limited countries/sources a day; thus some queries may not work.

## Implementation

This [Flask](https://flask.palletsprojects.com/en/2.1.x/)-based website uses [Replicate's API](replicate.ai) for the model, [News API](https://newsapi.org/) for generating news headlines, and [Vercel](https://vercel.com) for deployment.


### Using the Replicate API 

To make predictions with Replicate's API, we need to first import the package in the main script ```app.py```:

```python
import replicate 
```
Then, we can fetch the latest version of
[VQGAN-CLIP](https://replicate.com/mehdidc/feed_forward_vqgan_clip) as follows: 

```python
# Fetch model 
model = replicate.models.get("mehdidc/feed_forward_vqgan_clip")

# Get model version 
version = model.versions.get(
"28b5242dadb5503688e17738aaee48f5f7f5c0b6e56493d7cf55f74d02f144d8"
)
```
In ```static/index.js```, we then make a POST request to ```/api/predict```, which in turn creates a ```replicate.prediction``` object that feeds in the news headline as our text prompt, and outputs an AI-synthesized image. 

```python
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
```


## Run locally

### Setup
#### venv

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### conda
```sh
conda create -n myenv
conda activate myenv
pip install -r requirements.txt
```


### API Tokens
In addition to a Replicate API token, you'll also need to generate a [NewsAPI token](https://newsapi.org/) to run locally.

```sh
export REPLICATE_API_TOKEN=<my-replicate-api-token>
export NEWS_API_TOKEN=<my-news-api-token>
```

### Run
Finally, run ```python app.py``` and open https://localhost:5000.


Thanks for tuning in! If you have any questions, ping us on
[Discord](https://discord.com/channels/775512803439280149/775513324082823198)