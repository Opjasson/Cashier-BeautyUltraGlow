import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context"
import Entypo from "@expo/vector-icons/Entypo";

interface props {
    onPress1: () => void;
    onPress2: () => void;
    onPress3: () => void;
    onPress4: () => void;
    onPress5: () => void;
    onPress6: () => void;
    onPress7: () => void;
    toggleOpen: () => void;
    status?: boolean;
}

const DrawerContent: React.FC<props> = ({
    toggleOpen,
    onPress1,
    onPress2,
    onPress3,
    onPress4,
    onPress5,
    onPress6,
    onPress7,
    status,
}) => {
    return (
        <SafeAreaView style={styles.animatedBox}>
            <View style={styles.sidebarHead}>
                <Ionicons name="restaurant" size={28} color="white" />
                <Text style={styles.sidebarTitle}>Grandian Resto</Text>
            </View>

            <View style={styles.sidebarMain}>
                <TouchableOpacity
                    onPress={onPress1}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        gap: 5,
                    }}>
                    <Text style={styles.sidebarMenu}>Cart</Text>
                    <AntDesign name="shoppingcart" size={27} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onPress2}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        gap: 5,
                    }}>
                    <Text style={styles.sidebarMenu}>Home</Text>
                    <AntDesign name="home" size={27} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onPress3}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        gap: 5,
                        display: status ? "none" : "flex",
                    }}>
                    <Text style={styles.sidebarMenu}>History Pesanan</Text>
                    <Octicons name="history" size={27} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onPress5}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        gap: 5,
                        display: status ? "none" : "flex",
                    }}>
                    <Text style={styles.sidebarMenu}>Atur Product</Text>
                    <Ionicons
                        name="fast-food-outline"
                        size={27}
                        color="black"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onPress6}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        gap: 5,
                        display: status ? "none" : "flex",
                    }}>
                    <Text style={styles.sidebarMenu}>Laporan</Text>
                    <FontAwesome5 name="tasks" size={27} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onPress7}
                    style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        gap: 5,
                        display: status ? "none" : "flex",
                    }}>
                    <Text style={styles.sidebarMenu}>Kelola User</Text>
                    <Entypo name="add-user" size={27} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.tutupSidebar}
                    onPress={onPress4}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "red",
                            backgroundColor: "#FDFFB8",
                            padding: 10,
                        }}>
                        Logout
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.tutupSidebar}
                    onPress={toggleOpen}>
                    <Ionicons
                        name="arrow-back-circle-outline"
                        size={30}
                        color="black"
                    />
                    <Text style={{ fontSize: 18 }}>Tutup</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    animatedBox: {
        flex: 1,
        backgroundColor: "#FFF8F8",
        // borderWidth : 3
    },
    sidebarHead: {
        flexDirection: "row",
        gap: 15,
        backgroundColor: "#D96F32",
        padding: 15,
    },
    sidebarTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "white",
    },
    sidebarMain: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: "50%",
        marginTop: 20,
        padding: 10,
    },
    sidebarMenu: {
        fontSize: 20,
        fontWeight: "800",
    },
    tutupSidebar: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default DrawerContent;
