import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  ApplicationProvider,
  Layout,
  IconRegistry,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";

import Home from "./src/screens/Home";

export default () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={eva.dark}>
            <Layout style={{ flex: 1 }}>
              <Home />
            </Layout>
          </ApplicationProvider>
        </SafeAreaProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};
