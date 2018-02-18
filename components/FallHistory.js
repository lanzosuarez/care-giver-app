import React from "react";
import { Text, View, Alert } from "react-native";
import { List, ListItem } from "react-native-elements";

const FallHistory = props => {
  const list = [
    {
      time: "December 12, 2015 Wed 12:00 am",
      location: "Manila, Philippines",
      icon: "av-timer"
    },
    {
      time: "December 12, 2015 Wed 12:00 am",
      location: "Manila, Philippines",
      icon: "av-timer"
    },
    {
      time: "December 12, 2015 Wed 12:00 am",
      location: "Manila, Philippines",
      icon: "av-timer"
    }
  ];
  return (
    <View style={{ paddingLeft: 15, paddingRight: 15 }}>
      <Text>Fall History</Text>
      <List containerStyle={{ marginBottom: 20 }}>
        {list.map((l, i) => (
          <ListItem
            key={i}
            title={l.time}
            leftIcon={{ name: l.icon }}
            rightIcon={{ name: "remove-red-eye" }}
            subtitle={l.location}
            onPressRightIcon={() => props.showFall(l)}
          />
        ))}
      </List>
    </View>
  );
};

export default FallHistory;
