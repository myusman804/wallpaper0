import { Entypo, Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
const ImageScreen = () => {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const item = useLocalSearchParams();
  let uri = item?.webformatURL;
  const fileName = item?.previewURL?.split("/")?.pop();
  const imageUrl = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const onLoad = () => {
    setStatus("");
  };

  const getSize = () => {
    if (Platform.OS === "web") {
      // For web, just constrain by viewport
      return {
        maxWidth: wp(90),
        maxHeight: hp(100),
      };
    }

    // For iOS/Android use aspect ratio calculation
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = wp(92);
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

  const handleDownload = async () => {
    if (Platform.OS == "web") {
      const anchor = document.createElement("a");
      anchor.href = imageUrl;
      anchor.target = "_blank";
      anchor.download = fileName || "download";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      showToast("Download started");
    } else {
      setStatus("downloading");
      let uri = await downloadFile();
      if (uri) showToast("Image downloaded");
    }
  };

  const handleShare = async () => {
    if (Platform.OS == "web") {
      showToast("Link copied");
    } else {
      setStatus("sharing");
      let uri = await downloadFile();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    }
  };

  const downloadFile = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow access to save images"
        );
        return null;
      }

      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      setStatus("");
      console.log("Saved to gallery:", asset.uri);
      return asset.uri;
    } catch (error) {
      console.log("got error: ", error.message);
      setStatus("");
      Alert.alert("Image", error.message);
      return null;
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "top",
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => {
      return (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      );
    },
  };

  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status == "loading" && (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <View
          style={{
            width: "90vw", // take up to 90% of viewport width
            height: "80vh", // take up to 80% of viewport height
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.raduis.xl,
          }}
        >
          <Image
            transition={100}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: theme.raduis.lg, // 👈 add radius here
              overflow: "hidden",
            }}
            source={uri}
            onLoad={onLoad}
            contentFit="contain" // keeps aspect ratio, no overflow
          />
        </View>
      </View>
      <View>
        <View
          style={{
            marginTop: 40,
            flexDirection: "row",
            alignItems: "center",
            gap: 50,
          }}
        >
          <Animated.View entering={FadeInDown.springify()}>
            <Pressable
              style={{
                height: hp(6),
                width: hp(6),
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.4)",
                borderRadius: theme.raduis.lg,
                alignItems: "center",
                borderCurve: "continuous",
              }}
              onPress={() => router.back()}
            >
              <Octicons name="x" size={24} color="white" />
            </Pressable>
          </Animated.View>
          <Animated.View entering={FadeInDown.springify().delay(100)}>
            {status == "downloading" ? (
              <View style={{}}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <Pressable
                onPress={handleDownload}
                style={{
                  height: hp(6),
                  width: hp(6),
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderRadius: theme.raduis.lg,
                  alignItems: "center",
                  borderCurve: "continuous",
                }}
              >
                <Octicons name="download" size={24} color="white" />
              </Pressable>
            )}
          </Animated.View>
          <Animated.View entering={FadeInDown.springify().delay(200)}>
            {status == "sharing" ? (
              <View style={{}}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <Pressable
                onPress={handleShare}
                style={{
                  height: hp(6),
                  width: hp(6),
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderRadius: theme.raduis.lg,
                  alignItems: "center",
                  borderCurve: "continuous",
                }}
              >
                <Entypo name="share" size={22} color="white" />
              </Pressable>
            )}
          </Animated.View>
        </View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
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
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.raduis.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4",
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
});
