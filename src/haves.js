import {Chart} from 'react-google-charts';
import React, { Component} from "react"
import {renderReleaseCard, closeTooltipsOnClicks, formatNumber, createArtistLink, createMasterLink, correlationCopy} from "./lib.js"
import {pearsonCorrelation, createSteps} from "./lib.js"
import { Scrollama } from 'react-scrollama';
import injectSheet from 'react-jss';
import classnames from 'classnames'


const styles = {
	graphic: {
		position: 'sticky',
		top: '0',
		alignSelf: 'flex-start'
	},
	scroller: {
		flexBasis: '10%',
	},
	step: {
		'border-radius': '15px',
		margin: '0 auto 2rem auto',
		paddingTop: 100,
		paddingBottom: 100,
		height: '100vh',
		'& p': {
			textAlign: 'left',
			padding: '1rem',
		},
		'&:first-child': {
			marginTop: 200,
		},
		'&:last-child': {
			marginBottom: 500,
		},
	},
}

class HavesAndWants extends Component {
	constructor(props) {
		super(props);
		this.state = {sort: "have", type: "community"}
	}

	sort = (e) => {
		this.setState({sort: e.currentTarget.value})
	}

	createMasterTooltip(master, index){
		return (`
			<div class="chart-tooltip haves-wants-tooltip text-center">
				${renderReleaseCard(master, index+1, true)}
			</div>
		`)
	}

	onStepEnter = ({element, data, direction}) => {
		element.style.backgroundColor = 'lightgoldenrodyellow';
		this.setState(data);
	}

	onStepExit = ({element, data, direction}) => {
		element.style.backgroundColor = '#fff';
	}

	createScrollama(classes, masters, correlation, averageWantToHave){
		const steps = createSteps(classes, [
			{
				data: {'sort': 'have', 'type': 'community'},
				paragraphs: <>
					<p>
						The first chart shows the top 250 most collected releases ordered by the number of collections they appear in.
						Mouse over the chart to get more information on each data point.
						In first place we've got <em dangerouslySetInnerHTML={{__html: createMasterLink(masters[0])}} /> by
						<span dangerouslySetInnerHTML={{__html: createArtistLink(masters[0].artists)}} /> which can be
						found in {formatNumber(masters[0].community.have)} collections.
					</p>
					<p>
						The <span style={{"color": "#5e97f6"}}>blue</span> points mark how many collections a release has been added to while
						the <span style={{"color": "#db4437"}}>red</span> points
						show how many wantlists the release can be found in.
						You can click on each point to see more information about that release.
					</p>
					<p>
						You can see that this chart follows a <a href="https://en.wikipedia.org/wiki/Long_tail" target="_blank">long tail</a> distribution.
						A few releases at the top can be found in way more collections than the majority of the other releases.
						After this initial peak the decline is slow but steady.
						As you'd expect the most collected records in the more obscure genres are dwarfed by the bigger hits of more mainstream fare.
					</p>
			</>
			},{
				data: {'sort': 'want', 'type': 'community'},
				paragraphs: <>
					<p>
						Let's change the sorting to <i>wants</i> (the number of times a master release appears in users
						want lists). For some releases the demand seems to far outweigh the supply, while for others
						its vice versa.
					</p>
					<p>
						Here <em dangerouslySetInnerHTML={{__html: createMasterLink(masters[0])}} /> by
						<span dangerouslySetInnerHTML={{__html: createArtistLink(masters[0].artists)}} /> tops the list
						with {formatNumber(masters[0].community.want)} wantlist additions. After that we've
						got <em dangerouslySetInnerHTML={{__html: createMasterLink(masters[1])}} />
						by <span dangerouslySetInnerHTML={{__html: createArtistLink(masters[1].artists)}} /> and
						the bronze is taken by <em dangerouslySetInnerHTML={{__html: createMasterLink(masters[2])}} />.
					</p>
					<p>
						The average want to have ratio is {averageWantToHave} and the correlation between wants
						and haves is {correlation}, a {correlationCopy(correlation)} correlation. This is
						apparent from the graph as well.
					</p>
				</>
			}, {
				data: {'sort': 'have', 'type': 'versions'},
				paragraphs:	<>
					<p>
						Now we've plotted the collection numbers against the number of versions for each release.
						Each version of a master release is a specific physical release and some of the releases
						have hundreds of versions.
					</p>
					<p>
						For instance there are over 900 versions of Pink
						Floyds <a target="_blank" href="https://www.discogs.com/master/10362"><em>The Dark Side of the Moon</em></a> catalogued
						on Discogs. These include pressings from different countries, different formats (vinyl, cd,
						cassette and more esoteric ones) and then there are limited editions, represses, anniversary
						reissues and so on and so forth.
					</p>
					<p>
						Here releases that are in more wantlists than in collections
						are <span style={{"color": "#db4437"}}>red</span> while releases that are in more collections
						than in wantlists are <span style={{"color": "#5e97f6"}}>blue</span>.
					</p>
					<p>
						The correlation between the number of versions and collection additions is {correlation},
						a {correlationCopy(correlation)} correlation. At first you might assume that more versions
						would always mean more collection placements and wantlist additions, but that does not hold for
						all genres. Some releases have been reissued many times but in small runs, while others
						had big initial releases but not a lot of subsequent interest.
					</p>
				</>
			}
		])

