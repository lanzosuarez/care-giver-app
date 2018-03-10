import React, { Component } from "react";
import { Text, View, Alert } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import firebase from "firebase";

export class AddPatient extends Component {
  state = {
    loading: false,
    info: {
      name: "",
      age: "",
      address: ""
    }
  };

  addPatient = () => {
    this.setState({ loading: !this.state.loading });
    const { currentUser } = firebase.auth();
    firebase
      .database()
      .ref(`/users/${currentUser.uid}/patients`)
      .push(this.state.info)
      .then(d => {
        this.setState({ loading: !this.state.loading });
        Actions.patients();
      })
      .catch(err => {
        this.setState({ loading: !this.state.loading });
        Alert.alert("Error", "Something went wrong", [
          {
            text: "Ok"
          }
        ]);
      });
  };

  render() {
    const { info } = this.state;
    return (
      <View
        style={{
          flex: 1,
          paddingTop: 50
        }}
      >
        <View style={{ flex: 1 }}>
          <FormLabel>Name</FormLabel>
          <FormInput
            onChangeText={name =>
              this.setState({
                info: Object.assign(this.state.info, { name })
              })
            }
            value={info.name}
          />
          <FormLabel>Address</FormLabel>
          <FormInput
            onChangeText={address =>
              this.setState({
                info: Object.assign(this.state.info, { address })
              })
            }
            value={info.address}
          />
          <FormLabel>Age</FormLabel>
          <FormInput
            onChangeText={age =>
              this.setState({
                info: Object.assign(this.state.info, { age })
              })
            }
            type
            value={info.password}
          />
          <Button
            onPress={this.addPatient}
            buttonStyle={{
              backgroundColor: "#7fb902",
              borderRadius: 20,
              marginTop: 15,
              marginBottom: 20
            }}
            disabled={this.state.loading}
            title={this.state.loading ? "Saving your patient" : "Add"}
          />
        </View>
      </View>
    );
  }
}

export default AddPatient;
