import React, { Component} from "react"
import {Scrollama, Step} from "react-scrollama"
import classnames from 'classnames'
import {formatNumber, renderReleaseCard} from "./lib"
import {merge} from 'lodash'


// Basic component for a graph and a scrollama sidebar, contains some reusable methods
export class GraphicComponent extends Component {
	backgroundColor = "#062F4F"
	secondaryColor = "#61BAFF"
	tertiaryColor = "#305D80"
	textColor =  "#ffffff"

	type(){
		if (this.props.genre === ""){
			return "All"
		}
		if (["Hip Hop", "Electronic", "Jazz"].includes(this.props.genre)){
			return "Genre"
		}
		return "Style"
	}

    onStepEnter = ({element, data, direction}) => {
		this.setState(data);
	}

	onStepExit = ({element, data, direction}) => {}


	graphicClassNames(){
    	return "graphic col-xs-12 col-md-8 section " + (this.props.offset? "col-md-push-4" : "")
	}

	graphicOptions(options){
		return merge({}, options, {
			options: {
				backgroundColor: this.backgroundColor,
				titleTextStyle: {
					color: this.textColor
				},
				legendTextStyle:{
					color: this.textColor
				},
				hAxis: {
					textStyle:{
						color: this.textColor
					},
					titleTextStyle: {
						color: this.textColor
					}
				},
				vAxis: {
					textStyle:{
						color: this.textColor
					},
					titleTextStyle: {
						color: this.textColor
					}
				},
			}
		})
	}

	createScrollama(stepsData){
		const offset = window.innerWidth > 992 ? 0.45 : 0.9

		const steps = stepsData.map((step, index) => {
			return (
			<Step key={index} data={step.data}>
				<div className={classnames(this.props.classes.step, "step")}>
					{step.paragraphs}
				</div>
			</Step>
		)})

		const classNames = "col-xs-12 col-md-4 scroller" + (this.props.offset? " col-md-pull-8" : "")
        return (
            <div className={classnames(this.props.classes.scroller, classNames)}>
				<Scrollama onStepEnter={this.onStepEnter} onStepExit={this.onStepExit} offset={offset} >
					{steps}
				</Scrollama>
			</div>
        )

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
					${index? index + 1 + ". ": ''} ${artist.artistLink}
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
						return acc + '<div class="col-xs-' + width + ' clearfix">' + renderReleaseCard(e, "", false,  width) + "</div>";
					}, "")}
				</div>
			</div>
		`)
	}
}

export const styles = {
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
		height: '80vh',
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