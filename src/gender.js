import React, { Component} from "react"
import {Chart} from "react-google-charts"
import {closeTooltipsOnClicks, createArtistLink} from "./lib"
import { Scrollama, Step } from 'react-scrollama';
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

export class ArtistsByGender extends Component {

	createGenderToolTip(gender, artistsByGender){

		let list = artistsByGender.reduce((list, artist) => {
			return (list += `<li>${artist}</li>`)
		}, "")

		return `<div class="chart-tooltip gender-tooltip">
					<h2>${gender} - ${artistsByGender.length}</h2>
					<ol>${list}</ol>
				</div>`
	}

	groupByGender(artists){
		const artistsByGender = artists.reduce((genders, artist) => {
			const mbData = artist['musicbrainz']
			if (!mbData || artist.name === "Various"){
				console.log(artist);
				return genders
			}
			if (mbData.type === "Group"){
				mbData.members.forEach((member) =>{
					const gender = member.gender? member.gender : "unknown"
					const memberCaption = `${member.name} (${createArtistLink([artist])})`.trim()
					genders[gender]? genders[gender].push(memberCaption) : genders[gender] = [memberCaption]
				})
			}else{
				const gender = mbData.gender? mbData.gender : 'unknown'
				const artistLink = createArtistLink([artist])
				genders[gender]? genders[gender].push(artistLink) : genders[gender] = [artistLink]
			}
			return genders
		}, {})

		return Object.keys(artistsByGender).reduce((acc, key) => {
			const row = [key, artistsByGender[key].length, this.createGenderToolTip(key, artistsByGender[key])]
			acc.push(row)
			return acc
		}, [])
	}

	onStepEnter = ({element, data, direction}) => {
		element.style.backgroundColor = 'lightgoldenrodyellow';
		this.setState(data);
	}

	onStepExit = ({element, data, direction}) => {
		element.style.backgroundColor = '#fff';
	}

	render() {
		const { classes } = this.props;
		return (
			<div id="artists-by-gender" className="col-xs-12">
				<h2>Artists and Groups by Gender</h2>
				<div className={classnames(classes.graphic, "col-xs-12 col-md-8 section")}>
				<h2>Artists and Groups by Gender</h2>
				<Chart
					height={700}
					className={"center-block"}
					chartType="ColumnChart"
					data={
						[
							["Gender", "Count", {type: 'string', role: 'tooltip', 'p': {'html': true}}],
							... this.groupByGender(Object.values(this.props.data.artists))
						]
					}
					options={{
						title: `Most Collected ${this.props.genre} Master Releases - Artists by Gender`,
						tooltip: {isHtml: true, trigger: 'selection'},
						width: '100%',
						height: '100%',
						legend: 'none',
						theme: 'material',
						hAxis: {
							title: 'Gender',
						},
						vAxis: {
							title: 'Count',
						},
					}}
					chartEvents={[{
						eventName: "ready",
						callback: ({ chartWrapper, google }) => closeTooltipsOnClicks(chartWrapper, google)
					}]}
				/>
			</div>
				<div className={classnames(classes.scroller, "col-xs-12 col-md-4")}>
				<Scrollama onStepEnter={this.onStepEnter} onStepExit={this.onStepExit} offset={0.33}>
						<Step data={{'sort': 'haves-wants'}}>
							<div className={classes.step}>
								<p>
									MusicBrainz has information on artist and band members <a href="https://wiki.musicbrainz.org/Artist#Gender" target="_blank">genders</a> in
									a lot of cases though that information hasn't been entered for all artists.
								</p>
								<p>
									The collections of Discogs users seem to skew pretty heavily towards music by men, across genres and styles.
									I wonder if this is a sign of the tastes of Discogs' user base or if it reflects a
									male dominated music industry in general, my guess it is a fair bit of both.
								</p>
							</div>
						</Step>
					</Scrollama>
				</div>
			</div>
		)
	}
}

export const StyledArtistsByGender = injectSheet(styles)(ArtistsByGender);