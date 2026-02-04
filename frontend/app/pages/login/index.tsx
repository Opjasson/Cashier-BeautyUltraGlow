import { doctor } from "@/app/inventory/images";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface props {
    navigation: NavigationProp<any, any>;
}

const LoginPage: React.FC<props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();

    const [data, setData] = useState([]);

    const getUserId = async () => {
        try {
            const response = await fetch("http://192.168.138.220:5000/login");
            const datas = await response.json();
            setData(datas); // update state
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // 1. Ambil data saat komponen pertama kali muncul
    useEffect(() => {
        getUserId();
    }, []);

    // 2. Pantau perubahan pada `data`
    useEffect(() => {
        if (data.length > 0) {
            navigation.navigate("Home"); // Arahkan ke MainApp jika sudah login
        }
    }, [data]);

    const handleLogin = async () => {
        if (email && password) {
            const response = await fetch("http://192.168.138.220:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const json = await response.json();

            if (JSON.stringify(response.status) === "401") {
                setError("Email atau password salah!");
            } else {
                navigation.navigate("Home", { data: json.response });
            }
        } else {
            setError("Isi email dan password!");
        }
    };

    return (
        <ScrollView>
            <StatusBar barStyle={"light-content"} backgroundColor={"#1F1F1F"} />
            <View style={styles.containerForm}>
                <View style={styles.headLogin}>
                    <Text style={styles.headLoginText1}>Halaman Login</Text>
                    <Image style={{height: 250, width: 250}} source={doctor} />
                </View>
                <Text style={styles.textLabel}>Email</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    keyboardType="email-address"
                    placeholder="Masukan email anda"
                    onChangeText={(text) => setEmail(text)}
                />

                <Text style={styles.textLabel}>Password</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    keyboardType="default"
                    secureTextEntry
                    placeholder="Masukan password anda"
                    onChangeText={(text) => setPassword(text)}
                />

                <Text style={error ? styles.errorMsg : styles.hidden}>
                    {error}
                </Text>
            </View>
            {/* End Form */}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{ color: "white" }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buatAkun}
                onPress={() => navigation.navigate("CekEmail")}>
                <Text>Lupa password akun.</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    containerForm: {
        paddingHorizontal: 15,
        paddingTop: 80,
    },
    headLogin: {
        alignItems: "center",
        marginBottom: 40,
    },
    headLoginText1: {
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 10,
        color: "#a5aaaa",
        alignSelf: "flex-start"
    },
    headLoginText2: {
        fontSize: 20,
        fontWeight: "light",
    },
    button: {
        backgroundColor: "#2171c6",
        width: "80%",
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 9,
        marginTop: 20,
        marginHorizontal: "auto",
    },
    buatAkun: {
        width: "80%",
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 9,
        marginHorizontal: "auto",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 30,
    },
    textLabel: {
        fontWeight: "bold",
        fontSize: 18,
        paddingHorizontal: 3,
    },
    errorMsg: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
    hidden: {
        display: "none",
    },
});

export default LoginPage;
