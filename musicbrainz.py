import musicbrainzngs
import os
import re

# comma separated string "name, version, contact"
USER_AGENT = os.getenv('MUSICBRAINZ_USERAGENT').split(',')
musicbrainzngs.set_useragent(USER_AGENT[0], USER_AGENT[1], USER_AGENT[2])


# Discogs artists that have anvs that match the Musicbrainz ones
ALIASES = {
    2554370: {
        'name': 'Robin S.', 'id': 66727
    },
    8672: {
        'name': 'Wendy Carlos', 'id': 16261
    }
}


def get_musicbrainz_artist(discogs_artist):
    """
    :param discogs_artist: A discogs artist dictionary

    :return: The MusicBrainz artist that matches that Discogs Artist and any members if the artist is a group
    """
    mb_artist = find_music_brain_match(discogs_artist)
    if mb_artist:
        if mb_artist.get('type', 'Person') == 'Group':
            mb_artist['members'] = get_members(mb_artist)
    return mb_artist


def find_music_brain_match(discogs_artist):
    if discogs_artist['id'] in ALIASES:
        name = ALIASES[discogs_artist['id']]['name']
        discogs_id = ALIASES[discogs_artist['id']]['id']
    else:
        name = re.sub(' \(\d+\)', '', discogs_artist['name'])
        discogs_id = discogs_artist['id']
    search = musicbrainzngs.search_artists(artist=name)
    for result in search['artist-list']:
        mb_artist = musicbrainzngs.get_artist_by_id(result['id'], includes=['url-rels', 'artist-rels'])['artist']
        if is_discogs_artist_match(discogs_id, mb_artist):
            return mb_artist
    return None


def is_discogs_artist_match(discogs_artist_id, music_brains_artist):
    discogs_url = 'https://www.discogs.com/artist/%d' % discogs_artist_id
    return any(discogs_url in url['target'] for url in music_brains_artist.get('url-relation-list', []))


def get_members(music_brains_artist):
    relationships = music_brains_artist.get('artist-relation-list', [])
    member_ids = [relation['target'] for relation in relationships if relation['type'] == 'member of band']
    members = {}
    for member_id in member_ids:
        if member_id not in members:
            members[member_id] = musicbrainzngs.get_artist_by_id(member_id)['artist']
    return members.values()


def get_musicbrainz_country(music_brain_data):
    # some artists have a country code set explicitly, when their area is a country, but this is not always the case
    # in that case we need a fix - https://musicbrainz.org/doc/Artist#Area
    area = music_brain_data.get('area', None)
    for i in range(0, 5):
        related_areas = musicbrainzngs.get_area_by_id(area['id'], includes=['area-rels'])['area']['area-relation-list']
        # we only want to zoom out
        related_areas = [a for a in related_areas if a['direction'] == 'backward']
        for related_area in related_areas:
            if 'iso-3166-2-code-list' in related_area['area']:
                return related_area['area']['iso-3166-2-code-list'][0][0:2]
        area = related_areas[0]['area']
    return None
