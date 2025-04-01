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
  icon: {
    width: 30,
    height: 30,
  },
  iconButton: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: bgSecondary,
    borderRadius: 5,
    padding: 2,
  },
  iconButtonPressed: {
    backgroundColor: bgSecondary,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: bgSecondary,
    borderRadius: 5,
    padding: 2,
  },
  tabIcon: {
    width: 15,
    height: 15,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
  },
  listItem: {
    gap: 15,
  },
  list: {
    height: "90%",
    borderRadius: 5,
  },
  tab: {
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  checkbox: {
    marginLeft: 10,
  },
  bottomSheet: {
    backgroundColor: "#222B45",
  },
});
