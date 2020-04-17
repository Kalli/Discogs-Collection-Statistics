import {Chart} from 'react-google-charts';
import React from "react"
import injectSheet from 'react-jss';
import classnames from 'classnames'
import AnimateHeight from 'react-animate-height';
import {GraphicComponent, styles} from './graphic.js'

import {closeTooltipsOnClicks, groupByArtist, renderReleaseCard} from "./lib"

const styleGenreMap = {"AOR":"Rock","Aboriginal":"Folk, World, & Country","Abstract":"Electronic","Acid":"Electronic","Acid House":"Electronic","Acid Jazz":"Electronic","Acid Rock":"Rock","Acoustic":"Rock","African":"Folk, World, & Country","Afro-Cuban":"Latin","Afro-Cuban Jazz":"Jazz","Afrobeat":"Jazz","Alternative Rock":"Rock","Ambient":"Electronic","Andalusian Classical":"Folk, World, & Country","Appalachian Music":"Folk, World, & Country","Arena Rock":"Rock","Art Rock":"Rock","Audiobook":"Non-Music","Avant-garde Jazz":"Jazz","Avantgarde":"Rock","Axé":"Latin","Azonto":"Reggae","Bachata":"Latin","Baião":"Latin","Ballad":"Pop","Ballroom":"Electronic","Baltimore Club":"Electronic","Bangladeshi Classical":"Folk, World, & Country","Barbershop":"Pop","Baroque":"Classical","Basque Music":"Folk, World, & Country","Bass Music":"Hip Hop","Bassline":"Electronic","Batucada":"Latin","Bayou Funk":"Funk / Soul","Beat":"Rock","Beatbox":"Hip Hop","Beatdown":"Electronic","Beguine":"Latin","Bengali Music":"Folk, World, & Country","Berlin-School":"Electronic","Bhangra":"Folk, World, & Country","Big Band":"Jazz","Big Beat":"Electronic","Black Metal":"Rock","Bluegrass":"Folk, World, & Country","Blues Rock":"Rock","Bolero":"Latin","Bollywood":"Pop","Bomba":"Latin","Bongo Flava":"Hip Hop","Boogaloo":"Latin","Boogie":"Funk / Soul","Boogie Woogie":"Blues","Boom Bap":"Hip Hop","Bop":"Jazz","Bossa Nova":"Jazz","Bossanova":"Latin","Bounce":"Hip Hop","Brass Band":"Brass & Military","Break-In":"Pop","Breakbeat":"Electronic","Breakcore":"Electronic","Breaks":"Electronic","Brit Pop":"Rock","Britcore":"Hip Hop","Broken Beat":"Electronic","Bubblegum":"Pop","Bubbling":"Reggae","Cajun":"Folk, World, & Country","Calypso":"Reggae","Cambodian Classical":"Folk, World, & Country","Candombe":"Latin","Canzone Napoletana":"Folk, World, & Country","Cape Jazz":"Jazz","Carnatic":"Folk, World, & Country","Catalan Music":"Folk, World, & Country","Celtic":"Folk, World, & Country","Cha-Cha":"Latin","Chacarera":"Folk, World, & Country","Chamamé":"Folk, World, & Country","Champeta":"Latin","Chanson":"Pop","Charanga":"Latin","Chicago Blues":"Blues","Chillwave":"Electronic","Chinese Classical":"Folk, World, & Country","Chiptune":"Electronic","Choral":"Classical","Choro":"Latin","Chutney":"Folk, World, & Country","Classic Rock":"Rock","Classical":"Classical","Cloud Rap":"Hip Hop","Cobla":"Folk, World, & Country","Coldwave":"Rock","Comedy":"Non-Music","Compas":"Latin","Conjunto":"Latin","Conscious":"Hip Hop","Contemporary":"Classical","Contemporary Jazz":"Jazz","Contemporary R&B":"Funk / Soul","Cool Jazz":"Jazz","Copla":"Folk, World, & Country","Corrido":"Latin","Country":"Folk, World, & Country","Country Blues":"Blues","Country Rock":"Rock","Crunk":"Hip Hop","Crust":"Rock","Cuatro":"Latin","Cubano":"Latin","Cumbia":"Latin","Cut-up/DJ":"Hip Hop","DJ Battle Tool":"Hip Hop","Dance-pop":"Electronic","Dancehall":"Reggae","Dangdut":"Folk, World, & Country","Danzon":"Latin","Dark Ambient":"Electronic","Darkwave":"Electronic","Death Metal":"Rock","Deathcore":"Rock","Deathrock":"Rock","Deep House":"Electronic","Deep Techno":"Electronic","Delta Blues":"Blues","Depressive Black Metal":"Rock","Descarga":"Latin","Dialogue":"Non-Music","Disco":"Funk / Soul","Disco Polo":"Electronic","Dixieland":"Jazz","Donk":"Electronic","Doo Wop":"Rock","Doom Metal":"Rock","Doomcore":"Electronic","Downtempo":"Electronic","Dream Pop":"Rock","Drone":"Electronic","Drum n Bass":"Electronic","Dub":"Reggae","Dub Poetry":"Reggae","Dub Techno":"Electronic","Dubstep":"Electronic","Dungeon Synth":"Electronic","EBM":"Electronic","Early":"Classical","East Coast Blues":"Blues","Easy Listening":"Jazz","Education":"Non-Music","Educational":"Children's","Electric Blues":"Blues","Electro":"Hip Hop","Electro House":"Electronic","Electroclash":"Electronic","Emo":"Rock","Enka":"Pop","Ethereal":"Rock","Ethno-pop":"Pop","Euro House":"Electronic","Euro-Disco":"Electronic","Eurobeat":"Electronic","Eurodance":"Electronic","Europop":"Pop","Experimental":"Rock","Fado":"Folk, World, & Country","Favela Funk":"Hip Hop","Field Recording":"Non-Music","Flamenco":"Folk, World, & Country","Folk":"Folk, World, & Country","Folk Metal":"Rock","Folk Rock":"Rock","Forró":"Latin","Free Funk":"Funk / Soul","Free Improvisation":"Jazz","Free Jazz":"Jazz","Freestyle":"Electronic","Funaná":"Folk, World, & Country","Funeral Doom Metal":"Rock","Funk":"Funk / Soul","Funk Metal":"Rock","Funkot":"Electronic","Fusion":"Jazz","Future Jazz":"Electronic","G-Funk":"Hip Hop","Gabber":"Electronic","Gagaku":"Folk, World, & Country","Gamelan":"Folk, World, & Country","Gangsta":"Hip Hop","Garage House":"Electronic","Garage Rock":"Rock","Ghetto":"Electronic","Ghetto House":"Electronic","Ghettotech":"Electronic","Glam":"Rock","Glitch":"Electronic","Go-Go":"Hip Hop","Goa Trance":"Electronic","Gogo":"Funk / Soul","Goregrind":"Rock","Gospel":"Funk / Soul","Goth Rock":"Rock","Gothic Metal":"Rock","Grime":"Hip Hop","Grindcore":"Rock","Griot":"Folk, World, & Country","Grunge":"Rock","Guaguancó":"Latin","Guajira":"Latin","Guaracha":"Latin","Guarania":"Folk, World, & Country","Gypsy Jazz":"Jazz","Hands Up":"Electronic","Happy Hardcore":"Electronic","Hard Beat":"Electronic","Hard Bop":"Jazz","Hard House":"Electronic","Hard Rock":"Rock","Hard Techno":"Electronic","Hard Trance":"Electronic","Hardcore":"Rock","Hardcore Hip-Hop":"Hip Hop","Hardstyle":"Electronic","Harmonica Blues":"Blues","Harsh Noise Wall":"Electronic","Hawaiian":"Folk, World, & Country","Heavy Metal":"Rock","Hi NRG":"Electronic","Highlife":"Folk, World, & Country","Hillbilly":"Folk, World, & Country","Hindustani":"Folk, World, & Country","Hip Hop":"Electronic","Hip-House":"Electronic","Hiplife":"Hip Hop","Honky Tonk":"Folk, World, & Country","Horrorcore":"Hip Hop","House":"Electronic","Hyphy":"Hip Hop","IDM":"Electronic","Illbient":"Electronic","Impressionist":"Classical","Indian Classical":"Folk, World, & Country","Indie Pop":"Pop","Indie Rock":"Rock","Industrial":"Rock","Instrumental":"Hip Hop","Interview":"Non-Music","Italo House":"Electronic","Italo-Disco":"Electronic","Italodance":"Electronic","J-Core":"Electronic","J-pop":"Pop","Jazz-Funk":"Jazz","Jazz-Rock":"Jazz","Jazzdance":"Electronic","Jazzy Hip-Hop":"Hip Hop","Jibaro":"Latin","Joropo":"Latin","Jota":"Folk, World, & Country","Juke":"Electronic","Jump Blues":"Blues","Jumpstyle":"Electronic","Jungle":"Electronic","Junkanoo":"Reggae","K-pop":"Pop","Karaoke":"Pop","Kaseko":"Folk, World, & Country","Kayōkyoku":"Pop","Keroncong":"Folk, World, & Country","Kizomba":"Folk, World, & Country","Klasik":"Folk, World, & Country","Klezmer":"Folk, World, & Country","Korean Court Music":"Folk, World, & Country","Krautrock":"Rock","Kwaito":"Hip Hop","Lambada":"Latin","Lao Music":"Folk, World, & Country","Latin":"Electronic","Latin Jazz":"Jazz","Laïkó":"Folk, World, & Country","Leftfield":"Electronic","Lento Violento":"Electronic","Levenslied":"Pop","Light Music":"Pop","Liscio":"Folk, World, & Country","Lo-Fi":"Rock","Louisiana Blues":"Blues","Lounge":"Rock","Lovers Rock":"Reggae","Luk Krung":"Folk, World, & Country","Luk Thung":"Folk, World, & Country","MPB":"Latin","Makina":"Electronic","Maloya":"Folk, World, & Country","Mambo":"Latin","Marcha Carnavalesca":"Latin","Marches":"Brass & Military","Mariachi":"Latin","Marimba":"Latin","Math Rock":"Rock","Mbalax":"Folk, World, & Country","Medieval":"Classical","Melodic Death Metal":"Rock","Melodic Hardcore":"Rock","Memphis Blues":"Blues","Mento":"Reggae","Merengue":"Latin","Metalcore":"Rock","Miami Bass":"Hip Hop","Military":"Brass & Military","Min'yō":"Folk, World, & Country","Minimal":"Electronic","Minimal Techno":"Electronic","Minneapolis Sound":"Funk / Soul","Mizrahi":"Folk, World, & Country","Mod":"Rock","Modal":"Jazz","Modern":"Classical","Modern Classical":"Electronic","Modern Electric Blues":"Blues","Monolog":"Non-Music","Motswako":"Hip Hop","Mouth Music":"Folk, World, & Country","Movie Effects":"Non-Music","Mugham":"Folk, World, & Country","Musette":"Latin","Music Hall":"Pop","Musical":"Stage & Screen","Musique Concrète":"Electronic","Música Criolla":"Latin","NDW":"Rock","Neo Soul":"Funk / Soul","Neo Trance":"Electronic","Neo-Classical":"Classical","Neo-Romantic":"Classical","Neofolk":"Rock","Nerdcore Techno":"Electronic","New Age":"Electronic","New Beat":"Electronic","New Jack Swing":"Funk / Soul","New Wave":"Rock","No Wave":"Rock","Noise":"Rock","Noisecore":"Rock","Nordic":"Folk, World, & Country","Norteño":"Latin","Novelty":"Pop","Nu Metal":"Rock","Nu-Disco":"Electronic","Nueva Cancion":"Latin","Nueva Trova":"Latin","Nursery Rhymes":"Children's","Néo Kyma":"Pop","Népzene":"Folk, World, & Country","Occitan":"Latin","Oi":"Rock","Opera":"Classical","Operetta":"Classical","Oratorio":"Classical","Ottoman Classical":"Folk, World, & Country","Overtone Singing":"Folk, World, & Country","P.Funk":"Funk / Soul","Pachanga":"Latin","Pacific":"Folk, World, & Country","Parody":"Rock","Pasodoble":"Folk, World, & Country","Persian Classical":"Folk, World, & Country","Philippine Classical":"Folk, World, & Country","Phleng Phuea Chiwit":"Folk, World, & Country","Piano Blues":"Blues","Piedmont Blues":"Blues","Piobaireachd":"Folk, World, & Country","Pipe & Drum":"Brass & Military","Plena":"Latin","Poetry":"Non-Music","Political":"Non-Music","Polka":"Folk, World, & Country","Pop Punk":"Rock","Pop Rap":"Hip Hop","Pop Rock":"Rock","Pornogrind":"Rock","Porro":"Latin","Post Bop":"Jazz","Post Rock":"Rock","Post-Hardcore":"Rock","Post-Metal":"Rock","Post-Modern":"Classical","Post-Punk":"Rock","Power Electronics":"Electronic","Power Metal":"Rock","Power Pop":"Rock","Power Violence":"Rock","Prog Rock":"Rock","Progressive Bluegrass":"Folk, World, & Country","Progressive Breaks":"Electronic","Progressive House":"Electronic","Progressive Metal":"Rock","Progressive Trance":"Electronic","Promotional":"Non-Music","Psy-Trance":"Electronic","Psychedelic":"Funk / Soul","Psychedelic Rock":"Rock","Psychobilly":"Rock","Pub Rock":"Rock","Public Broadcast":"Non-Music","Public Service Announcement":"Non-Music","Punk":"Rock","Quechua":"Latin","Radioplay":"Non-Music","Ragga":"Reggae","Ragga HipHop":"Hip Hop","Ragtime":"Jazz","Ranchera":"Latin","Rapso":"Reggae","Raï":"Folk, World, & Country","Rebetiko":"Folk, World, & Country","Reggae":"Reggae","Reggae Gospel":"Reggae","Reggae-Pop":"Reggae","Reggaeton":"Latin","Religious":"Non-Music","Renaissance":"Classical","Rhythm & Blues":"Funk / Soul","Rhythmic Noise":"Electronic","RnB/Swing":"Hip Hop","Rock & Roll":"Rock","Rock Opera":"Rock","Rockabilly":"Rock","Rocksteady":"Reggae","Romani":"Folk, World, & Country","Romantic":"Classical","Roots Reggae":"Reggae","Rumba":"Latin","Rune Singing":"Folk, World, & Country","Salegy":"Folk, World, & Country","Salsa":"Latin","Samba":"Latin","Samba-Canção":"Latin","Schlager":"Pop","Schranz":"Electronic","Score":"Stage & Screen","Screw":"Hip Hop","Sea Shanties":"Folk, World, & Country","Sephardic":"Folk, World, & Country","Seresta":"Latin","Serial":"Classical","Sermon":"Non-Music","Shoegaze":"Rock","Ska":"Rock","Skiffle":"Rock","Skweee":"Electronic","Sludge Metal":"Rock","Smooth Jazz":"Jazz","Soca":"Reggae","Soft Rock":"Rock","Son":"Latin","Son Montuno":"Latin","Sonero":"Latin","Soukous":"Folk, World, & Country","Soul":"Funk / Soul","Soul-Jazz":"Jazz","Sound Art":"Non-Music","Sound Collage":"Electronic","Sound Poetry":"Non-Music","Soundtrack":"Stage & Screen","Southern Rock":"Rock","Space Rock":"Rock","Space-Age":"Jazz","Spaza":"Hip Hop","Special Effects":"Non-Music","Speech":"Non-Music","Speed Garage":"Electronic","Speed Metal":"Rock","Speedcore":"Electronic","Spoken Word":"Non-Music","Steel Band":"Reggae","Stoner Rock":"Rock","Story":"Children's","Surf":"Rock","Swamp Pop":"Rock","Swing":"Jazz","Swingbeat":"Funk / Soul","Symphonic Rock":"Rock","Synth-pop":"Electronic","Synthwave":"Electronic","Sámi Music":"Folk, World, & Country","Séga":"Folk, World, & Country","Tango":"Latin","Tech House":"Electronic","Tech Trance":"Electronic","Technical":"Non-Music","Techno":"Electronic","Tejano":"Latin","Texas Blues":"Blues","Thai Classical":"Folk, World, & Country","Theme":"Stage & Screen","Therapy":"Non-Music","Thrash":"Rock","Thug Rap":"Hip Hop","Timba":"Latin","Trance":"Electronic","Trap":"Hip Hop","Tribal":"Electronic","Tribal House":"Electronic","Trip Hop":"Hip Hop","Tropical House":"Electronic","Trova":"Latin","Turntablism":"Hip Hop","Twelve-tone":"Classical","UK Funky":"Electronic","UK Garage":"Electronic","Vallenato":"Latin","Vaporwave":"Electronic","Viking Metal":"Rock","Vocal":"Pop","Volksmusik":"Folk, World, & Country","Waiata":"Folk, World, & Country","Western Swing":"Folk, World, & Country","Witch House":"Electronic","Yemenite Jewish":"Folk, World, & Country","Yé-Yé":"Rock","Zamba":"Folk, World, & Country","Zarzuela":"Classical","Zemer Ivri":"Folk, World, & Country","Zouk":"Folk, World, & Country","Zydeco":"Folk, World, & Country","Éntekhno":"Folk, World, & Country"}


