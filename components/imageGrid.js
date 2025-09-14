import { MasonryFlashList } from "@shopify/flash-list";
import { StyleSheet, View } from "react-native";
import { getColumnCount, wp } from "../helpers/common";
import ImageCard from "./imageCard";

const ImageGrid = ({ images, router }) => {
  const columns = getColumnCount();
  return (
    <View>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            columns={columns}
            router={router}
            index={index}
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});

export default ImageGrid;
