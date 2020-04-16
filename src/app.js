import React, { Component} from "react"
import { slide as Menu } from 'react-burger-menu'

import {StyledDecades} from './decade.js'
import {GenreDropdown} from './genreDropdown.js'
import {StyledGenresAndStyles} from './genre.js'
import {StyledHavesAndWants} from './haves.js'
import {StyledArtists} from './artists.js'
import {StyledArtistsByCountry} from './countries.js'
import {StyledArtistsByGender} from './gender.js'

class App extends Component{

	constructor(props) {
        super(props);

        this.state = {
        	toggle: true,
            loading: true,
            genre: "most-collected-masters.json"
        }
    }

	loadData() {
        fetch(`output/${this.state.genre}`)
            .then( (response) => {
                return response.json()
            })
            .then( (data) => {
				// de normalize master artists
				data.masters.forEach(function(master){
					master.artists = master.artists.reduce((artists, artistId) =>{
						artists.push(data.artists[artistId])
						return artists
					}, [])
				})
            	this.setState({
		            loading: false,
		            data: data,
            	})
            });
    }

    componentDidUpdate(prevProps, prevState) {
    	if (prevState.genre !== this.state.genre) {
    		this.setState({loading: true})
        	this.loadData()
    	}
	}

	componentDidMount() {
        this.setState({
	        loading: true,
            data: this.loadData()
        })
    }

	handleGenreChange = (e) => {
		this.setState({genre: e.target.value})
	}

	navbar = (genres) => {
		const genreDropdown = this.state.loading ? "" : <GenreDropdown
 			genres={genres}
			genre={this.state.genre}
		    changeHandler={this.handleGenreChange}
	    />

	    const menuItems = [
				"Intro",
				"Haves and Wants",
				"Artists",
				"Genres and Styles",
				"Years and Decades",
				"Artists by Country",
				"Artists by Gender",
				"Outro",
		].map((e) => [e.toLowerCase().replace(/ /g, "-"), e])

		return(
			<nav className="navbar" id={'nav'}>
				<Menu className='pull-left nav-menu'>
					<h2>Discogs Collection Statistics</h2>
					<h3>Table of contents</h3>
					{menuItems.map((e, index)=><a key={index} href={'#'+e[0]}>{e[1]}</a>)}
					<hr/>
					{genreDropdown}
					<div className="footer small">
						<div>A <a href="http://lazilyevaluated.co/">Lazily Evaluated</a> production</div>
						<div>Made by <a href="http://karltryggvason.com/" target="blank">Karl Tryggvason</a></div>
					</div>
				</Menu>
				<h1 className="text-center" ><a href="http://lazilyevaluated.co/">Lazily Evaluated</a></h1>
			</nav>
		)
	}

