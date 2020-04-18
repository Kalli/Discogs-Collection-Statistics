import {groupByArtist} from "./lib.js"
import {Chart} from 'react-google-charts';
import React from "react"
import injectSheet from 'react-jss';
import classnames from 'classnames'
import {GraphicComponent, styles} from './graphic.js'
import {formatNumber} from "./lib"


export class TimeLine extends GraphicComponent{

	constructor(props) {
		super(props)
		this.state = {type: "Decade"}
	}

	createTooltip(artist, masters){
	    const yearRange = masters[0].year + (masters.length > 1? ' - ' + masters[masters.length - 1].year : '')

		return (`
			<div class="chart-tooltip artist-tooltip">
				<div class="artist row">
                    <h4>${artist} - ${masters.length} Releases (${yearRange})</h4>
					<div class="text-center">
						<span class="label label-default">
							Releases: ${masters.length}
						</span>
						<span class="label label-primary">
							Have: ${formatNumber(masters.reduce((acc, e) => acc + e.community.have, 0))}
						</span>
						<span class="label label-danger">
							Want: ${formatNumber(masters.reduce((acc, e) => acc + e.community.want, 0))}
						</span>
					</div>
				</div>
				<ol>
					${masters.reduce(function (acc, e) {
						return acc + `<li>${e.title} (${e.year})</li>`;
					}, "")}
				</ol>
			</div>
		`)
	}

	createTimeline(groupedMasters){
		return Object.keys(groupedMasters).reduce((acc, artist)=> {
            const masters = groupedMasters[artist]
			const years = masters.map((release)=>parseInt(release.year))

			let label = ""
			if (this.type() !== "Style"){
				const labels =  masters.reduce((acc, release) => {
					const attribute = (this.type() === "All") ? "genres" : "styles"
					const l = release[attribute] ? release[attribute] : [this.props.genre]
					l.forEach((a) => acc[a]? acc[a] += 1 : acc[a] = 1)
					return acc
				}, {})
				label = Object.keys(labels).sort((a, b) => labels[b] - labels[a])[0]
			}

			acc.push([
				label,
				artist,
				this.createTooltip(artist, masters.sort((a, b) => a.year - b.year)),
				new Date(Math.min(...years), 1, 1),
				new Date(Math.max(...years), 1, 1),
			])
			return acc
		}, [])
	}

	getSteps(mostReleases, longestSpan){
		return [
			{
				data: {},
				paragraphs: <>
					<p>
                        We can further examine the history with this timeline for all the artists that have a release in
						the top 250.
					</p>
					<p>
						As mentioned before <em>{mostReleases[0][0]}</em> have {mostReleases[0][1]} releases in the top
						250, the most of any artist.
						{mostReleases[0][0] === longestSpan[0][0] &&
							<> Their releases also have span the longest time, </>
						}
						{mostReleases[0][0] !== longestSpan[0][0] &&
							<> But the longest timespan is taken up by <em>{longestSpan[0][0]}</em> </>
						}
						with {longestSpan[0][1]} releases, starting in {longestSpan[0][2]} and ending
						in {longestSpan[0][3]} or {longestSpan[0][4]} years.
					</p>
					<p>
						They are followed by <em>{longestSpan[1][0]}</em>, with {longestSpan[1][1]} releases
						spanning {longestSpan[1][4]} years, starting in {longestSpan[1][2]} and ending
						in {longestSpan[1][3]}. While in third place we find <em>{longestSpan[2][0]}</em>, with
						a {longestSpan[2][4]} year span with their {longestSpan[2][1]} releases starting
						with {longestSpan[2][2]} and ending in {longestSpan[2][3]}.
					</p>
				</>
			}
		]
	}

	render(){
		const { classes } = this.props
        const groupedMasters = groupByArtist(this.props.data.masters, false)
        const data = Object.keys(groupedMasters).reduce((acc, artistName) =>{
            const releaseYears = groupedMasters[artistName].map((e)=>e.year)
            const [first, last] = [Math.min(...releaseYears), Math.max(...releaseYears)]
			acc.push([
                artistName,
                groupedMasters[artistName].length,
				first,
				last,
				last - first
            ])
            return acc
        }, [])

		const mostReleases = data.sort((a, b) => b[1] - a[1]).slice(0, 3)
		const longestSpan = data.sort((a, b) => b[4] - a[4]).slice(0, 3)

        const timeline = this.createTimeline(groupedMasters)
        const headers = [
            { type: 'string', id: 'Genre' },
            { type: 'string', id: 'Artist'},
            {type: 'string', role: 'tooltip', 'p': {'html': true}},
            { type: 'date', id: 'Start' },
            { type: 'date', id: 'End' }
        ]
		const scrollama = this.createScrollama(this.getSteps(mostReleases, longestSpan))



		return (
			<div id="years-and-decades" className="col-xs-12">
				<div className={classnames(classes.graphic, "col-xs-12 col-md-8 section")}>
					<h2>Timeline</h2>
					<div className={"col-xs-12"}>
						<Chart
							height={'100vh'}
							className={"center-block"}
							chartType={"Timeline"}
							loader={<div>Loading Chart</div>}
							data={[headers, ...timeline]}
							options={{
								title: `Most Collected ${this.props.genre} Master Releases - Artist Timeline`,
								timeline: {
									singleColor: '#5e97f6',
									showRowLabels: (this.type() !== "Style")
								},
								chartArea: {'width': '80%', 'height': '100%'},
							}}
						/>
					</div>
			</div>
			{scrollama}
		</div>
		)
	}
}

export const StyledTimeLine = injectSheet(styles)(TimeLine);