export class GenresAndStyles extends GraphicComponent{

	constructor(props) {
		super(props)
		const charts = this.resizeCharts(1)
		const offset = this.props.offset? this.props.offset : false
		this.state = {...charts, ...{selectedGenre: props.genre? props.genre : 'Rock', offset: offset}}
	}

	componentDidMount() {
		// this isn't great but the only way I can figure out a way to add an event handler to the tooltip
		window.showArtistAlbums = function (row, index){
			const element = document.getElementById(`treemap-artist-${row}-${index}`)
			let toggle = element.getElementsByTagName("span")[0]
			if (toggle.className.includes("down")){
				toggle.className = toggle.className.replace("down", "up")
			}else{
				toggle.className = toggle.className.replace("up", "down")
			}
			let list = element.getElementsByTagName("div")[0]
			if (list.className.includes("show")){
				list.className = list.className.replace("show", "hide")
			}else{
				list.className = list.className.replace("hide", "show")
			}
		}
	}

	onStepEnter = ({element, data, direction}) => {
		element.style.backgroundColor = 'lightgoldenrodyellow';
		this.setState(this.resizeCharts(data.state))
	}

	onStepExit = ({element, data, direction}) => {
		element.style.backgroundColor = '#fff';
	}

	generateTooltip(key, values, index, hideArtist){
		const links = hideArtist? '' : this.generateArtistTooltips(groupByArtist(values), index)
		return `
			<div class="chart-tooltip genres-tooltip artist-tooltip">
				<h4>${key} - ${values.length} Releases</h4>
				${links}
			</div>
		`
	}

