import React, {Component} from "react"

export class Blue extends Component{
	render(){
		return <span style={{"color": "#5e97f6"}}>{this.props.content}</span>
	}
}

export class Red extends Component{
	render(){
		return <span style={{"color": "#db4437"}}>{this.props.content}</span>
	}
}

export class Artist extends Component{
	render(){
		return <span dangerouslySetInnerHTML={{__html: createArtistLink(this.props.artists)}} />
	}
}

export class Master extends Component{
	render(){
		return <em><span dangerouslySetInnerHTML={{__html: createMasterLink(this.props.master)}} /></em>
	}
}

export function createArtistLink(artists){
	return artists.reduce(function(artistLink, artist, idx){
		const join = idx + 1 < artists.length ? artist.join : ''
		artistLink += `
			<a href="https://www.discogs.com/artist/${artist.id}" target="_blank">
				${artist.name} 
			</a>
			${join} 
		`
		return artistLink
	}, "")
}

export function groupByArtist(masters, createLink=true){
	return masters.reduce((artists, master) => {
		const artistName = createLink? createArtistLink(master.artists) : master.artists.reduce((acc, e) => {
			return (acc + " " + e.name + " " + e.join).trim()
		}, "")
		artists[artistName] ? artists[artistName].push(master) : artists[artistName] = [master]
		return artists
	}, {})
}

export function createMasterLink(master){
	return `<a href="https://www.discogs.com/master/${master.id}" target="_blank">${master.title}</a>`
}

export function renderReleaseCard(master, position, showArtistName, width){
	const rank = position ? position + "." : ""
	const artistName = showArtistName ? createArtistLink(master.artists) + " - " : ""

	return `
		<div class="thumbnail" >
			<img src=${master.images[0].uri150} alt=${master.title} class="release-thumb release-thumb-${width}" />
			<div class=caption">
				<p class="text-center" >
					<span>${rank} ${artistName} ${createMasterLink(master)}</span>
					 (${master.year})
					 <div class="small text-center">
						${renderHavesAndWants(master)}
					</div>
				</p>
			</div>
	</div>`
}

export function renderHavesAndWants(master){
	return `<div>
			<span class="label label-primary">
				Have: ${formatNumber(master.community.have)}
			</span>
			<span class="label label-danger">
				Want: ${formatNumber(master.community.want)}
			</span>
	</div>`
}

export function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

}

export function closeTooltipsOnClicks(chartWrapper, google){
	// Close tooltips / set chart selection to null when click events aren't data points or graph objects
	const chart = chartWrapper.getChart()
	// clear any old listeners that might have been attached previously for performance reasons
	google.visualization.events.removeAllListeners(chart)
	const validTargets = ["point", "bar", "tooltip"]
	google.visualization.events.addListener(chart, "click", e => {
		if (validTargets.every((target) => { return e.targetID.indexOf(target) === -1})){
			chart.setSelection(null)
		}
	})
}

export function get(value, path, defaultValue){
  return String(path).split('.').reduce((acc, v) => {
    try {
      acc = acc[v]
    } catch (e) {
      return defaultValue
    }
    return acc
  }, value)
}

export function pearsonCorrelation(x, y) {
	const mean_x = x.reduce((acc, e) => acc + e, 0) / x.length
	const mean_y = y.reduce((acc, e) => acc + e, 0) / y.length

	const stdev_x = Math.sqrt(x.map(e => Math.pow(e - mean_x, 2)).reduce((acc, e) => acc+e)/x.length)
	const stdev_y = Math.sqrt(y.map(e => Math.pow(e - mean_y, 2)).reduce((acc, e) => acc+e)/y.length)


	return  (x.reduce((acc, _, index) => {
		return acc  + (((x[index] - mean_x) /  stdev_x) * ((y[index] - mean_y) /  stdev_y))
	}, 0) / x.length)
}

export function correlationCopy(correlation){
	if (correlation > 0.9){
		return 'very strong'
	}
	if (correlation > 0.8){
		return 'quite strong'
	}
	if (correlation > 0.7){
		return 'strong'
	}
	if (correlation > 0.5){
		return 'moderate'
	}
	return 'weak'
}


export function queryString(){
    const query = window.location.search.substring(1)
    return query.split("&").reduce((acc, e) => {
    	const [key, value] = e.split("=")
    	acc[key] = decodeURIComponent(value)
		return acc
	}, {})
}
