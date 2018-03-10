import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { List, ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons';
import firebase from 'firebase';

export class Patients extends Component {
	state = { patients: {}, loading: false };

	toggleState = (key) => this.setState({ [key]: !this.state[key] });

	componentDidMount() {
		this.toggleState('loading');
		const { currentUser } = firebase.auth();
		firebase.database().ref(`/users/${currentUser.uid}/patients`).on('value', (snapshot) => {
			console.log(snapshot.val());
			this.setState({ loading: false });
			const patients = snapshot.val() !== null ? snapshot.val() : {};
			this.setState({ patients });
		});
	}

	render() {
		return this.state.loading ? (
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
			<View
				style={{
					flex: 1,
					paddingTop: 60
				}}
			>
				<Button
					onPress={() => Actions.addPatient()}
					buttonStyle={{
						backgroundColor: '#7fb902',
						borderRadius: 20,
						marginTop: 15,
						marginBottom: 20
					}}
					title={'Add patient'}
				/>
				<Text style={{ paddingLeft: 20 }}>Patients</Text>
				{Object.keys(this.state.patients).length > 0 ? (
					<View style={{ paddingLeft: 15, paddingRight: 15 }}>
						<List containerStyle={{ marginBottom: 20 }}>
							{Object.keys(this.state.patients).map((key, i) => {
								const l = this.state.patients[key];
								return (
									<ListItem
										key={i}
										title={`${l.name}, ${l.age} yrs. old`}
										leftIcon={{ name: 'account-circle' }}
										rightIcon={{ name: 'remove-red-eye' }}
										subtitle={l.address}
										onPressRightIcon={() => Actions.patientDetails({ patient: key })}
									/>
								);
							})}
						</List>
					</View>
				) : (
					<Text style={{ textAlign: 'center' }}>You dont have any patients</Text>
				)}
			</View>
		);
	}
}
// onPressRightIcon={() => props.showFall(l)}

export default Patients;