	render() {
        const genres = [
            ["All Genres", "most-collected-masters.json"],
			['Genres:', ''],
            ["Electronic", "most-collected-electronic-masters.json"],
            ["Hip Hop", "most-collected-hip-hop-masters.json"],
			['Styles:', ''],
            ["Drum & Bass", "most-collected-electronic-drum-n-bass-masters.json"],
            ["Dubstep", "most-collected-electronic-dubstep-masters.json"],
            ["House", "most-collected-electronic-house-masters.json"],
            ["Techno", "most-collected-electronic-techno-masters.json"],
        ]
		const selectedGenre = genres.filter(e => e[1] === this.state.genre)[0]
		const genreName = selectedGenre[0] !== "All Genres" ? selectedGenre[0] : ""

		const header = this.navbar(genres)
		const havesAndWants = !this.state.loading && <StyledHavesAndWants data={this.state.data} genre={genreName}  offset={true} />
		const artists = !this.state.loading && <StyledArtists data={this.state.data} genre={genreName} />
		const genresAndStyles = !this.state.loading && <StyledGenresAndStyles data={this.state.data} genre={genreName} />
		const decades = !this.state.loading && <StyledDecades data={this.state.data} genre={genreName}/>
		const artistsByCountry = !this.state.loading && <StyledArtistsByCountry data={this.state.data} genre={genreName}/>
		const artistsByGender = !this.state.loading && <StyledArtistsByGender data={this.state.data} genre={genreName}/>

		return (
			<div className="wrapper">
				{header}
				<div className="content row">
					<div id="intro" className="col-xs-12">
						<div className="jumbotron col-xs-12 col-md-offset-2 col-md-8 text-left intro-text">
							<h1 className="text-center">
								Discogs Collection Statistics
							</h1>
							<p className="lead text-center">
								Exploring the Most Collected and Coveted Records on Discogs
							</p>
							<p>
								<a href="http://www.discogs.com" target="_blank">Discogs</a> is a user built database and marketplace for recorded music.
								Many collectors, dj's and other music enthusiasts use the site to catalogue and keep track of their record collection and wantlist.
								A compilation of these want and have statistics can be found for every release on Discogs.
							</p>
							<p>
								On this page you can explore some aspects of the most collected and coveted music releases on Discogs.
								Hopefully it will provide insight into questions like: how many users have added each release to their collection?
								Who are the artists and bands behind these recordings? Where are they come from?
								When were they released and which genres and styles do they belong to?
							</p>
							<p>
								You can look at the most collected records overall or filter down to a handful of my favourite styles and genres.
								Click the menu for more options and information. I hope you enjoy it.
							</p>
							<h3 className={'get-started text-center'}>
								Scroll down to get started!
							</h3>
							<p className={'text-center text-large'}>
								<a href="#haves-and-wants">
									<span
										className="glyphicon glyphicon-chevron-down scroll-arrow"
										aria-hidden="true"
									/>
								</a>
							</p>
						</div>
					</div>

					{havesAndWants}
					<div className={"col-xs-12 interlude"}>&nbsp;</div>
					{artists}
					<div className={"col-xs-12 interlude"}>&nbsp;</div>
					{genresAndStyles}
					<div className={"col-xs-12 interlude"}>&nbsp;</div>
					{decades}
					<div className={"col-xs-12 interlude"}>&nbsp;</div>
					{artistsByCountry}
					<div className={"col-xs-12 interlude"}>&nbsp;</div>
					{artistsByGender}
					<div className={"col-xs-12 interlude"}>&nbsp;</div>

					<div id="outro" className="col-xs-12">
                        <h2>Outro</h2>
						<div className="col-xs-12 col-md-offset-2 col-md-8 text-left">
                            <p>
								I hope this summary of the most collected Discogs releases was informative and entertaining to you.
								Thanks to the Discogs and MusicBrainz user communities for their tireless work on cataloguing the worlds music.
								The code used to collect and visualize this data can be found on <a href="http://github.com/kalli/collection-stats">Github</a>.
								If you see any bugs or inconsistencies in the data you can let me know
								on <a href="http://twitter.com/karltryggvason">@karltryggvason</a> on Twitter or
								send me an email <a href="mailto:ktryggvason@gmail.com">ktryggvason@gmail.com</a>
                            </p>
							<p>
								Some words on the methodology: This page uses the <i>master releases</i> on Discogs.
								This is the abstract idea of a release, how you probably think of an album or a single.
								The one that ties together all the different physical editions on Discogs, such as
								CD releases, vinyl versions, cassettes and other more esoteric formats. For
								instance <a href="https://www.discogs.com/Aphex-Twin-Selected-Ambient-Works-85-92/master/565">45 versions</a> of <i>Selected Ambient Works</i> have
								been catalogued on Discogs under the master relases.
							</p>
							<p>
								The data displayed on this page was gathered at mid April 2020, the collection numbers
								are likely to have changed a bit since then though I imagine the overall patterns
								are roughly the same.
							</p>
							<p>
								Full disclosure: My day job is at Discogs, but this is a personal project done in my own
								time, created using public apis and open data. To fetch the most collected releases I used
								the <a href="https://www.discogs.com/developers">Discogs API</a> and for demographic
								information on the different bands and artists I used
								the <a href="http://musicbrainz.org/">MusicBrainz</a> API.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
export default App