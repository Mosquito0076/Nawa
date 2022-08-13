import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChangeFeedScreen from "./homescreen/ChangeFeedScreen";
import NewFeedScrren from './homescreen/NewFeedScreen';
import Main from './homescreen/Main'

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          title: "피드"
        }}
      />

      <Stack.Screen
        name="NewFeedScrren"
        component={NewFeedScrren}
      />

      <Stack.Screen
        name="ChangeFeedScreen"
        component={ChangeFeedScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeScreen;
