''' Uses NewsAPI to fetch headlines.
    https://newsapi.org/sources
    For more info see https://newsapi.org/docs/endpoints/top-headlines
'''

from newsapi import NewsApiClient

# Init

class NewsAPIClient:
    def __init__(self, api_key='587795fb1b534cc0abf064cacc8a124c'):
        self.newsapi = NewsApiClient(api_key=api_key)

    def get_headlines(self, category, country):
        print('Your Daily Dose of News')
        # https://replicate.com/laion-ai/ongo
        # https://replicate.com/mehdidc/feed_forward_vqgan_clip

        
        resp = self.newsapi.get_top_headlines(category=category,
                                                language='en',
                                                country=country)

        import random 
        article = random.choice(resp['articles'])
    
        src = ''
        try:
            headline, src = article['title'].split('-')
        except:
            headline = article['title']

        url = article['url']            
        description=article['description']
        return headline, src, url, description