import discogs_client
from discogs_client.exceptions import HTTPError
import os
import time
from datetime import datetime

DISCOGS_USER_TOKEN = os.getenv('DISCOGS_USER_TOKEN')
d = discogs_client.Client('CollectionStats/0.1', user_token=DISCOGS_USER_TOKEN)


def most_collected_masters(count=100, genre=None, style=None):
    if genre and style:
        search_results = d.search(type='master', per_page=count, sort='have', genre=genre, style=style)
    elif genre:
        search_results = d.search(type='master', per_page=count, sort='have', genre=genre)
    else:
        search_results = d.search(type='master', per_page=count, sort='have')
    masters = []
    i = 0
    start_time = datetime.now()
    requests = 0
    for result in search_results:
        i += 1
        if i % 10 == 0:
            print(len(masters), i)
        while True:
            try:
                # if we are searching by genre, limit to only that genre
                valid = not genre or (genre in result.data['genre'] and len(result.data['genre']) == 1)
                if valid:
                    master = d.master(result.id)
                    master.refresh()
                    data = master.data
                    data['community'] = result.data['community']
                    data['versions'] = master.versions.count
                    data = clean_discogs_data(data)
                    masters.append(data)
                    start_time, requests = throttle(start_time, requests)
            except HTTPError as e:
                print(e)
                print('Not throttling enough... sleep more')
                time.sleep(60)
            break
        if len(masters) >= count:
            break
    return masters


def throttle(start_time, requests):
    diff = (datetime.now() - start_time).total_seconds()
    if diff < 60 and requests >= 50:
        print('Throttle! Going to sleep for %d seconds' % int(60-diff))
        time.sleep(60 - diff)
        start_time = datetime.now()
        requests = 0
    else:
        requests += 3
    return start_time, requests


def clean_discogs_data(master):
    """
    Remove data that we do not need
    """
    unused_data = [
        'videos',
        'versions_url',
        'uri',
        'tracklist',
        'resource_url',
        'num_for_sale',
        'most_recent_release_url',
        'most_recent_release',
        'main_release_url',
        'main_release',
        'lowest_price',
        'data_quality',
        'notes',
    ]
    for key in unused_data:
        master.pop(key, None)

    # we only need the first image
    master['images'] = [master['images'][0]]
    return master