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


	createScrollama(stepsData){
		const steps = stepsData.map((step) => {
			return (
			<Step data={step.data}>
				<div className={classnames(this.props.classes.step, "step")}>
					{step.paragraphs}
				</div>
			</Step>
		)})

        return (
            <div className={classnames(this.props.classes.scroller, "col-xs-12 col-md-4 col-md-pull-8 scroller")}>
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