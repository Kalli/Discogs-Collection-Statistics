import React, { Component} from "react"
import {Chart} from "react-google-charts"
import {get, createArtistLink} from "./lib"
import { Scrollama, Step } from 'react-scrollama';
import injectSheet from 'react-jss';
import classnames from 'classnames'

const styles = {
	graphic: {
		position: 'sticky',
		top: '0',
		alignSelf: 'flex-start'
	},
	scroller: {
		flexBasis: '10%',
	},
	step: {
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

const countryCodes = {"AF":"Afghanistan","AX":"Aland Islands","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua And Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia And Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","IO":"British Indian Ocean Territory","BN":"Brunei Darussalam","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","CV":"Cape Verde","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo","CD":"Congo, Democratic Republic","CK":"Cook Islands","CR":"Costa Rica","CI":"Cote D\"Ivoire","HR":"Croatia","CU":"Cuba","CY":"Cyprus","CZ":"Czech Republic","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands (Malvinas)","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard Island & Mcdonald Islands","VA":"Holy See (Vatican City State)","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran, Islamic Republic Of","IQ":"Iraq","IE":"Ireland","IM":"Isle Of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KR":"Korea","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Lao People\"s Democratic Republic","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libyan Arab Jamahiriya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macao","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia, Federated States Of","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","AN":"Netherlands Antilles","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestinian Territory, Occupied","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Reunion","RO":"Romania","RU":"Russian Federation","RW":"Rwanda","BL":"Saint Barthelemy","SH":"Saint Helena","KN":"Saint Kitts And Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre And Miquelon","VC":"Saint Vincent And Grenadines","WS":"Samoa","SM":"San Marino","ST":"Sao Tome And Principe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia And Sandwich Isl.","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SJ":"Svalbard And Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syrian Arab Republic","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad And Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks And Caicos Islands","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"The United Kingdom","US":"The United States","UM":"United States Outlying Islands","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VE":"Venezuela","VN":"Viet Nam","VG":"Virgin Islands, British","VI":"Virgin Islands, U.S.","WF":"Wallis And Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"}

export class ArtistsByCountry extends Component {

	createCountryTooltip(count, countryCode, artists){
		const list = artists.sort((a, b) => a.name.localeCompare(b.name)).reduce((links, artist) => {
			return links += `<li>${createArtistLink([artist])}</li>`
		}, "")

		const countryName = countryCodes[countryCode]? countryCodes[countryCode] : countryCode

		return `<div class="country-tooltip"><h4>${count} artists from ${countryName}</h4><ol>${list}</ol>`
	}

	groupByCountry(artists){
		const artistsByCountry = artists.reduce((countries, artist) => {
			const country = get(artist, "musicbrainz.country", null)
			if (countries.hasOwnProperty(country)){
				countries[country].push(artist)
			}else{
				countries[country] = [artist]
			}
			return countries
		}, {})

		return Object.keys(artistsByCountry).reduce((acc, country) => {
			const count = artistsByCountry[country].length
			const tooltip = this.createCountryTooltip(count, country, artistsByCountry[country])
			acc.push([country, count, tooltip])
			return acc
		}, [])
	}

	onStepEnter = ({element, data, direction}) => {
		element.style.backgroundColor = 'lightgoldenrodyellow';
		this.setState(data);
	}

	onStepExit = ({element, data, direction}) => {
		element.style.backgroundColor = '#fff';
	}

	render() {
		const { classes } = this.props;
		return (
			<div id="artists-by-country" className="col-xs-12">
				<div className={classnames(classes.scroller, "col-xs-12 col-md-4")}>
					<Scrollama onStepEnter={this.onStepEnter} onStepExit={this.onStepExit} offset={0.33}>
						<Step data={{'sort': 'haves-wants'}}>
							<div className={classes.step}>
								<p>
									This chart shows us how where the bands and artists behind the most collected releases are from.
									Unsurprisingly artists from English speaking countries score highly in these charts. I'd imagine this is
									because the United Kingdom and the US dominate popular music in the latter half of the 20th century
									and the beginning of the 21st. Discogs being an American company probably also plays a part in terms of the user base.
								</p>
								<p>
									If you switch between genres this chart changes quite a bit. The United States for example mostly owns hip hop, Germany
									flexes its techno muscle while the UK prevails in drum & bass and dubstep.
								</p>
							</div>
						</Step>
					</Scrollama>
				</div>
				<div className={classnames(classes.graphic, "col-xs-12 col-md-8 section")}>
					<h2>
						Most Collected {this.props.genre} Master Releases - Artists by Country
					</h2>
					<Chart
						height={700}
						className={"center-block"}
						chartType="GeoChart"
						data={
							[
								["Country", "Count", {type: 'string', role: 'tooltip', 'p': {'html': true}}],
								...this.groupByCountry(Object.values(this.props.data.artists))
							]
						}
						options={{
							tooltip: {isHtml: true, trigger: 'selection'},
							width: '100%',
							height: '100%',
							legend: 'none',
							theme: 'material'
						}}
					/>
				</div>
			</div>
		)
	}
}

export const StyledArtistsByCountry = injectSheet(styles)(ArtistsByCountry);
