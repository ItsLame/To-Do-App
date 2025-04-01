import { StyleSheet } from "react-native";

export var bgMain = "#2f385c";
export var bgSecondary = "#3c4a6b";
export var icon = "#8f9bb3";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgMain,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  form: {
    gap: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  image: {
    width: 200,
    height: 200,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderColor: bgSecondary,
    gap: 10,
    borderWidth: 1,
    borderRadius: 5,
    height: 200,
  },
  bigInput: {
    height: 100,
  },
});
