import React from "react"
import {GraphicComponent, styles} from "./graphic"
import {Chart} from "react-google-charts"
import {closeTooltipsOnClicks, createArtistLink} from "./lib"
import injectSheet from 'react-jss';
import classnames from 'classnames'


export class ArtistsByGender extends GraphicComponent {

	createGenderToolTip(gender, artistsByGender){

		let list = artistsByGender.reduce((list, artist) => {
			return (list += `<li>${artist}</li>`)
		}, "")

		return `<div class="chart-tooltip gender-tooltip">
					<h2>${gender} - ${artistsByGender.length}</h2>
					<ol>${list}</ol>
				</div>`
	}

	getSteps(){
		return [
			{
				data: {},
				paragraphs: <>
					<p>
						MusicBrainz also has information on artist and band
						members <a href="https://wiki.musicbrainz.org/Artist#Gender" target="_blank">genders</a> although
						in a lot of cases though that information hasn't been entered.
					</p>
					<p>
						The collections of Discogs users seem to skew pretty heavily towards music by men,
						across genres and styles. I wonder if this is a sign of the tastes of Discogs' user base or if
						it reflects a male dominated music industry in general, my guess it is a bit of both.
					</p>
				</>
			}
		]

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

	render() {
		const { classes } = this.props;
		const scrollama = this.createScrollama(this.getSteps())

		const options = this.graphicOptions({
			height: '90vh',
			className: "center-block",
			chartType: "ColumnChart",
			data:
				[
					["Gender", "Count", {type: 'string', role: 'tooltip', 'p': {'html': true}}],
					... this.groupByGender(Object.values(this.props.data.artists))
				]
			,
			options: {
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
			},
			chartEvents: [{
				eventName: "ready",
				callback: ({ chartWrapper, google }) => closeTooltipsOnClicks(chartWrapper, google)
			}]
		})

		return (
			<div id="artists-by-gender" className="col-xs-12">
				<div className={classnames(classes.graphic, this.graphicClassNames())}>
					<h2>Artists and Groups by Gender</h2>
					<div className={"col-xs-12"}>
						<Chart {...options} />
					</div>
				</div>
				{scrollama}
			</div>
		)
	}
}

export const StyledArtistsByGender = injectSheet(styles)(ArtistsByGender)