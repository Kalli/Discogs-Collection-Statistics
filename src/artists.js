import {Chart} from 'react-google-charts';
import React from "react"
import {renderReleaseCard, closeTooltipsOnClicks, groupByArtist, formatNumber, pearsonCorrelation, correlationCopy} from "./lib.js"
import injectSheet from 'react-jss';
import classnames from 'classnames'
import {GraphicComponent, styles} from './graphic.js'


class Artists extends GraphicComponent {
	constructor(props) {
		super(props);
		this.state = {sort: "have", size: 0, intervalId: null, changeSize: false}
	}

	sort = (e) => {
		this.setState({sort: e.currentTarget.value})
	}

	resizePoints = (changeSize) => {
		const growing = changeSize && !this.state.changeSize
		const shrinking = !changeSize && this.state.changeSize

		if (growing || shrinking) {
			// set interval if we need to grow or shrink
			const intervalId = setInterval(() => {
				if (growing && this.state.size < 100) {
					this.setState({size: this.state.size + 10})
				}
				if (shrinking && this.state.size > 0) {
					this.setState({size: this.state.size - 10})
				}
			}, 100)
			// clear an earlier interval if one had been set
			if (this.state.intervalId){
				clearInterval(this.state.intervalId)
			}
			this.setState({intervalId: intervalId, changeSize: changeSize})
		}else{
			// clear interval if animations are finished
			if (this.state.intervalId && (this.state.size !== 100 || this.state.size !== 0)){
				clearInterval(this.state.intervalId)
				this.setState({intervalId: null})
			}
		}
	}

	onStepEnter = ({element, data, direction}) => {
		element.style.backgroundColor = 'lightgoldenrodyellow'
		this.resizePoints(data.changeSize)
		this.setState({sort: data.sort})
	}

