import { Entypo, Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";

const ImageScreen = () => {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const item = useLocalSearchParams();
  let uri = item?.webformatURL;

  const onLoad = () => {
    setStatus("");
  };

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;

    const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      // portrait image
      calculatedWidth = calculatedHeight * aspectRatio;
    }

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };
  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status == "loading" && (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <Image
          transition={100}
          style={[styles.image, getSize()]}
          source={uri}
          onLoad={onLoad}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: "row",
          alignItems: "center",
          gap: 50,
        }}
      >
        <View>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
          <Pressable style={styles.button}>
            <Octicons name="download" size={24} color="white" />
          </Pressable>
          <Pressable style={styles.button}>
            <Entypo name="share" size={22} color="white" />
          </Pressable>
        </View>
      </View>
      <Button title="Back" />
    </BlurView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  loading: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    alignItem: "center",
  },
  image: {
    borderRadius: theme.raduis.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  buttons: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2",
    borderRadius: theme.raduis.lg,
    borderCurve: "continuous",
  },
});
