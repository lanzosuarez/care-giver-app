import React, { Component } from 'react';
import { Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

export class PatientDetails extends Component {
	state = {
		loading: false,
		info: {
			name: '',
			age: '',
			address: ''
		}
	};

	componentDidMount() {
		this.getPatient();
	}

	toggleState = (key) => this.setState({ [key]: !this.state[key] });

	deletePatient = () => {
		// this.toggleState("loading");
		Alert.alert(
			'Wait!',
			'Are you sure you want to delete this patient',
			[
				{ text: 'Cancel' },
				{
					text: 'OK',
					onPress: () => {
						this.setState({
							info: {
								name: '',
								age: '',
								address: ''
							}
						});
						this.toggleState('loading');
						const { currentUser } = firebase.auth();
						firebase
							.database()
							.ref(`/users/${currentUser.uid}/patients/${this.props.patient}`)
							.remove()
							.then((d) => {
								this.toggleState('loading');
								Actions.patients();
							})
							.catch((err) => {
								this.toggleState('loading');
								Alert.alert('Error', 'Something went wrong', [
									{
										text: 'Ok'
									}
								]);
							});
					}
				}
			],
			{ cancelable: false }
		);
	};

	getPatient = () => {
		this.toggleState('loading');
		const { currentUser } = firebase.auth();
		firebase.database().ref(`/users/${currentUser.uid}/patients/${this.props.patient}`).on('value', (snapshot) => {
			this.setState({ loading: false });
			const info =
				snapshot.val() === null
					? {
							name: '',
							age: '',
							address: ''
						}
					: snapshot.val();
			this.setState({ info });
		});
	};

	updateData() {
		this.toggleState('loading');
		const { currentUser } = firebase.auth();
		const { name, age, address } = this.state.info;
		firebase
			.database()
			.ref(`/users/${currentUser.uid}/patients/${this.props.patient}`)
			.set({
				name,
				address,
				age
			})
			.then((d) => {
				this.toggleState('loading');
				this.getPatient();
			})
			.catch((err) => {
				Alert.alert('Error', 'Something went wrong', [
					{
						text: 'Ok'
					}
				]);
			});
	}

	render() {
		const {
			info = {
				name: '',
				age: '',
				address: ''
			}
		} = this.state;
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
					paddingTop: 50
				}}
			>
				<View style={{ flex: 1 }}>
					<FormLabel>Name</FormLabel>
					<FormInput
						onChangeText={(name) =>
							this.setState({
								info: Object.assign(this.state.info, { name })
							})}
						value={info.name}
					/>
					<FormLabel>Address</FormLabel>
					<FormInput
						onChangeText={(address) =>
							this.setState({
								info: Object.assign(this.state.info, { address })
							})}
						value={info.address}
					/>
					<FormLabel>Age</FormLabel>
					<FormInput
						onChangeText={(age) =>
							this.setState({
								info: Object.assign(this.state.info, { age })
							})}
						type
						value={info.age}
					/>
					<Button
						onPress={this.addPatient}
						buttonStyle={{
							backgroundColor: '#7fb902',
							borderRadius: 20,
							marginTop: 15
						}}
						disabled={this.state.loading}
						title={this.state.loading ? 'Saving your patient' : 'Save'}
					/>
					<Button
						onPress={this.deletePatient}
						buttonStyle={{
							backgroundColor: '#e91022',
							borderRadius: 20,
							marginTop: 15,
							marginBottom: 20
						}}
						disabled={this.state.loading}
						title={'Delete Patient'}
					/>
					<View style={{ display: 'flex', marginTop: 20 }}>
						<Button
							disabled={this.state.loading}
							onPress={() =>
								Actions.locationTracker({
									patient: this.props.patient,
									patientDetails: this.state.info
								})}
							buttonStyle={{
								backgroundColor: '#00aff0',
								borderRadius: 20,
								marginTop: 15
							}}
							title={'Location Tracker'}
						/>
						<Button
							disabled={this.state.loading}
							onPress={() =>
								Actions.fallDetector({ patient: this.props.patient, patientDetails: this.state.info })}
							title={'Fall Detector'}
							buttonStyle={{
								backgroundColor: '#00aff0',
								borderRadius: 20,
								marginTop: 15
							}}
						/>
					</View>
				</View>
			</View>
		);
	}
}

export default PatientDetails;
