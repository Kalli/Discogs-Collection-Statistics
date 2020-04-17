import {createArtistLink, createMasterLink, closeTooltipsOnClicks} from "./lib.js"
import {Chart} from 'react-google-charts';
import React from "react"
import injectSheet from 'react-jss';
import classnames from 'classnames'
import {GraphicComponent, styles} from './graphic.js'


export class Decades extends GraphicComponent{

	constructor(props) {
		super(props)
		this.state = {type: "Decade"}
	}

	groupBy(masters){
		const groupedMasters = masters.reduce((acc, elem) => {
		    const key = this.state.type === "Decade" ?  Math.floor(elem.year / 10) * 10 : elem.year
			acc[key] ? acc[key].push(elem) : acc[key] = [elem]
			return acc
		}, {})

		return Object.keys(groupedMasters).reduce((acc, key) => {
			const row = [key, groupedMasters[key].length, this.createDecadeToolTip(groupedMasters[key])]
			acc.push(row)
			return acc
		}, []).sort((a, b) => a[0] - b[0])
	}

    changeType = (e) => {
		this.setState({type: e.currentTarget.value})
	}

	getSteps(sortedData){
		return [
			{
				data: {'type': 'Decade'},
				paragraphs: <>
					<p>
						In this chart we turn to the history of the most collected releases.
						To begin with, the releases are grouped by the decade they were released in.
					</p>
					<p>
						The {sortedData[0][0]}s are the biggest decade with {sortedData[0][1]} releases coming
						out in that ten year span. After that the {sortedData[1][0]}s
						{sortedData[2] && <> and {sortedData[2][0]}s </>}
						clock in with {sortedData[1][1]}
						{sortedData[2] && <> and {sortedData[2][1]} </>}
						releases respectively.
					</p>
					{this.props.genre === "" &&
					<p>
						It makes sense that records released a long time ago would have more represses and versions and
						thus the possibilities to get into more collections. As the decades pass the more likely it
						also seems for an album to become part of the canon. After the turn of the century you'd expect
						file sharing, digital collecting and streaming to take up more of peoples music consumption as well.
						But it still begs the question: why are the 70s so much bigger than the 60s and 50s?
					</p>
					}
					<p>
						You can click each column to see the releases released in those years.
					</p>
				</>
			},
			{
				data: {'type': 'Year'},
				paragraphs: <>
					<p>
						This is what things look like if we break the releases down by the year they came out.
					</p>
					{this.state.type === "Year" &&
					<p>
						The {sortedData[0][1]} releases that came out in {sortedData[0][0]} make it the biggest year.
						Number two is {sortedData[1][0]} when {sortedData[1][1]} releases came out and third prize
						goes to {sortedData[2][0]} with {sortedData[2][1]} releases.
					</p>
					}
				</>
			}
		]
	}
	render(){
		const { classes } = this.props;
        const data = this.groupBy(this.props.data.masters)
		const sortedData = [...data].sort((a, b) => b[1] - a[1])
		const headers = [
			{id: 'decade', label: 'Decade', type: 'string'},
			{id: 'count', label: 'Count', type: 'number'},
			{type: 'string', role: 'tooltip', 'p': {'html': true}}
		]

		const scrollama = this.createScrollama(this.getSteps(sortedData))
		// const earliest = String(Math.min(...years))
		// const latest = String(Math.max(...years))

		return (
			<div id="years-and-decades" className="col-xs-12">
				<div className={classnames(classes.graphic, "col-xs-12 col-md-8 section")}>
				<h2>Years and Decades</h2>
					<div className={"col-xs-12"}>
					<Chart
						height={700}
						className={"center-block"}
						chartType="ColumnChart"
						loader={<div>Loading Chart</div>}
						data={[headers, ...data]}
						options={{
							title: `Most Collected ${this.props.genre} Master Releases - By ${this.state.type} Released`,
							animation: {duration: 1500},
							legend: { position: 'bottom' },
							theme: 'material',
							tooltip: {isHtml: true, trigger: 'selection'},
							chartArea: {'width': '80%', 'height': '80%'},
							hAxis: {
								title: this.state.type,
							},
							vAxis: {
								title: 'Number of Releases',
								format: 0,
								viewWindow: {min: 0},
							},
						}}

						chartEvents={[{
							eventName: "ready",
							callback: ({ chartWrapper, google }) => closeTooltipsOnClicks(chartWrapper, google)
						}]}
					/>
					<div className="chart-controls text-center">
						<h5>
							Show:
						</h5>
						<label className="radio-inline" >
							<input type="radio"
								   name="type"
								   value="Decade"
								   checked={this.state.type === "Decade"}
								   onChange={this.changeType}
							/>
							By Decade
						</label>
						<label className="radio-inline" >
							<input type="radio"
								   name="type"
								   value="Year"
								   checked={this.state.type === "Year"}
								   onChange={this.changeType}
							/>
							By Year
						</label>
					</div>
				</div>
			</div>
			{scrollama}
		</div>
		)
	}

	createDecadeToolTip(masters) {
		const years = masters.reduce((years, master) => {
			years[master.year] ? years[master.year].push(master) : years[master.year] = [master]
			return years
		}, {})

		const decade = Object.keys(years).reduce((list, year) => {
			const heading = `<h6 class="text-center">${year} - ${years[year].length} Releases</h6>`
			const masters= years[year].reduce((acc, master) => {
				return acc += `<li>${createArtistLink(master.artists)} - ${createMasterLink(master)}</li>`
			}, "")
			return list += `${heading}<ul>${masters}</ul>`
		}, "")

		return `<div class="decade-tooltip"><div>${decade}</div></div>`
	}
}

export const StyledDecades = injectSheet(styles)(Decades);
