# Daily Dose of News

## Introduction
[Daily Dose of News](https://daily-dose-of-news.vercel.app/) is an interactive, easy-to-use news feed that renders AI-generated visualizations of today's top headlines using the [Feedforward VQGAN-CLIP model](https://replicate.com/mehdidc/feed_forward_vqgan_clip).

This Flask-based website uses [Replicate's API](replicate.ai) for the model, [News API](https://newsapi.org/) for generating news headlines, and [Vercel](https://vercel.com) for deployment.


![Demo](images/demo.gif)

## Usage
Go to https://daily-dose-of-news.vercel.app/ and choose a category/country, then click anywhere to start loading up a news article. A new article is loaded every 10 seconds. 

**Note**: The first time you load the page up will take some time for the article to show up (as the servers take time to spin up). 

## Setup

### venv

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### conda

```sh
conda create -n myenv
conda activate myenv
pip install -r requirements.txt
```

## Run locally

```sh
export REPLICATE_API_TOKEN=<my-replicate-api-token>
export NEWS_API_TOKEN=<my-news-api-token>
python app.py
```

Open https://localhost:5000.
