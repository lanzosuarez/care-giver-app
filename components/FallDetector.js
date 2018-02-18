import React, { Component } from "react";
import { Text, View, ScrollView, AsyncStorage, Alert } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";

import moment from "moment";
import update from "immutability-helper";
import FallHistory from "./FallHistory";

import RNFS from "react-native-fs";
import DUMMY_DATA from "./fall_sample_data";
const FALL_DATA_FILENAME = "falldata.txt";

class FallDetector extends Component {
  constructor() {
    super();
  }

  state = {
    history: [],
    contact: "",
    set: false,
    overlayVisible: false
  };

  input = null;

  componentDidMount() {
    AsyncStorage.getItem("contact").then(data => {
      if (data) {
        this.setState({ contact: data, set: true });
      }
    });
  }

  showFall = ({ time, location }) => {
    Alert.alert("Fall Record", `${time} at ${location}`, [
      {
        text: "Ok"
      }
    ]);
  };

  onSetContact = () => {
    const prev = this.state.set;
    if (prev === true) {
      this.setState({ contact: "" });
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
              borderBottomColor: "#ccc",
              borderBottomWidth: 1,
              shadowOffset: { width: 10, height: 10 },
              shadowColor: "black",
              shadowOpacity: 1,
              elevation: 3,
              justifyContent: "flex-start",
              display: "flex",
              marginBottom: 20,
              paddingBottom: 20
            }}
          >
            <View style={{ flex: 1 }}>
              <FormLabel>Emergency Contact Number</FormLabel>
              <FormInput
                ref={contact => (this.input = contact)}
                placeholder="ex: 091239434"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                onPress={this.onSetContact}
                buttonStyle={{
                  borderRadius: 3,
                  margin: 0,
                  backgroundColor: this.state.set ? "#e91022" : "#00aff0"
                }}
                textStyle={{ textAlign: "center" }}
                raised
                title="Set Contact Number"
              />
            </View>
          </View>
          <FallHistory
            showFall={this.showFall}
            fallHistory={this.state.history}
          />
        </ScrollView>
      </View>
    );
  }
}

export default FallDetector;
