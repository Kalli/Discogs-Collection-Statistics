import React, { Component} from "react"

export class GenreDropdown extends Component {

    constructor(props) {
        super(props)
        this.state = {
        	genres: props.genres,
            genre: props.genre
        }
    }

    render() {
        return (
            <div className={"form-group"}>
                <label htmlFor="">
                    Select genre or style:
                    <select
                        value={this.props.genre}
                        onChange={this.props.changeHandler}
                        className={"form-control"}
                    >
                        {this.props.genres.map((genre) => this.renderGenre(genre[1], genre[0]))}
                    </select>
                </label>
            </div>
        )
    }

    renderGenre (value, name) {
        const disabled = value === ''
        return (
            <option
                value={value}
                disabled={disabled}
                key={name}
            >
            {name}
            </option>
        )
	}
}