import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeView } from "../components/CustomView";
import {
  Layout,
  Text,
  Icon,
  TopNavigation,
  Input,
  List,
  ListItem,
  Divider,
  CheckBox,
  Tab,
  TabView,
} from "@ui-kitten/components";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Toast from "react-native-root-toast";
import { AddTask, EditTask } from "../modals/Task";
import StoreService from "../services/StoreService";
import { style, icon } from "./HomeStyle";
import { Filter } from "../modals/Filter";

export default function Home() {
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [taskList, setTaskList] = useState<any[]>([]);
  const [currentTask, setCurrentTask] = useState(taskList[0]);
  const [search, setSearch] = useState("");
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [completedList, setCompletedList] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterModal, setFilterModal] = useState(false);
  const [sortName, setSortName] = useState("");
  const [sortDate, setSortDate] = useState("");

  // Bottom sheet modal reference, variable, and callbacks
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "25%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    index === 1 ? setFilterModal(true) : setFilterModal(false);
  }, []);

  // List item for ui-kitten's List component
  const listItem = ({
    item,
  }: {
    item: {
      id: number;
      title: string;
      description: string;
      date: Date;
      image: any;
      complete: boolean;
    };
  }): React.ReactElement => {
    const targetTask = taskList.find((task) => task.id === item.id);

    return (
      <ListItem
        title={item.title}
        description={
          <Text>
            {/* {item.date && "Due " + item.date.toLocaleDateString("en-GB")} */}
            <Text
              category="c1"
              appearance="hint"
              status={
                item.date.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
                  ? "basic"
                  : item.date.setHours(0, 0, 0, 0) ===
                    new Date().setHours(0, 0, 0, 0)
                  ? "warning"
                  : "danger"
              }
            >
              {item.date &&
                (item.date.setHours(0, 0, 0, 0) >
                new Date().setHours(0, 0, 0, 0)
                  ? "Due "
                  : item.date.setHours(0, 0, 0, 0) ===
                    new Date().setHours(0, 0, 0, 0)
                  ? "Due today "
                  : "Overdue ") + item.date.toLocaleDateString("en-GB")}
            </Text>
          </Text>
        }
        accessoryLeft={() => (
          <CheckBox
            checked={targetTask && targetTask.complete}
            style={style.checkbox}
            onChange={(nextChecked) => {
              if (targetTask) {
                let newTaskList = [...taskList];
                targetTask.complete = nextChecked;
                setTaskList(newTaskList);
                Toast.show(
                  `Marked "${item.title}"` +
                    (nextChecked ? " as done." : " as not done."),
                  {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.TOP,
                    shadow: true,
                    hideOnPress: true,
                  }
                );
              }
            }}
          />
        )}
        accessoryRight={() => (
          <Icon style={style.icon} fill={icon} name="chevron-right" />
        )}
        style={style.listItem}
        onPress={() => {
          setCurrentTask(item);
          setEditTaskModal(true);
        }}
      />
    );
  };

  // Load from AsyncStorage on first render
  React.useEffect(() => {
    StoreService.getTODO().then((storedTODO) => {
      if (storedTODO) {
        // Parse JSON and map dates into Date objects
        let data = JSON.parse(storedTODO);
        data.map((task: any) => {
          task.date = new Date(task.date);
        });

        setTaskList(data);
      }
    });
  }, []);

  // Save to AsyncStorage when new task is added into taskList
  React.useEffect(() => {
    StoreService.saveTODO(JSON.stringify(taskList));
  }, [taskList]);

  React.useEffect(() => {
    // filter search by keyword
    setPendingList(
      taskList.filter(
        (task) => !task.complete && task.title.toLowerCase().includes(search)
      )
    );
    setCompletedList(
      taskList.filter(
        (task) => task.complete && task.title.toLowerCase().includes(search)
      )
    );
  }, [search, taskList]);

  React.useEffect(() => {
    let newTaskList = [...taskList];

    // sort date
    if (sortDate === "asc") {
      newTaskList.sort((taskA, taskB) => {
        if (taskA.date < taskB.date) {
          return -1;
        } else if (taskA.date > taskB.date) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sortDate === "dsc") {
      newTaskList.sort((taskA, taskB) => {
        if (taskA.date > taskB.date) {
          return -1;
        } else if (taskA.date < taskB.date) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    // sort name
    if (sortName === "asc") {
      newTaskList.sort((taskA, taskB) => {
        if (taskA.title < taskB.title) {
          return -1;
        } else if (taskA.title > taskB.title) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sortName === "dsc") {
      newTaskList.sort((taskA, taskB) => {
        if (taskA.title > taskB.title) {
          return -1;
        } else if (taskA.title < taskB.title) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    setPendingList(
      newTaskList.filter(
        (task) => !task.complete && task.title.toLowerCase().includes(search)
      )
    );
    setCompletedList(
      newTaskList.filter(
        (task) => task.complete && task.title.toLowerCase().includes(search)
      )
    );
  }, [sortDate, sortName, taskList]);

  return (
    <BottomSheetModalProvider>
      <SafeView>
        <TopNavigation
          alignment="center"
          title={() => <Text category="h5">To-Do</Text>}
          accessoryRight={() => (
            <TouchableOpacity
              onPress={() => {
                setAddTaskModal(true);
              }}
            >
              <Icon style={style.icon} fill={icon} name="plus-circle-outline" />
            </TouchableOpacity>
          )}
        />

        <View style={style.container}>
          <View style={style.search}>
            <Input
              style={style.searchInput}
              placeholder="Search for a task"
              onChangeText={(text) => {
                setSearch(text.toLowerCase());
              }}
            />
            <TouchableOpacity
              onPress={handlePresentModalPress}
              style={filterModal ? style.iconButtonPressed : style.iconButton}
            >
              <Icon
                style={style.icon}
                fill={icon}
                name={filterModal ? "funnel" : "funnel-outline"}
              />
            </TouchableOpacity>
          </View>

          <TabView
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
            tabBarStyle={style.tab}
          >
            <Tab
              title={`Pending (${pendingList.length})`}
              icon={<Icon fill={icon} name="clock-outline" />}
              style={style.tab}
            >
              <Layout style={style.list}>
                <List
                  style={style.list}
                  data={pendingList}
                  renderItem={listItem}
                  ItemSeparatorComponent={Divider}
                />
              </Layout>
            </Tab>
            <Tab
              title={`Completed (${completedList.length})`}
              icon={
                <Icon
                  style={style.tabIcon}
                  fill={icon}
                  name="done-all-outline"
                />
              }
            >
              <Layout>
                <List
                  style={style.list}
                  data={completedList}
                  renderItem={listItem}
                  ItemSeparatorComponent={Divider}
                />
              </Layout>
            </Tab>
          </TabView>
        </View>

        {/* Modals */}
        <AddTask
          visible={addTaskModal}
          setVisible={setAddTaskModal}
          taskList={taskList}
          setTaskList={setTaskList}
        />
        <EditTask
          visible={editTaskModal}
          setVisible={setEditTaskModal}
          taskList={taskList}
          setTaskList={setTaskList}
          currentTask={currentTask && currentTask}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={style.bottomSheet}
        >
          <Filter
            sortName={sortName}
            setSortName={setSortName}
            sortDate={sortDate}
            setSortDate={setSortDate}
          />
        </BottomSheetModal>
      </SafeView>
    </BottomSheetModalProvider>
  );
}
