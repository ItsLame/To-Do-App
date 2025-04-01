import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SafeView = ({ children }: any) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {children}
    </View>
  );
};
