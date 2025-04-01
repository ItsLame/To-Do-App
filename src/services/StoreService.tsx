import AsyncStorage from "@react-native-async-storage/async-storage";

const TODO_STORE_KEY = "@TaskList";

export default {
  async getTODO() {
    try {
      const taskList = await AsyncStorage.getItem(TODO_STORE_KEY);
      if (taskList !== null) {
        return JSON.parse(taskList);
      }
    } catch (e) {
      console.log("Failed to get TODO list", e);
    }
  },
  async saveTODO(taskList: any) {
    try {
      await AsyncStorage.setItem(TODO_STORE_KEY, JSON.stringify(taskList));
    } catch (e) {
      console.log("Failed to save TODO list", e);
    }
  },
};
