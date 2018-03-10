import React, { Component } from 'react';
import { Text, View, Alert, ActivityIndicator } from 'react-native';
import { List, ListItem } from 'react-native-elements';

class FallHistory extends Component {
	constructor() {
		super();
	}
	render() {
		console.log(this.props.history);
		return this.props.history === null || this.props.history === undefined ? (
			<View
				style={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<ActivityIndicator size="large" color="#00aff0" />
			</View>
		) : (
			<View style={{ paddingLeft: 15, paddingRight: 15 }}>
				<Text>Fall History</Text>
				<List containerStyle={{ marginBottom: 20 }}>
					{Object.keys(this.props.history).length > 0 ? (
						Object.keys(this.props.history).map((key, i) => {
							const l = this.props.history[key];
							return (
								<ListItem
									key={i}
									title={l.time}
									leftIcon={{ name: 'av-timer' }}
									rightIcon={{ name: 'remove-red-eye' }}
									subtitle={l.location}
									onPressRightIcon={() => this.props.showFall(l)}
								/>
							);
						})
					) : (
						<Text style={{ textAlign: 'center', marginTop: 20 }}>
							This patient does not have a fall history
						</Text>
					)}
				</List>
			</View>
		);
	}
}

export default FallHistory;
