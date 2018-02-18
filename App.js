import React from "react";
import { View, Text } from "react-native";

import { Scene, Router } from "react-native-router-flux";

import LocationTracker from "./components/LocationTracker";
import FallDetector from "./components/FallDetector";

import { Icon, Header } from "react-native-elements";

const TabIcon = ({ selected, title }) => (
  <Text style={{ color: selected ? "#00aff0" : "#ccc" }}>{title}</Text>
);

export default (App = props => {
  return (
    <Router sceneStyle={{ flex: 1 }}>
      <Scene key="root">
        <Scene
          key="tabbar"
          tabs
          tabBarStyle={{ backgroundColor: "#FFFFFF", borderTopWidth: 0.2 }}
        >
          <Scene
            navigationBarStyle={{
              backgroundColor: "#00aff0",
              borderBottomWidth: 0.2,
              borderBottomColor: "#ccc"
            }}
            titleStyle={{ color: "white", fontWeight: "bold" }}
            icon={TabIcon}
            key={"locationTracer"}
            title={"Location Tracker"}
            component={LocationTracker}
          />
          <Scene
            navigationBarStyle={{
              backgroundColor: "#00aff0",
              borderBottomWidth: 0.2,
              borderBottomColor: "#ccc"
            }}
            initial
            titleStyle={{ color: "white", fontWeight: "bold" }}
            icon={TabIcon}
            key={"fallDetector"}
            title={"Fall Detector"}
            component={FallDetector}
          />
        </Scene>
      </Scene>
    </Router>
  );
});
