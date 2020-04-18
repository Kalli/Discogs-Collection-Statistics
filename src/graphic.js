import React, { Component} from "react"
import {Scrollama, Step} from "react-scrollama"
import classnames from 'classnames'
import {formatNumber, renderReleaseCard} from "./lib"


// Basic component for a graph and a scrollama sidebar, contains some reusable methods
export class GraphicComponent extends Component {

	type(){
		if (this.props.genre === ""){
			return "All"
		}
		if (["Hip Hop", "Electronic"].includes(this.props.genre)){
			return "Genre"
		}
		return "Style"
	}

    onStepEnter = ({element, data, direction}) => {
		element.style.backgroundColor = 'lightgoldenrodyellow';
		this.setState(data);
	}

	onStepExit = ({element, data, direction}) => {
		element.style.backgroundColor = '#fff';
	}

	graphicClassNames(){
    	return "col-xs-12 col-md-8 section " + (this.state.offset? "col-md-push-4" : "")
	}

	createScrollama(stepsData){
		const steps = stepsData.map((step, index) => {
			return (
			<Step key={index} data={step.data}>
				<div className={classnames(this.props.classes.step, "step")}>
					{step.paragraphs}
				</div>
			</Step>
		)})

		const classNames = "col-xs-12 col-md-4 scroller" + (this.state.offset? " col-md-pull-8" : "")
        return (
            <div className={classnames(this.props.classes.scroller, classNames)}>
				<Scrollama onStepEnter={this.onStepEnter} onStepExit={this.onStepExit} offset={0.33}>
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
					${this.state.sort !== index && "haves-wants" ? index + 1 + ". ": ''} ${artist.artistLink}
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