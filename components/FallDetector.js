import React, { Component } from "react";
import PushNotification from "react-native-push-notification";
import { Text, View, ScrollView, AsyncStorage, Alert } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import moment from "moment";
import update from "immutability-helper";
import FallHistory from "./FallHistory";
import firebase from "firebase";

import RNFS from "react-native-fs";
import DUMMY_DATA from "./fall_sample_data";
const FALL_DATA_FILENAME = "falldata.txt";

class FallDetector extends Component {
  constructor() {
    super();
  }

  state = {
    history: null,
    contact: "",
    set: false,
    overlayVisible: false
  };

  input = null;
  interval = null;

  componentDidMount() {
    AsyncStorage.getItem("contact").then(data => {
      if (data) {
        this.setState({ contact: data, set: true });
      }
    });
    this.setTupData();
    this.getHistory();
  }

  setTupData = async () => {
    await this.createFile();
    this.redDatabyInterval();
  };

  getHistory = () => {
    // this.toggleState("loading");
    const { currentUser } = firebase.auth();
    firebase
      .database()
      .ref(`/users/${currentUser.uid}/patients/${this.props.patient}/history`)
      .on("value", snapshot => {
        // this.toggleState("loading");
        const history = snapshot.val() !== null ? snapshot.val() : {};
        this.setState({ history });
      });
  };

  showNotif = (name, message) => {
    PushNotification.localNotification({
      title: `${name}:Fall Detected`,
      message
    });
  };

  addFall = () => {
    const { currentUser } = firebase.auth();
    firebase
      .database()
      .ref(`/users/${currentUser.uid}/patients/${this.props.patient}/history`)
      .push({
        time: `${moment().format("LL")}, ${moment().format("LT")}`,
        location: this.props.patientDetails.address
      })
      .then(d => {
        // Alert.alert(
        //   "Fall Record",
        //   `${`${moment().format("LL")}, ${moment().format("LT")}`} at ${
        //     this.props.patientDetails.address
        //   }`,
        //   [
        //     {
        //       text: "Ok"
        //     }
        //   ]
        // );
        const message = `${`${moment().format("LL")}, ${moment().format(
          "LT"
        )}`} at ${this.props.patientDetails.address}.
								Patient:${this.props.patientDetails.name}`;
        this.showNotif(this.props.patientDetails.name, message);
        this.getHistory();
      })
      .catch(err => {
        Alert.alert("Error", "Something went wrong", [
          {
            text: "Ok"
          }
        ]);
      });
  };

  createFile = () => {
    var path = RNFS.ExternalStorageDirectoryPath + `/${FALL_DATA_FILENAME}`;
    // write the file
    return RNFS.writeFile(path, DUMMY_DATA, "utf8")
      .then(d => console.log("file written"))
      .catch(err => {
        console.log(err.message);
      });
  };

  redDatabyInterval = () => {
    let counter = 0;
    const interval = window.setInterval(async () => {
      this.readDir();
    }, 60000);
  };

  readDir = () => {
    // get a list of files and directories in the main bundle
    return RNFS.readDir(RNFS.ExternalStorageDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        // console.log("GOT RESULT", result);
        // stat the first file
        return result;
      })
      .then(result => {
        const data_file = result.find(
          ({ name }) => name === FALL_DATA_FILENAME
        );
        if (data_file.isFile()) {
          return RNFS.readFile(data_file.path, "utf8");
        } else {
          return this.createFile();
        }
      })
      .then(contents => {
        if (contents) {
          let records = contents.split("\n");
          if (records) {
            if (records[records.length - 1] === "1") {
              this.addFall();
            }
          }
        }
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };

  showFall = ({ time, location }) => {
    Alert.alert(
      `${this.props.patientDetails.name}:Fall Record`,
      `${time} at ${location}`,
      [
        {
          text: "Ok"
        }
      ]
    );
  };

  onSetContact = () => {
    const prev = this.state.set;
    if (prev === true) {
      this.setState({ contact: "" });
    }
    this.setState({ set: !this.state.set });
  };

  render() {
    console.log(this.state.history);
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
            <Text
              onPress={() => Actions.pop({ patient: this.props.patient })}
              style={{
                fontSize: 18,
                textDecorationLine: "underline",
                paddingLeft: 20,
                marginTop: 10
              }}
            >
              Back
            </Text>
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
          <FallHistory showFall={this.showFall} history={this.state.history} />
        </ScrollView>
      </View>
    );
  }
}

export default FallDetector;
