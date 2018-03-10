import React, { Component } from 'react';
import { Text, View, ScrollView, processColor, AsyncStorage } from 'react-native';

import { Actions } from 'react-native-router-flux';

import { Button, FormLabel, FormInput } from 'react-native-elements';
import update from 'immutability-helper';
import { LineChart } from 'react-native-charts-wrapper';
import RNFS from 'react-native-fs';
import DUMMY_DATA from './location_sample_data';

const LOCATION_DATA_FILENAME = 'locationdata.txt';

const distanceFormula = (firstPoints = { x: 0, y: 0 }, secondPoints = { x: 0, y: 0 }) => {
	const { x: xFirst, y: yFirst } = firstPoints;
	const { x: xSec, y: ySec } = secondPoints;

	const computedX = Math.pow(xSec - xFirst, 2);
	const computedY = Math.pow(ySec - yFirst, 2);

	return Number(Math.sqrt(computedX + computedY).toFixed(2));
};

const randomData = (x) => {
	let randNum = Math.random() * 200;
	randNum += 20;
	return {
		x,
		y: Math.floor(randNum)
	};
};

class LocationTracker extends Component {
	constructor() {
		super();
	}
	state = {
		goal: 0,
		set: false,
		data: {},
		legend: {
			enabled: true,
			textColor: processColor('black'),
			textSize: 12,
			position: 'BELOW_CHART_RIGHT',
			form: 'SQUARE',
			formSize: 10,
			xEntrySpace: 10,
			yEntrySpace: 5,
			formToTextSpace: 5,
			wordWrapEnabled: true,
			maxSizePercent: 0.5,
			custom: {
				colors: [ processColor('#8fbf28'), processColor('black') ],
				labels: [ 'Y:Distance Traveled', 'X: Time' ]
			}
		},
		marker: {
			enabled: true,
			digits: 2,
			backgroundTint: processColor('teal'),
			markerColor: processColor('white'),
			textColor: processColor('black')
		},
		xAxis: {
			granularityEnabled: true,
			granulatiry: 1,
			axisMinimum: 0
		},
		yAxis: {
			granularityEnabled: true,
			granulatiry: 1,
			axisMinimum: 0
		}
	};

	componentDidMount() {
		AsyncStorage.getItem('goal').then((data) => {
			if (data) {
				this.setState({ goal: data, set: true });
			}
			// this.setDataByInterval();
			this.setTupData();
		});
	}

	setTupData = async () => {
		await this.createFile();
		this.setDataByInterval();
	};

