import React, { Component} from "react"
import {Scrollama, Step} from "react-scrollama"
import classnames from 'classnames'


// Basic component for a graph and a scrollama sidebar, contains some reusable methods
export class GraphicComponent extends Component {

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