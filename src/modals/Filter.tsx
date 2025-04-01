import React, { useEffect } from "react";
import { View } from "react-native";
import { Text, Divider, Radio, RadioGroup } from "@ui-kitten/components";
import { style } from "../modals/FilterStyle";

export const Filter = ({
  sortName,
  setSortName,
  sortDate,
  setSortDate,
}: any) => {
  const [sortNameIndex, setSortNameIndex] = React.useState(0);
  const [sortDateIndex, setSortDateIndex] = React.useState(0);

  useEffect(() => {
    setSortNameIndex(sortName === "" ? 2 : sortName === "asc" ? 0 : 1);
    setSortDateIndex(sortDate === "" ? 2 : sortDate === "asc" ? 0 : 1);
  }, []);

  useEffect(() => {
    setSortDate(sortDateIndex === 0 ? "asc" : sortDateIndex === 1 ? "dsc" : "");
    setSortName(sortNameIndex === 0 ? "asc" : sortNameIndex === 1 ? "dsc" : "");
  }, [sortNameIndex, sortDateIndex]);

  // renders
  return (
    <View style={style.contentContainer}>
      <View style={style.content}>
        <View style={style.buttonGroup}>
          <Text category="s1">Sort name</Text>
          <RadioGroup
            selectedIndex={sortNameIndex}
            onChange={(index) => setSortNameIndex(index)}
            style={style.buttonGroup}
          >
            <Radio>Asc</Radio>
            <Radio>Dsc</Radio>
            <Radio checked={true}>Off</Radio>
          </RadioGroup>
        </View>
        <Divider />
        <View style={style.buttonGroup}>
          <Text category="s1">Sort date</Text>
          <RadioGroup
            selectedIndex={sortDateIndex}
            onChange={(index) => setSortDateIndex(index)}
            style={style.buttonGroup}
          >
            <Radio>Asc</Radio>
            <Radio checked={true}>Dsc</Radio>
            <Radio>Off</Radio>
          </RadioGroup>
        </View>
      </View>
    </View>
  );
};