		return (
			<div className={classnames(classes.scroller, "col-xs-12 col-md-4 col-md-pull-8 scroller")}>
				<Scrollama onStepEnter={this.onStepEnter} onStepExit={this.onStepExit} offset={0.33}>
					{steps}
				</Scrollama>
			</div>
		)
	}

	render(){
		const { classes } = this.props;
		let headers
		let vAxis
		let hAxis

		let title = `Most Collected ${this.props.genre} Master Releases`

		if (this.state.type === "versions"){
			headers = [
				{id: 'haves', label: 'Haves', type: 'number'},
				{id: 'wants', label: 'Wants', type: 'number'},
				{type: 'string', role: 'tooltip', 'p': {'html': true}},
				{type: 'string', role: 'style'}
			]
			title +=  ` - By Number of Versions and ${this.state.sort.toTitleCase()}s`
			hAxis = {title: 'Versions'}
			vAxis = {title: this.state.sort.toTitleCase() + 's'}
		}else{
			headers = [
				{id: 'position', label: 'position', type: 'number'},
				{id: 'haves', label: this.state.sort + 's', type: 'number'},
				{type: 'string', role: 'tooltip', 'p': {'html': true}},
				{id: 'wants', label: 'Wants', type: 'number'},
				{type: 'string', role: 'tooltip', 'p': {'html': true}}
			]
			title +=  ' - By Haves and Wants'
			hAxis = {title: 'Position'}
			vAxis = {title: 'Count', format: 0, viewWindow: {min: 0}}
		}

		const masters = this.props.data.masters.sort((a, b) => {
			return b.community[this.state.sort] - a.community[this.state.sort]
		})



		const data = masters.reduce((data, master, index) => {
			const tooltip = this.createMasterTooltip(master, index)
			if (this.state.type === "versions"){
				const color =  master.community.want >  master.community.have ? '#db4437' : '#5e97f6'
				const style = `point {fill-color: ${color}}`
				data.push([master.versions, master.community[this.state.sort], tooltip, style])
			}else{
				data.push([index + 1, master.community.have, tooltip, master.community.want, tooltip])
			}
			return data
		}, [])

		const indices = this.state.type === "versions" ? [0, 1] : [1, 3]
		const correlation = pearsonCorrelation(data.map(x => x[indices[0]]), data.map(x => x[indices[1]])).toFixed(2)
		const averageWantToHave = parseFloat(masters.reduce((acc, e) => acc + e.community.want/e.community.have, 0) / masters.length, 2).toFixed(2)

		const scrollama = this.createScrollama(classes, masters, correlation, averageWantToHave)

		if (this.state.type === "versions"){
			hAxis.viewWindow = {min: data[data.length - 1][0]}
			vAxis.viewWindow = {min: data[data.length - 1][1]}
		}else{
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
			</div>
		const legend = this.state.type === "versions" ? 'none' : { position: 'bottom' }
		return (
			<div id="haves-and-wants" className={"col-xs-12 col-md-12 parent"}>
				<div className={classnames(classes.graphic, "col-xs-12 col-md-8 col-md-push-4 section graphic")}>
					<h2>Haves and Wants</h2>
					<div className={"col-xs-12"}>
						<Chart
							height={'80vh'}
							className={"center-block"}
							chartType={"ScatterChart"}
							loader={<div>Loading Chart</div>}
							data={[headers, ...data]}
							options={{
								title: title,
								curveType: 'function',
								legend: legend,
								theme: 'material',
								tooltip: {isHtml: true, trigger: 'both'},
								animation: {duration: 1500},
								pointSize: 5,
								isStacked: 'relative',
								chartArea: {'width': '80%', 'height': '75%'},
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

export const StyledHavesAndWants = injectSheet(styles)(HavesAndWants);