	readDir = () => {
		// get a list of files and directories in the main bundle
		return RNFS.readDir(RNFS.ExternalStorageDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
			.then((result) => {
				// console.log("GOT RESULT", result);
				// stat the first file
				return result;
			})
			.then((result) => {
				const data_file = result.find(({ name }) => name === LOCATION_DATA_FILENAME);
				if (data_file.isFile()) {
					return RNFS.readFile(data_file.path, 'utf8');
				} else {
					return this.createFile();
				}
			})
			.then((contents) => {
				let coordinates = contents.split('\n');
				let mappedCoords = coordinates.map((coord) => {
					const [ x, y ] = coord.split(', ');
					return {
						x: Number(x),
						y: Number(y)
					};
				});
				let computedDatas = mappedCoords.map((coord, index) => {
					if (index !== mappedCoords.length - 1) {
						return distanceFormula(coord, mappedCoords[index + 1]);
					}
				});
				computedDatas.pop();
				return computedDatas;
			})
			.catch((err) => {
				console.log(err.message, err.code);
			});
	};

	createFile = () => {
		var path = RNFS.ExternalStorageDirectoryPath + `/${LOCATION_DATA_FILENAME}`;
		// write the file
		return RNFS.writeFile(path, DUMMY_DATA, 'utf8').then((d) => console.log('file written')).catch((err) => {
			console.log(err.message);
		});
	};

	setDataByInterval = async () => {
		let counter = 0;
		const interval = window.setInterval(async () => {
			let datas = await this.readDir();
			datas = datas.map((data, index) => ({ x: index, y: data }));
			if (counter !== datas.length - 1) {
				this.setData(counter, datas);
				counter += 1;
			}
		}, 1000);
	};

	setData = (counter, datas) => {
		const stateValues = this.state.data.dataSets;
		let check = stateValues ? stateValues[0].values : [];
		const newValues = [ ...check, datas[counter] ];
		const dataSets = [
			{
				values: newValues,
				label: 'Distance Traveled',
				config: {
					lineWidth: 2,
					drawCircles: true,
					highlightColor: processColor('#8fbf28'),
					color: processColor('#8fbf28'),
					drawFilled: true,
					fillColor: processColor('#8fbf28'),
					fillAlpha: 60,
					valueTextSize: 10
				}
			}
		];
		this.setDataSets(dataSets);
	};

	setDataSets = (dataSets) => {
		this.setState(
			update(this.state, {
				data: {
					$set: {
						dataSets
					}
				}
			})
		);
	};

	travelRecord = () => {
		if (this.state.data.dataSets) {
			const dataSets = [ ...this.state.data.dataSets ];
			return dataSets[0].values
				.reduce((acc, curr) => {
					return acc + curr.y;
				}, 0)
				.toFixed(2);
		} else {
			return `0.0`;
		}
	};

	handleSelect(event) {
		let entry = event.nativeEvent;
		if (entry == null) {
			this.setState({ ...this.state, selectedEntry: null });
		} else {
			this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
		}
	}

	setGoal = (goal) => {
		const regex = /^[0-9]+$/;
		if (regex.test(goal) || goal === '') {
			this.setState({ goal });
			AsyncStorage.setItem('goal', goal);
		}
	};

	onSetGoal = () => {
		const prev = this.state.set;
		if (prev === true) {
			this.setState({ goal: 0 });
		}
		this.setState({ set: !this.state.set });
	};

	render() {
		return (
			<View
				style={{
					flex: 1,
					paddingTop: 50
				}}
			>
				<ScrollView style={{ flex: 1, marginBottom: 60 }}>
					<View
						style={{
							borderBottomColor: '#ccc',
							borderBottomWidth: 1,
							shadowOffset: { width: 10, height: 10 },
							shadowColor: 'black',
							shadowOpacity: 1,
							elevation: 3,
							justifyContent: 'flex-start',
							display: 'flex',
							marginBottom: 20,
							paddingBottom: 20
						}}
					>
						<Text
							onPress={() => Actions.pop({ patient: this.props.patient })}
							style={{ fontSize: 18, textDecorationLine: 'underline', paddingLeft: 20, marginTop: 10 }}
						>
							Back
						</Text>
						<View style={{ flex: 1 }}>
							<FormLabel>Goal</FormLabel>
							<FormInput
								value={String(this.state.goal)}
								onChangeText={this.setGoal}
								placeholder="Set your goal"
							/>
						</View>
						<View style={{ flex: 1 }}>
							<Button
								onPress={this.onSetGoal}
								buttonStyle={{
									borderRadius: 3,
									margin: 0,
									backgroundColor: this.state.set ? '#e91022' : '#00aff0'
								}}
								textStyle={{ textAlign: 'center' }}
								raised
								title={this.state.set ? 'Change' : 'Set'}
							/>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							paddingTop: 0,
							paddingLeft: 10,
							paddingRight: 10,
							paddingBottom: 10
						}}
					>
						<Text>History</Text>
						<LineChart
							style={{ flex: 1, minHeight: 330 }}
							data={this.state.data}
							chartDescription={{ text: '' }}
							legend={this.state.legend}
							marker={this.state.marker}
							xAxis={this.state.xAxis}
							drawGridBackground={false}
							borderColor={processColor('teal')}
							borderWidth={1}
							drawBorders={true}
							touchEnabled={true}
							dragEnabled={true}
							scaleEnabled={true}
							scaleXEnabled={true}
							scaleYEnabled={true}
							pinchZoom={true}
							doubleTapToZoomEnabled={true}
							dragDecelerationEnabled={true}
							dragDecelerationFrictionCoef={0.99}
							keepPositionOnRotation={false}
							onSelect={this.handleSelect.bind(this)}
							onChange={(event) => console.log(event.nativeEvent)}
						/>
						<View style={{ display: 'flex', marginTop: 15, marginBottom: 15 }}>
							<Text>Total Distance Travelled: {this.travelRecord()} m</Text>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

export default LocationTracker;
