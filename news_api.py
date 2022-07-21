''' Uses NewsAPI to fetch headlines.
    https://newsapi.org/sources
    For more info see https://newsapi.org/docs/endpoints/top-headlines
'''

from newsapi import NewsApiClient
import random 

NEWS_API_TOKEN = 'e25a9e9464ef429798ba3a56ac9fcd70'

class NewsAPIClient:
    def __init__(self, NEWS_API_TOKEN):
        self.newsapi = NewsApiClient(api_key=NEWS_API_TOKEN )

    def get_headlines(self, category, country):
        print('Your Daily Dose of News')
        # https://replicate.com/laion-ai/ongo
        # https://replicate.com/mehdidc/feed_forward_vqgan_clip

        
        resp = self.newsapi.get_top_headlines(category=category,
                                                # language='en',
                                                country=country)

        # No headlines found
        if not resp['articles']:
            return None

        article = random.choice(resp['articles'])
    
        src = ''
        try:
            headline, src = article['title'].split('-')
        except:
            headline = article['title']

        url = article['url']            
        description=article['description']
        return headline, src, url, description