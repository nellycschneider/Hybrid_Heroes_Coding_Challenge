import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, DataTable, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions } from "./store/inventory";
import { RootState } from "./store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "./App";
import ProductItem from "./ProductItem";

export default (props: StackScreenProps<StackParamList, "Home">) => {
  const fetching = useSelector((state: RootState) => state.inventory.fetching);
  const inventory = useSelector(selectors.selectInventory);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      dispatch(actions.fetchInventory());
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={styles.home}>
      <Appbar.Header>
        <Appbar.Content title="Inventory" titleStyle={{alignSelf: 'center'}}/>
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={() => dispatch(actions.fetchInventory())}
          />
        }
      >
        <SafeAreaView edges={["left", "bottom", "right"]} style={styles.productList}>
          {
            inventory
              .filter((product, index, self) =>
                index === self.findIndex((p) => p.fields["Product Name"] === product.fields["Product Name"])
              )
              .map((product, index) => (
                <ProductItem key={index} product={product} />
              ))
          }
        </SafeAreaView>
      </ScrollView>

      <SafeAreaView style={styles.fab}>
        <FAB
          icon={() => (
            <MaterialCommunityIcons name="barcode" size={24} color="#0B5549" />
          )}
          label="Scan Product"
          onPress={() => props.navigation.navigate("Camera")}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flex: 1,
    alignItems: "center"
  },
  home: {
    flex: 1,
    height: 100,
    backgroundColor: '#FFFFFF'
  },
  container: {
    alignItems: 'center',
    paddingTop: 16,
    flexGrow: 1,
  },
  productList: {
    width: 343,
    marginBottom: 12,
  },
});
