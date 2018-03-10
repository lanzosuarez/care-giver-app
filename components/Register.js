import React, { Component } from "react";
import { Text, View, Picker } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import app from "../base";
import firebase from "firebase";

export default class Register extends Component {
  state = {
    loading: false,
    errMsg: "",
    info: {
      email: "",
      password: "",
      type: "1"
    }
  };

  toggleState = key => this.setState({ [key]: !this.state[key] });

  onRegister = () => {
    this.toggleState("loading");
    this.setState({ errMsg: "" });
    const { email, password } = this.state.info;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(d => {
        this.toggleState("loading");
        Actions.login();
        console.log(d);
      })
      .catch(err => {
        this.toggleState("loading");
        this.setState({ errMsg: err.message });
        console.log(err);
      });
  };

  render() {
    const { loading, info: { email, password, type } } = this.state;
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View style={{ flex: 1 }}>
          <FormLabel>Email</FormLabel>
          <FormInput
            value={email}
            onChangeText={email =>
              this.setState({
                info: Object.assign(this.state.info, { email })
              })
            }
            placeholder="sample@gmail.com"
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            value={password}
            onChangeText={password =>
              this.setState({
                info: Object.assign(this.state.info, { password })
              })
            }
            secureTextEntry
          />
          <FormLabel>User Type</FormLabel>
          <Picker
            selectedValue={type}
            style={{ marginLeft: 10, paddingRight: 10 }}
            onValueChange={(type, itemIndex) => {
              this.setState({
                info: Object.assign(this.state.info, { type })
              });
            }}
          >
            <Picker.Item label="Doctor" value="1" />
            <Picker.Item label="Family/Caregiver" value="2" />
          </Picker>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#e91022", textAlign: "center" }}>
              {this.state.errMsg ? this.state.errMsg : ""}
            </Text>
            <Button
              onPress={this.onRegister}
              buttonStyle={{
                borderRadius: 3,
                margin: 0,
                marginTop: 10,
                backgroundColor: "#00aff0"
              }}
              textStyle={{ textAlign: "center" }}
              raised
              disabled={loading}
              title={loading ? "Signing you up ..." : "Sign Up"}
            />
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              Already have an account?
              <Text
                onPress={() => Actions.login()}
                style={{
                  textDecorationLine: "underline",
                  color: "#00aff0",
                  paddingLeft: 5
                }}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