	resizeCharts(state){
		return {
			showStyles: state !== 1,
			genre: {
				height: state === 1? 800 : 250,
				areaHeight: state === 1? '75%' : '10%',
				direction: state === 1? 1 : -1,
				gridlines: state === 1 ? null : {color: 'transparent'},
				textPosition: state === 1 ? null : 'none'
			}
		}
	}

	generateArtistTooltips(byArtists, row){
		const list = Object.entries(byArtists).sort((a, b) => b[1].length - a[1].length).reduce((links, entry, index) => {
			let width;
			switch (entry[1].length) {
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
			const element = `
				<li id="treemap-artist-${row}-${index}" onclick="showArtistAlbums(${row}, ${index})">
					${entry[0]} - ${entry[1].length} Release${entry[1].length > 1 ? "s" : ""}
					<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
					<div class="hide genres-releases row display-flex releases center-block">
						${entry[1].reduce(function (acc, e){
							return acc +'<div class="col-xs-' + width + '">'+renderReleaseCard(e)+"</div>";
						}, "")}
					</div>
				</li>
				`
			return links += element
		}, "")
		return `<ul>${list}</ul>`
	}

	groupByKey(key, masters){
		const byKey = masters.reduce((accumulator, master) => {
			if (key in master){
				master[key].forEach((item) => {
					const styleForGenre = !["Electronic", "Hip Hop"].includes(this.state.selectedGenre)
					if (key === "genres" || styleForGenre || styleGenreMap[item] === this.state.selectedGenre){
						accumulator[item] ? accumulator[item].push(master) : accumulator[item] = [master]
					}
				})
			}
			return accumulator
		}, {})
		const hideArtists = key === "genres" && this.state.showStyles
		return Object.keys(byKey).reduce((acc, innerKey, index) => {
			const color = (key === "styles" || this.state.showStyles && this.state.selectedGenre === innerKey ) ? '#db4437' : '#5e97f6'
			const style = `fill-color: ${color}`
			const row = [
				innerKey,
				byKey[innerKey].length,
				this.generateTooltip(innerKey, byKey[innerKey], index, hideArtists),
				style
			]
			acc.push(row)
			return acc
		}, []).sort((a, b) => b[1] - a[1])
	}

	clickGenre(chartWrapper, google, genres){

		const chart = chartWrapper.getChart()
		const validTargets = ["point", "bar", "tooltip"]
		// clear any listeners that might have been attached previously for performance reasons
		google.visualization.events.removeAllListeners(chart)

		google.visualization.events.addListener(chart, "click", e => {
			if (e.targetID.indexOf("bar") !== -1 && this.state.showStyles){
				const column = e.targetID.split("#")[2]
				this.setState({selectedGenre: genres[column][0]})
			}
			if (validTargets.every((target) => { return e.targetID.indexOf(target) === -1})){
				// clicking outside of targets, set selection to null
				chart.setSelection(null)
			}else{
				// clicking on a bar, set the selection
				if (e.targetID.indexOf("bar") !== -1){
					const column = e.targetID.split("#")[0]
					chart.setSelection(column)
				}
			}
		})
	}

	renderGenres(genres){
		if (genres.length < 2){
			return ''
		}

		const headers = [
			{id: 'genre', label: 'Genre', type: 'string'},
			{id: 'count', label: 'Number of releases', type: 'number'},
			{type: 'string', role: 'tooltip', 'p': {'html': true}},
			{type: 'string', role: 'style'},
		]
		const max = Math.max(...genres.map(genre => genre[1]))

		return (
			<AnimateHeight height={this.state.genre.height} duration={1500} >
				<Chart
					height={this.state.genre.height}
					toolTip={{fontSize: "14px" }}
					chartType="ColumnChart"
					data={[headers, ...genres]}
					options={{
						vAxis: {
							direction: this.state.genre.direction,
							viewWindow: {max: max},
							gridlines: this.state.genre.gridlines,
							textPosition: this.state.genre.textPosition
						},
						chartArea: {height: this.state.genre.areaHeight, width: '90%', top: '5%'},
						title: `Most Collected ${this.props.genre} Releases by Genre`,
						animation: {duration: 1500},
						bar: {groupWidth: "95%"},
						headerHeight: 15,
						fontColor: "black",
						legend: { position: 'none' },
						tooltip: {isHtml: true, trigger: 'both'},
					}}
					chartEvents={[{
						eventName: "ready",
						callback: ({ chartWrapper, google }) => this.clickGenre(chartWrapper, google, genres)
					}]}
				/>
			</AnimateHeight>
		)
	}

	renderStyles(styles, singleGenre, genre){
		if (!this.state.showStyles && !singleGenre){
			return ''
		}

		const headers = [
			{id: 'genre', label: 'Style', type: 'string'},
			{id: 'count', label: 'Number of releases', type: 'number'},
			{type: 'string', role: 'tooltip', 'p': {'html': true}},
			{type: 'string', role: 'style'}
		]

		const max = Math.max(...styles.map(style => style[1]))
		const height = singleGenre? '80vh' : 500
		const title = singleGenre? genre : this.state.selectedGenre
		return (
			<Chart
				height={height}
				toolTip={{fontSize: "14px" }}
				chartType="ColumnChart"
				data={[headers, ...styles]}
				options={{
					vAxis: {viewWindow: {max: max}},
					title: `Most Collected ${title} Releases by Style`,
					chartArea: {width: '90%', height: '70%', top: '5%'},
					animation: {duration: 1000},
					bar: {groupWidth: "85%"},
					headerHeight: 15,
					fontColor: "black",
					legend: { position: 'none' },
					tooltip: {isHtml: true, trigger: 'both'},
				}}
				chartEvents={[{
					eventName: "ready",
					callback: ({ chartWrapper, google }) => closeTooltipsOnClicks(chartWrapper, google)
				}]}
			/>
		)
	}

	getSteps(classes, genreData, stylesData, selectedGenre){
		if (genreData.length > 1){
			return ([
				{
					data: {state: 1},
					paragraphs: <>
						<p>
							Discogs has a handful of genres for overarching categorization. This chart shows the
							genres of the top 250 most collected master releases. <em>{genreData[0][0]}</em> is
							the genre with most releases, {genreData[0][1]} in total.
						</p>
						<p>
							<em>{genreData[0][0]}</em> dwarfs the other genres but is followed by <em>{genreData[1][0]}</em> (
							{genreData[1][1]} releases) and <em>{genreData[2][0]}</em> ({genreData[2][1]} releases)
						</p>
						<p>
							Hover/click each genre to see the artists and releases associated with it. Note that
							a release can be categorised as belonging to more than one genre so the totals do
							not necessarily add up to 250.
						</p>
					</>
				},
				{
					data: {state: 2},
					paragraphs: <>
						<p>
							Each genre has a number of different styles, meant for more narrow categorization.
							{stylesData.length >0 &&
								<>
								The most common styles for <em>{selectedGenre}</em> are <em>{stylesData[0][0]}</em> (
								{stylesData[0][1]} releases)&nbsp;
								</>
							}
							{stylesData.length > 1 &&
							<>
								and <em>{stylesData[1][0]}</em> ({stylesData[1][1]} releases)
							</>
							}.
						</p>
						<p>
							Again you can click or hover over each style to see the artists and releases associated with it.
						</p>
					</>
				}
			])
		}
		return ([{
			data: {state: 1},
			paragraphs: <>
				<p>
					Each genre has a number of different styles, meant for more narrow categorization
					{stylesData.length > 0 &&
						<>
							. For <em>{selectedGenre}</em> the most common styles
							are <em>{stylesData[0][0]}</em> ({stylesData[0][1]} releases)
						</>
					}
					{stylesData.length > 1 && " "}
					{stylesData.length > 1 &&
						<>
							and <em>{stylesData[1][0]}</em> ({stylesData[1][1]} releases)
						</>
					}
					.
				</p>
				<p>
					You can click or hover over each style to see the artists and releases associated with it.
				</p>
			</>
		}])
	}

	render(){
		const {classes, data, genre} = this.props
		// this is hacky... delete any older existing tooltips
		Array.from(document.getElementsByClassName("genre-tooltip")).forEach(function(e){
			e.parentNode.removeChild(e)
		})

		const singleGenre = genre !== ""

		const genreData = singleGenre? [] : this.groupByKey("genres", data.masters)
		const genres = this.renderGenres(genreData)

		const stylesData = this.groupByKey("styles", data.masters)
		const styles = this.renderStyles(stylesData, singleGenre, genre)
		const steps = this.getSteps(classes, genreData, stylesData, (genre || this.state.selectedGenre))
		const scrollama = this.createScrollama(steps)

		return (
			<div id="genres-and-styles" className={"col-xs-12 col-md-12"}>
				<div className={classnames(classes.graphic, this.graphicClassNames())}>
					<h2>Genres and Styles</h2>
					{genres}
					{styles}
				</div>
				{scrollama}
			</div>
		)
	}
}

export const StyledGenresAndStyles = injectSheet(styles)(GenresAndStyles);
