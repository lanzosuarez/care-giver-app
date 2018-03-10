import React from 'react';
import { View, Text } from 'react-native';

import { Scene, Router, Actions } from 'react-native-router-flux';

import LocationTracker from './components/LocationTracker';
import FallDetector from './components/FallDetector';
import Login from './components/Login';
import Register from './components/Register';
import Patients from './components/Patients';
import AddPatient from './components/AddPatient';
import PatientDetails from './components/PatientDetails';
import firebase from 'firebase';

import { Icon, Header } from 'react-native-elements';

const TabIcon = ({ selected, title }) => <Text style={{ color: selected ? '#00aff0' : '#ccc' }}>{title}</Text>;

export default (App = (props) => {
	return (
		<Router sceneStyle={{ flex: 1 }}>
			<Scene key="root">
				<Scene hideNavBar={true} key="login" title="Login" component={Login} />
				<Scene hideNavBar={true} key="register" title="Register" component={Register} />
				<Scene
					renderBackButton={() => null}
					hideNavBar={false}
					navigationBarStyle={{
						backgroundColor: '#00aff0',
						borderBottomWidth: 0.2,
						borderBottomColor: '#ccc'
					}}
					onRight={() => {
						firebase.auth().signOut().then((d) => Actions.login());
					}}
					titleStyle={{ color: 'white', fontWeight: 'bold' }}
					rightTitle={'Logout'}
					rightButtonTextStyle={{ color: 'white', fontWeight: 'bold' }}
					key="patients"
					title="Patients"
					component={Patients}
				/>
				<Scene
					navigationBarStyle={{
						backgroundColor: '#00aff0',
						borderBottomWidth: 0.2,
						borderBottomColor: '#ccc'
					}}
					titleStyle={{ color: 'white', fontWeight: 'bold' }}
					key="addPatient"
					title="Add Patient"
					component={AddPatient}
				/>

				<Scene
					navigationBarStyle={{
						backgroundColor: '#00aff0',
						borderBottomWidth: 0.2,
						borderBottomColor: '#ccc'
					}}
					titleStyle={{ color: 'white', fontWeight: 'bold' }}
					key={'patientDetails'}
					title={'Patient Details'}
					component={PatientDetails}
				/>
				<Scene
					renderBackButton={() => null}
					navigationBarStyle={{
						backgroundColor: '#00aff0',
						borderBottomWidth: 0.2,
						borderBottomColor: '#ccc'
					}}
					titleStyle={{ color: 'white', fontWeight: 'bold' }}
					key={'locationTracker'}
					title={'Location Tracker'}
					component={LocationTracker}
				/>
				<Scene
					renderBackButton={() => null}
					navigationBarStyle={{
						backgroundColor: '#00aff0',
						borderBottomWidth: 0.2,
						borderBottomColor: '#ccc'
					}}
					titleStyle={{ color: 'white', fontWeight: 'bold' }}
					key={'fallDetector'}
					title={'Fall Detector'}
					component={FallDetector}
				/>
			</Scene>
		</Router>
	);
});
