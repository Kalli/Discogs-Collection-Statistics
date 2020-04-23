# Discogs Collection Statistics

An exploration of the most collected and want-listed records on [Discogs](http://discogs.com). 

See a live version on [Lazily Evaluated](http://lazilyevaluated.co/discogs-collection-statistics). 

# Running Locally 

## Gather the data - Python

* Run `collection-stats` script with relevant api keys and user agent info as environment variables (Discogs and MusicBrainz credentials needed)
* The relevant data will be saved to `data` and `output`
* This can take a while.

## Run the Front End

* Run `yarn install` and `npm start` 
* The project should be viewable at http://localhost:8080/