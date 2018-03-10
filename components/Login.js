import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import app from '../base';
import firebase from 'firebase';

export default class Login extends Component {
	state = {
		loading: false,
		errMsg: '',
		credential: {
			email: '',
			password: ''
		},
		userCheck: true
	};
	componentDidMount() {
		this.watchForUser();
	}

	componentWillUnmount() {
		this.subscription();
	}

	watchForUser = () => {
		this.subscription = firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				Actions.patients();
			} else {
				console.log('nouser');
				this.setState({ userCheck: false });
			}
		});
	};

	toggleState = (key) => this.setState({ [key]: !this.state[key] });

	onLogin = () => {
		this.toggleState('loading');
		this.setState({ errMsg: '' });
		const { email, password } = this.state.credential;
		console.log(email, password);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((d) => {
				this.toggleState('loading');
				Actions.patients();
				console.log(d);
			})
			.catch((err) => {
				this.toggleState('loading');
				if (err.code === 'auth/network-request-failed') {
					this.setState({ errMsg: 'Please check your internet connection' });
				} else {
					this.setState({ errMsg: 'Wrong username or password' });
				}
				console.log(err);
			});
	};

	render() {
		const { loading, credential } = this.state;

		return this.state.userCheck ? (
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
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<View style={{ flex: 1 }}>
					<FormLabel>Email</FormLabel>
					<FormInput
						onChangeText={(email) =>
							this.setState({
								credential: Object.assign(this.state.credential, { email })
							})}
						value={credential.email}
						placeholder="sample@gmail.com"
					/>
					<FormLabel>Password</FormLabel>
					<FormInput
						onChangeText={(password) =>
							this.setState({
								credential: Object.assign(this.state.credential, { password })
							})}
						value={credential.password}
						secureTextEntry
					/>
					<View style={{ flex: 1 }}>
						<Text style={{ color: '#e91022', textAlign: 'center' }}>
							{this.state.errMsg ? this.state.errMsg : ''}
						</Text>
						<Button
							onPress={this.onLogin}
							buttonStyle={{
								borderRadius: 3,
								margin: 0,
								marginTop: 10,
								backgroundColor: '#00aff0'
							}}
							textStyle={{ textAlign: 'center' }}
							raised
							disabled={loading}
							title={loading ? 'Signing you in ...' : 'Sign in'}
						/>
						<Text style={{ textAlign: 'center', marginTop: 5 }}>
							Do not have an account?
							<Text
								onPress={() => Actions.register()}
								style={{
									textDecorationLine: 'underline',
									color: '#00aff0',
									paddingLeft: 5
								}}
							>
								Sign Up
							</Text>
						</Text>
					</View>
				</View>
			</View>
		);
	}
}
