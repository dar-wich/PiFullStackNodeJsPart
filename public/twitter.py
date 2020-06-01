from datetime import datetime
from datetime import timedelta
import csv
import pandas as pd
import GetOldTweets3 as got

def previous_week_range(date):
    start_date = date + timedelta(-date.weekday(), weeks=-1)
    end_date = date + timedelta(-date.weekday() - 1)
    return str(start_date)

tweetlist = []

tweetCriteria = got.manager.TweetCriteria().setQuerySearch('lufthansa')\
                                           .setSince(previous_week_range(datetime.date(datetime.now())))\
                                           .setUntil(str(datetime.date(datetime.now())))\
                                           .setMaxTweets(10000)
                                           
if (len(got.manager.TweetManager.getTweets(tweetCriteria))!=0):
    tweets = got.manager.TweetManager.getTweets(tweetCriteria)
    for tweet in tweets:
        new = ((tweet.id,tweet.username ,datetime.date(tweet.date),tweet.retweets,tweet.text,tweet.geo))
        tweetlist.append(new)
    df = pd.DataFrame(tweetlist,columns=["id", "UserName", "date","retweets","text","geoloc"])
    df.to_csv('./public/quoted.csv')    
else:
    print("NaN")