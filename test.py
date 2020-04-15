import unittest
from musicbrainz import get_artist_members
from discogs import d


class TestMusicBrainsFetching(unittest.TestCase):

    def testCorrectlyFetchesGroups(self):
        pink_floyd = d.artist(45467)
        members = get_artist_members(pink_floyd)
        self.assertEqual(len(members), 5)
