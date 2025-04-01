import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Image, Alert } from "react-native";
import {
  Text,
  Icon,
  TopNavigation,
  Button,
  Input,
  Datepicker,
} from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-root-toast";
import StoreService from "../services/StoreService";
import { style, icon } from "./TaskStyle";

// Task modal
const Task = ({
  isNew,
  visible,
  setVisible,
  taskList,
  setTaskList,
  id,
  title,
  setTitle,
  description,
  setDescription,
  image,
  setImage,
  date,
  setDate,
  complete,
}: any) => {
  // No permissions request is necessary for launching the image library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setImage(null);
  };

  const handleAdd = () => {
    let newTask = {
      id: taskList.length >= 1 ? taskList[taskList.length - 1].id + 1 : 0,
      title,
      description,
      date,
      image,
      complete: false,
    };
    setTaskList((oldTaskList: any) => [...oldTaskList, newTask]);
  };

  const handleEdit = () => {
    let newTaskList = [...taskList];
    let index = newTaskList.findIndex((task: any) => task.id === id);
    newTaskList[index].title = title;
    newTaskList[index].description = description;
    newTaskList[index].date = date;
    newTaskList[index].image = image;
    setTaskList(newTaskList);
  };

  const handleDelete = () => {
    let newTaskList = taskList.filter((task: any) => task.id !== id);
    StoreService.saveTODO(JSON.stringify(newTaskList)); // Save to AsyncStorage when taskList is updated
    setTaskList(newTaskList);
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={() => {
        setVisible(!visible);
        isNew && handleClear();
      }}
    >
      <TopNavigation
        alignment="center"
        title={isNew ? "New Task" : "Edit Task"}
        accessoryLeft={() => (
          <TouchableOpacity
            onPress={() => {
              setVisible(!visible);
              isNew && handleClear();
            }}
          >
            <Icon style={style.icon} fill={icon} name="close-outline" />
          </TouchableOpacity>
        )}
        accessoryRight={() =>
          isNew ? (
            <></> // Hide save button; doing !isNew && somehow throws out warning
          ) : (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Deleting Task",
                  `Are you sure you want to delete "${title}"?`,
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        handleDelete();

                        // Add a Toast on screen.
                        Toast.show(`Deleted "${title}".`, {
                          duration: Toast.durations.SHORT,
                          position: Toast.positions.TOP,
                          shadow: true,
                          hideOnPress: true,
                        });

                        setVisible(!visible);
                      },
                    },
                  ]
                );
              }}
            >
              <Icon style={style.icon} fill="#DB2C66" name="trash-2-outline" />
            </TouchableOpacity>
          )
        }
      />
      <View style={style.container}>
        <KeyboardAwareScrollView>
          <View style={style.form}>
            <TouchableOpacity style={style.uploadButton} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={style.image} />
              ) : (
                <>
                  <Icon style={style.icon} fill={icon} name="upload" />
                  <Text appearance="hint">Upload photo</Text>
                </>
              )}
            </TouchableOpacity>
            <Input
              label="Title"
              placeholder="e.g., buy milk"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
            <Input
              multiline
              label="Description"
              placeholder="e.g., for my cereal"
              value={description}
              textStyle={style.bigInput}
              onChangeText={(text) => setDescription(text)}
            />
            <Datepicker
              label="Due date"
              date={date}
              onSelect={(nextDate) => setDate(nextDate)}
            />
            <Button
              disabled={title && title.length >= 1 ? false : true}
              status="primary"
              onPress={() => {
                setVisible(!visible);
                isNew ? handleAdd() : handleEdit();
                isNew && handleClear();

                // Add a Toast on screen.
                Toast.show((isNew ? "Added" : "Edited") + ` "${title}".`, {
                  duration: Toast.durations.SHORT,
                  position: Toast.positions.TOP,
                  shadow: true,
                  hideOnPress: true,
                });
              }}
            >
              {isNew ? "Create" : "Save Changes"}
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

// Add task parameters
export const AddTask = ({
  visible,
  setVisible,
  taskList,
  setTaskList,
}: any) => {
  const [image, setImage]: any = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = React.useState(new Date());

  return (
    <Task
      isNew={true}
      visible={visible}
      setVisible={setVisible}
      taskList={taskList}
      setTaskList={setTaskList}
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      image={image}
      setImage={setImage}
      date={date}
      setDate={setDate}
    />
  );
};

// Edit task parameters
export const EditTask = ({
  visible,
  setVisible,
  taskList,
  setTaskList,
  currentTask,
}: any) => {
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [image, setImage]: any = useState(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = React.useState(new Date());
  const [complete, setComplete] = useState(false);

  React.useEffect(() => {
    if (currentTask) {
      setId(currentTask.id);
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setImage(currentTask.image);
      setDate(currentTask.date);
      setComplete(currentTask.complete);
    }
  }, [visible]);

  return (
    <Task
      isNew={false}
      visible={visible}
      setVisible={setVisible}
      taskList={taskList}
      setTaskList={setTaskList}
      id={id}
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      image={image}
      setImage={setImage}
      date={date}
      setDate={setDate}
      complete={complete}
    />
  );
};
