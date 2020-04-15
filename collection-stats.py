import json
from discogs import most_collected_masters
from musicbrainz import get_musicbrainz_artist, get_musicbrainz_country

LIMIT = 250
MUSICBRAINZ_DATA_FILE = 'data/musicbrainz-artist-data.json'

GENRE = None
STYLE = None


def load_local_cache(path_to_json):
    try:
        with open(path_to_json, 'r') as fp:
            data = json.load(fp)
    except IOError:
        data = {}
    return data


def data_path(genre=None, style=None):
    """Get the path to where a json file for this query should be saved or loaded from"""
    if not genre and not style:
        return 'data/most-collected-masters.json'
    if style and genre:
        return 'data/most-collected-%s-%s-masters.json' % (
            genre.lower().replace(' ', '-'),
            style.lower().replace(' ', '-')
        )
    if genre:
        return 'data/most-collected-%s-masters.json' % genre.lower().replace(' ', '-')


def get_most_collected_masters(genre=None, style=None):
    path = data_path(genre, style)
    masters = load_local_cache(path)
    if 'masters' not in masters or len(masters['masters']) < LIMIT:
        masters['masters'] = most_collected_masters(count=LIMIT, genre=genre, style=style)
        with open(path, 'w') as fp:
            json.dump(masters, fp)
    return masters


discogs_masters = get_most_collected_masters(genre=GENRE, style=STYLE)


def normalize_artists(masters):
    # create a dictionary of the unique artists for all these masters
    discogs_artists = {}
    for master in masters['masters']:
        for index, artist in enumerate(master['artists']):
            if artist['id'] not in discogs_artists.keys():
                discogs_artists[artist['id']] = artist
                # we need to keep track of the year range that these albums were released in
                # so we can get the band members at that time
                discogs_artists[artist['id']]['years'] = [master['year']]
            else:
                discogs_artists[artist['id']]['years'].append(master['year'])

    masters['artists'] = discogs_artists
    return masters


discogs_masters = normalize_artists(discogs_masters)


def get_music_brain_data(masters):
    musicbrainz_data = load_local_cache(MUSICBRAINZ_DATA_FILE)
    for index, discogs_artist in enumerate(masters['artists'].values()):
        try:
            if index % 10 == 0:
                print('%d / %d ' % (index, len(masters['artists'])))

            # pythons json serialization turns ints int strings
            discogs_id = str(discogs_artist['id'])

            # fetch Musicbrainz data for artists that are not in the cache
            if discogs_id not in musicbrainz_data:
                musicbrainz_data[discogs_id] = get_musicbrainz_artist(discogs_artist)
        except Exception as e:
            print(e, discogs_artist['name'], discogs_artist['id'])

    # some artists areas need fixing
    for music_brainz_artist in musicbrainz_data.values():
        try:
            if 'country' not in music_brainz_artist and 'area' in music_brainz_artist:
                music_brainz_artist['country'] = get_musicbrainz_country(music_brainz_artist)
        except Exception as e:
            print(e, music_brainz_artist)

    with open(MUSICBRAINZ_DATA_FILE, 'w') as fp:
        json.dump(musicbrainz_data, fp)
    return musicbrainz_data


musicbrainz_artist_data = get_music_brain_data(discogs_masters)



def clean_data(masters, musicbrainz_data):
    """
    Filter and remove unnecessary or redundant data
    """
    for master in masters['masters']:
        # we only use the first thumbnail
        master['images'] = master['images'][0:1]
        for key in master['images'][0].keys():
            if key != 'uri150':
                master['images'][0].pop(key, None)

        # we've already normalized artists, clean them up in masters to save storage
        artist_ids = [artist['id'] for artist in master['artists']]
        master['artists'] = artist_ids

    for artist in masters['artists'].values():
        # get the matching musicbrainz info
        discogs_id = str(artist['id'])
        musicbrainz_artist = musicbrainz_data.get(discogs_id, {})

        # necessary musicbrainz data
        required_mb_data = [
            'country', 'area', 'gender', 'name', 'members', 'type', 'artist'
        ]

        if musicbrainz_artist:
            if musicbrainz_artist.get('type', 'Person') == 'Group':
                # clean up band members to only those active during the years of the releases
                start = min(artist['years'])
                end = max(artist['years'])
                valid_member_ids = []
                # the relations are defined in "artist-relation-list" but the members are in ["members"]
                for relation in musicbrainz_artist.get('artist-relation-list', []):
                    member_start = int(relation.get('begin', str(start))[0:4])
                    member_end = int(relation.get('end', str(end))[0:4])
                    if member_start >= start and member_end <= end:
                        valid_member_ids.append(relation['target'])
                valid_members = []
                for member in musicbrainz_artist['members']:
                    try:
                        if member['id'] in valid_member_ids and member['type'] == 'Person':
                            for k in member.keys():
                                if k not in required_mb_data:
                                    member.pop(k, None)
                            valid_members.append(member)
                    except Exception as e:
                        print(e, musicbrainz_artist)
                musicbrainz_artist['members'] = valid_members

            for k in musicbrainz_artist.keys():
                if k not in required_mb_data:
                    musicbrainz_artist.pop(k, None)

        # combine musicbrainz data with discogs data
        artist['musicbrainz'] = musicbrainz_artist

    return masters


clean_discogs_masters = clean_data(discogs_masters, musicbrainz_artist_data)

output = data_path(genre=GENRE, style=STYLE).replace('data', 'output')
with open(output, 'w') as fp:
    json.dump(clean_discogs_masters, fp)