	onStepExit = ({element, data, direction}) => {
		this.resizePoints(data.changeSize)
		element.style.backgroundColor = '#fff'
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId)
	}

	getSteps(artists, averageWantToHave, correlation){
		const a = artists
		return [
			{
				data: {'sort': 'have', 'changeSize': false},
				paragraphs: <>
					<p>
						Let's move on to the artists. Here we've grouped all the master releases by the artist or band
						behind them. This adds up the wants and haves for all the releases a certain artist has in the
						top 250. Some artists appear in the top 250 many times, while other are closer to one hit
						wonders.
					</p>
					<p>
						<span dangerouslySetInnerHTML={{__html: artists[0].artistLink}} /> top the list,
						they have {artists[0].masters.length} releases in the top 250 which have found their way
						to {formatNumber(artists[0].have)} collections and {formatNumber(artists[0].want)} wantlists.
					</p>
					<p>
						<span dangerouslySetInnerHTML={{__html: artists[1].artistLink}} /> take the silver,
						their {artists[1].masters.length} releases rack up {formatNumber(artists[1].have)} haves
						and {formatNumber( artists[1].want)} wants.
					</p>
					<p>
						In third place we
						find <span dangerouslySetInnerHTML={{__html: artists[2].artistLink}} /> whose
						{" " + artists[2].masters.length} releases are in the collections
						of {formatNumber(artists[2].have)} users and have been wantlisted
						by {formatNumber( artists[2].want)} people.
					</p>
				</>
			},
			{
				data: {'sort': 'have', 'changeSize': false},
				paragraphs: <>
					<p>
						Now lets graph wants vs. haves to show us which artists are in more wantlists than
						collections (<span style={{"color": "#db4437"}}>red</span>) and
						vice versa (<span style={{"color": "#5e97f6"}}>blue</span>).
					</p>
					<p>
						The mean want to have ratio is {averageWantToHave}. That means that on average the
						releases from these artists can be found in more
						{averageWantToHave > 1? " wantlists than collections" : " collections than wantlists" }.
						The correlation between wants and haves is {correlation},
						a {correlationCopy(correlation)} correlation, looking at the graph confirms this.
					</p>
				</>
			},
			{
				data: {'sort': 'haves-wants', 'changeSize': true},
				paragraphs: <>
						<p>
							For further clarity let's adjust the size of each point to reflect how many releases
							that artist has in the top 250. This shows us that the artists taking the top spots are
							also those that have the most releases.
						</p>
						<p>
							This makes sense, it would take a serious one hit wonder for its wants and haves to
							outweigh the cumulative wants and have of artists with many releases in the top list.
						</p>
				</>
			}
		]

	}

	createArtistTooltip(artist, index){
		let width;
		switch (artist.masters.length) {
			case 1:{
				width = 12
				break
			}
			case 2:{
				width = 6
				break
			}
			default:{
				width = 4
				break
			}
		}

		return (`
			<div class="chart-tooltip artist-tooltip text-center">
				<div class="artist row">
					${this.state.sort !== "haves-wants" ? index + 1 + ". ": ''} ${artist.artistLink}
					<div>
						<span class="label label-default">
							Releases: ${artist.masters.length}
						</span>
						<span class="label label-primary">
							Have: ${formatNumber(artist.masters.reduce((acc, e) => acc + e.community.have, 0))}
						</span>
						<span class="label label-danger">
							Want: ${formatNumber(artist.masters.reduce((acc, e) => acc + e.community.want, 0))}
						</span>
					</div>
				</div>
				<div class="releases row display-flex center-block">
					${artist.masters.reduce(function (acc, e) {
						return acc + '<div class="col-xs-' + width + ' clearfix">' + renderReleaseCard(e) + "</div>";
					}, "")}
				</div>
			</div>
		`)
	}

	render(){
		const { classes } = this.props;
		let headers
		let vAxis
		let hAxis

		if (this.state.sort === "haves-wants"){
			headers = [
				{id: 'haves', label: 'Haves', type: 'number'},
				{id: 'wants', label: 'Wants', type: 'number'},
				{type: 'string', role: 'tooltip', 'p': {'html': true}},
				{type: 'string', role: 'style'}
			]
			hAxis = {title: 'Haves'}
			vAxis = {title: 'Wants'}
		}else{
			headers = [
				{id: 'position', label: 'position', type: 'number'},
				{id: 'haves', label: 'Haves', type: 'number'},
				{type: 'string', role: 'tooltip', 'p': {'html': true}},
				{id: 'wants', label: 'Wants', type: 'number'},
				{type: 'string', role: 'tooltip', 'p': {'html': true}},
			]
			hAxis = { title: 'Position'}
			vAxis = {title: 'Count', format: 0, viewWindow: {min: 0}}
		}

		const artistKeys = groupByArtist(this.props.data.masters)
		const artists = Object.keys(artistKeys).reduce(function(acc, artistName){
			acc.push({
				'artistLink': artistName,
				'masters': artistKeys[artistName],
				'have':  artistKeys[artistName].reduce((sum, e) => sum + e.community.have, 0),
				'want':  artistKeys[artistName].reduce((sum, e) => sum + e.community.want, 0)
			})
			return acc
			}, []).sort((a, b) => {
			return b[this.state.sort] - a[this.state.sort]
		})
		const averageWantToHave = parseFloat(artists.reduce((acc, e) => acc + e.want/e.have, 0) / artists.length, 2).toFixed(2)

		const data = artists.reduce((data, artist, index) => {
			const tooltip = this.createArtistTooltip(artist, index)
			if (this.state.sort === "haves-wants"){
				const color =  artist.want >  artist.have ? '#db4437' : '#5e97f6'
				const size = (artist.masters.length * this.state.size/100 * 3) + 3
				const style = `point {fill-color: ${color}; size: ${size}}`
				data.push([artist.have, artist.want, tooltip, style])
			}else{
				data.push([index + 1, artist.have, tooltip, artist.want, tooltip])
			}
			return data
		}, [])

		const indices = this.state.sort === "haves-wants" ? ['have', 'want'] : [1, 3]
		const correlation = pearsonCorrelation(artists.map(x => x[indices[0]]), artists.map(x => x[indices[1]])).toFixed(2)
		const scrollama = this.createScrollama(this.getSteps(artists, averageWantToHave, correlation))

		const title = `Most Collected ${this.props.genre} Master Releases - By Artist `

		if (this.state.sort !== "haves-wants"){
			hAxis.viewWindow = {max: data.length}
		}

		const sortControls = <div className="form-group">
				<label htmlFor="type">
					Sort by:
				</label>
				<label className="radio-inline" >
					<input type="radio"
						   name="sort"
						   value="have"
						   checked={this.state.sort === "have"}
						   onChange={this.sort}
					/>
					Haves
				</label>
				<label className="radio-inline" >
					<input type="radio"
						   name="sort"
						   value="want"
						   checked={this.state.sort === "want"}
						   onChange={this.sort}
					/>
					Wants
				</label>
				<label className="radio-inline" >
					<input type="radio"
						   name="sort"
						   value="haves-wants"
						   checked={this.state.sort === "haves-wants"}
						   onChange={this.sort}
					/>
					Haves vs. Wants
				</label>
			</div>
		const legend = this.state.sort === "haves-wants" ? 'none' : { position: 'bottom' }
		const duration = (0 === this.state.size || this.state.size === 100) ? 1000 : 0
		return (
			<div id="artists" className={"col-xs-12 col-md-12"}>
				<div className={classnames(classes.graphic, "col-xs-12 col-md-8 section")}>
				<h2>Artists</h2>
				<div className={"col-xs-12"}>
					<Chart
						height={'80vh'}
						className={"center-block"}
						chartType={"ScatterChart"}
						loader={<div>Loading Chart</div>}
						data={[headers, ...data]}
						options={{
							title: title,
							legend: legend,
							theme: 'material',
							tooltip: {isHtml: true, trigger: 'both'},
							animation: {startup: true, duration: duration},
							pointSize: 5,
							isStacked: 'relative',
							chartArea: {'width': '80%', 'height': '80%'},
							hAxis: hAxis,
							vAxis: vAxis,
						}}
						chartEvents={[{
							eventName: "ready",
							callback: ({ chartWrapper, google }) => closeTooltipsOnClicks(chartWrapper, google)
						}]}
					/>
				</div>
				<div className="chart-controls text-center form">
					{sortControls}
				</div>
			</div>
			{scrollama}
		</div>
		)
	}
}

export const StyledArtists = injectSheet(styles)(Artists);
