import { apiUrl } from "@/app/config/api";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
}

const RegisterPage: React.FC<props> = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>();

    const handleRegister = async () => {
        if (email && password && confPassword) {
            const response = await fetch(apiUrl("/user"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    role: "user",
                    confPassword: confPassword,
                }),
            });

            if (JSON.stringify(response.status) === "400") {
                setError("Password sesuaikan Confirm Password!");
            } else {
                alert("Berhasil membuat akun");
                navigation.navigate("LoginPage");
            }
        } else {
            setError("Isi dengan lengkap!");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Register</Text>
            </View>
            <View style={styles.body}>
                {/* Icon user bulat */}
                <View style={styles.avatarCircle}>
                    <FontAwesome name="user" size={36} color="#fff" />
                </View>

                {/* Card putih */}
                <View style={styles.card}>
                    <Text
                        style={{
                            color: "red",
                            fontSize: 15,
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </Text>
                    <View style={styles.inputGroup}>
                        <MaterialIcons
                            name="person-outline"
                            size={20}
                            color="gray"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <MaterialIcons
                            name="lock-outline"
                            size={20}
                            color="gray"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <MaterialIcons
                                name={
                                    showPassword
                                        ? "visibility-off"
                                        : "visibility"
                                }
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <MaterialIcons
                            name="lock-outline"
                            size={20}
                            color="gray"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry={!showPassword}
                            value={confPassword}
                            onChangeText={setConfPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <MaterialIcons
                                name={
                                    showPassword
                                        ? "visibility-off"
                                        : "visibility"
                                }
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.forgotText}>Login?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => handleRegister()}
                    >
                        <Text style={styles.signInText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#4BA3A2" },
    header: {
        height: 50,
        backgroundColor: "#3F51B5",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    headerText: { color: "#fff", fontSize: 18 },
    body: {
        flex: 1,
        alignItems: "center",
        paddingTop: 30,
    },
    avatarCircle: {
        backgroundColor: "#3F51B5",
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: -40,
        zIndex: 1,
    },
    card: {
        backgroundColor: "#fff",
        width: "85%",
        borderRadius: 10,
        padding: 20,
        paddingTop: 60,
        elevation: 5,
    },
    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    icon: { marginRight: 10 },
    input: {
        flex: 1,
        height: 40,
    },
    forgotPassword: {
        alignItems: "flex-end",
        marginBottom: 20,
    },
    forgotText: {
        fontSize: 12,
        color: "gray",
    },
    signInButton: {
        backgroundColor: "#F57C00",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    signInText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default RegisterPage;
