import { DrawerContent } from "@/app/components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    BackHandler,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuDrawer from "react-native-side-drawer";
import { Add, Filter, Location, Search } from "../../inventory/icons";

interface props {
    navigation: NavigationProp<any, any>;
}

const Home: React.FC<props> = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<string>("makanan");
    const [search, setSearch] = useState<string>();
    const [products, setProducts] = useState<
        {
            id: number;
            nama_product: string;
            deskripsi: string;
            harga_product: number;
            img_product: string;
            kategori_product: string;
            promo: string;
        }[]
    >([]);
    const [id, setId] = useState<number>();
    const [idLogin, setIdLogin] = useState<number>();
    const [user, setUser] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [transaksiId, setTransaksiId] = useState<number>();
    const [dataTransaksi, setDataTransaksi] = useState<
        {
            id: number;
            namaPelanggan: string;
            status: boolean;
            buktiBayar: string;
            cash: number;
        }[]
    >([]);

 // Handle jika user klik tombol kembali handphone
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // kalau mau keluar app:
                Alert.alert("Keluar", "Yakin mau keluar aplikasi?", [
                    { text: "Batal", style: "cancel" },
                    { text: "Ya", onPress: () => BackHandler.exitApp() },
                ]);
                return true; // cegah kembali ke login
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress,
            );

            return () => subscription.remove(); // hapus listener dengan cara baru
        }, []),
    );
    // end handle tombol kembali

    // Get Data Login --------------------------
    const getUserId = async () => {
        const response = await fetch("http://192.168.63.12:5000/login");
        const data = await response.json();
        const token = await AsyncStorage.getAllKeys();
        console.log("TOKENALL",token);
        
        setIdLogin(Object.values(data)[0]?.id);
        setId(Object.values(data)[0]?.userId);
    };

    useEffect(() => {
        getUserId();
    }, []);

    const getAkunLoggin = async () => {
        const response = await fetch(`http://192.168.63.12:5000/user/${id}`);
        const user = await response.json();
        // console.log("login",user);
        setUser(user.role);
        setUsername(user.username);
    };

    const logOut = async () => {
        await fetch(`http://192.168.63.12:5000/login/${idLogin}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        navigation.navigate("LoginPage" as never);
    };

    getAkunLoggin();
    // ------------------------

    const getProducts = async () => {
        const response = await fetch("http://192.168.63.12:5000/product");
        const data = await response.json();
        setProducts(data);
        // console.log(data);
    };

    useEffect(() => {
        getProducts();
    }, []);

    // menfilter data berdasarkan yang diketian di search
    const searchProduct = products.filter((item) => {
        const words = search?.split(" ");
        return words?.some((word) => item.nama_product.includes(word));
    });

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const createTransaksi = async () => {
        const response = await fetch("http://192.168.63.12:5000/transaksi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                namaPelanggan: username,
            }),
        });
        setTransaksiId(2);
        alert("Silahkan Lanjutkan Pesanan");
    };

    const getTransaksi = async () => {
        const response = await fetch("http://192.168.63.12:5000/transaksi");
        const transaksiS = await response.json();
        // console.log(transaksiS.response);
        setDataTransaksi(transaksiS.response);
    };

    useEffect(() => {
        getTransaksi();
    }, []);

    const transaksiNamaPelangganUser = dataTransaksi.filter(
        (item) => item.namaPelanggan === username,
    );
    const transaksiStatusUser = transaksiNamaPelangganUser.filter(
        (item) => item.buktiBayar === null && item.cash === null,
    );

    const handleDeleteStorage = async () => {
        await AsyncStorage.removeItem("infoPesanan");
        navigation.navigate("HistoryPesanan");
    };

    // cek infoPesanan storage
    useEffect(() => {
        const cekToken = async () => {
            const token = await AsyncStorage.getItem("infoPesanan");
            if (username === "Zaki_Waiter" && token !== null) {
                Alert.alert(
                    "Pesanan Telah Selesai",
                    `Atas Nama Pelanggan : ${token}`,
                    [
                        {
                            text: "Okey",
                            onPress: handleDeleteStorage,
                            style: "default",
                        },
                    ],
                );
                console.log(token);
            }
        };
        cekToken();
    });
    // End Cek infoPesanan storage ------

    const sideBarContent = () => {
        return (
            <DrawerContent
                toggleOpen={toggleOpen}
                onPress1={() => navigation.navigate("Cart")}
                onPress2={() => navigation.navigate("Home")}
                onPress3={() => navigation.navigate("HistoryPesanan")}
                // status={user === "kasir" ? false : true}
                onPress4={() => logOut()}
                onPress5={() => navigation.navigate("KelolaProduct")}
                onPress6={() => navigation.navigate("Laporan")}
                onPress7={() => navigation.navigate("KelolaUser")}
            />
        );
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FBFBFB",
                paddingBottom: 20,
                paddingTop: 10,
            }}
        >
            <StatusBar barStyle={"default"} />
            <ScrollView>
                {/* Top menu */}
                <View
                    style={{
                        flexDirection: "row",
                        // marginTop: 30,
                        marginHorizontal: 30,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="menu"
                        size={30}
                        color="black"
                        onPress={() => toggleOpen()}
                    />

                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Image source={Location} />
                        <Text
                            style={{
                                fontWeight: "500",
                                fontSize: 12,
                                marginLeft: 5,
                            }}
                        >
                            Tegal, Indonesia
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                        <FontAwesome name="user" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {/* End top menu */}
                <View style={{ marginHorizontal: 30, marginTop: 15 }}>
                    <Text style={{ fontWeight: "500", fontSize: 14 }}>
                        Good Morning, {username}
                    </Text>
                </View>
                {/* Search tab */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "75%",
                        backgroundColor: "#1111",
                        marginHorizontal: "auto",
                        borderRadius: 30,
                        paddingHorizontal: 20,
                        marginTop: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        <Image source={Search} />
                        <TextInput
                            placeholder="Search..."
                            style={{ width: "100%" }}
                            onChangeText={(text) => setSearch(text)}
                        />
                    </View>
                    <View style={{ justifyContent: "center" }}>
                        <Image source={Filter} />
                    </View>
                </View>
                {/* End Search */}

                {/* Categories */}
               {/* <View style={{ marginLeft: 25, marginTop: 15 }}>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontWeight: "500", marginLeft: 5 }}>
                            Categories
                        </Text>
                    </View>
                    <View style={{ justifyContent: "center" }}>
                        Menu
                        <TouchableOpacity
                            onPress={() => setFilter("makanan")}
                            activeOpacity={0.8}
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                backgroundColor:
                                    filter === "makanan" ? "#2f823a" : "white",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 30,
                                gap: 5,
                                marginRight: 10,
                            }}
                        >
                            <Ionicons
                                name="pizza-outline"
                                size={24}
                                color={filter === "makanan" ? "white" : "black"}
                            />
                            <Text
                                style={{
                                    color:
                                        filter === "makanan"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Makanan
                            </Text>
                        </TouchableOpacity>

                        End Menu

                        Menu
                        <TouchableOpacity
                            onPress={() => setFilter("minuman")}
                            activeOpacity={0.8}
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                backgroundColor:
                                    filter === "minuman" ? "#2f823a" : "white",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 30,
                                gap: 5,
                                marginRight: 10,
                                marginVertical: 5,
                                elevation: 1.5,
                                shadowColor: "black",
                            }}
                        >
                            <SimpleLineIcons
                                name="cup"
                                size={23}
                                color={filter === "minuman" ? "white" : "black"}
                            />
                            <Text
                                style={{
                                    color:
                                        filter === "minuman"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Minuman
                            </Text>
                        </TouchableOpacity>
                        End menu
                    </View>
                </View>  */}
                {/* End Categories */}

                {/* Product */}
                <View style={{ marginTop: 20, marginLeft: 20 }}>
                    {/* button create transaksi */}
                    <TouchableOpacity
                        disabled={
                            transaksiId === 2 || transaksiStatusUser?.length > 0
                                ? true
                                : false
                        }
                        onPress={createTransaksi}
                        activeOpacity={0.8}
                        style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            backgroundColor: "blue",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 30,
                            gap: 5,
                            marginRight: 10,
                            width: "40%",
                        }}
                    >
                        <FontAwesome6
                            name="notes-medical"
                            size={24}
                            color="white"
                        />
                        <Text
                            style={{
                                color: "white",
                            }}
                        >
                            New Transaksi
                        </Text>
                    </TouchableOpacity>
                    {/* end button transaksi */}

                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {/* Product */}
                        {search?.length > 0 && searchProduct.length > 0
                            ? searchProduct.map((a, index) => (
                                  <TouchableOpacity
                                      key={index}
                                      onPress={
                                          transaksiId === 2 ||
                                          transaksiStatusUser?.length > 0
                                              ? () =>
                                                    navigation.navigate(
                                                        "DetailProduct",
                                                        {
                                                            data: a,
                                                            idTrans:
                                                                transaksiStatusUser[0]
                                                                    ?.id,
                                                            idUser: id,
                                                        },
                                                    )
                                              : () =>
                                                    alert(
                                                        "Buat Transaksi Dulu!",
                                                    )
                                      }
                                      activeOpacity={0.7}
                                      style={{
                                          backgroundColor: "white",
                                          borderRadius: 20,
                                          paddingHorizontal: 5,
                                          paddingVertical: 5,
                                          elevation: 5,
                                          shadowColor: "black",
                                          marginRight: 8,
                                          margin: 8,
                                          width: 155,
                                      }}
                                  >
                                      <Image
                                          src={a?.img_product}
                                          style={{
                                              width: 144,
                                              height: 130,
                                              borderRadius: 20,
                                          }}
                                      />
                                      <View
                                          style={{
                                              flexDirection: "row",
                                              justifyContent: "space-between",
                                              marginTop: 10,
                                          }}
                                      >
                                          <View>
                                              <Text
                                                  style={{
                                                      fontWeight: "500",
                                                      fontSize: 14,
                                                  }}
                                              >
                                                  {a.nama_product}
                                              </Text>
                                              <Text
                                                  style={{
                                                      marginTop: 5,
                                                      fontSize: 10,
                                                  }}
                                              >
                                                  {a.deskripsi.substring(0, 30)}
                                                  ...
                                              </Text>
                                          </View>
                                      </View>

                                      <View
                                          style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                          }}
                                      >
                                          <Text>
                                              Rp.
                                              {a.harga_product.toLocaleString()}
                                          </Text>
                                          <Image source={Add} />
                                      </View>
                                  </TouchableOpacity>
                              ))
                            : products
                                  .filter((a) => a.kategori_product === filter)
                                  .map((item, index) => (
                                      <TouchableOpacity
                                          key={index}
                                          onPress={
                                              transaksiId === 2 ||
                                              transaksiStatusUser?.length > 0
                                                  ? () =>
                                                        navigation.navigate(
                                                            "DetailProduct",
                                                            {
                                                                data: item,
                                                                idTrans:
                                                                    transaksiStatusUser[0]
                                                                        ?.id,
                                                                idUser: id,
                                                            },
                                                        )
                                                  : () =>
                                                        alert(
                                                            "Buat Transaksi Dulu!",
                                                        )
                                          }
                                          activeOpacity={0.7}
                                          style={{
                                              backgroundColor: "white",
                                              borderRadius: 20,
                                              paddingHorizontal: 5,
                                              paddingVertical: 5,
                                              elevation: 5,
                                              shadowColor: "black",
                                              marginRight: 8,
                                              margin: 8,
                                              width: 155,
                                          }}
                                      >
                                          <Image
                                              src={item?.img_product}
                                              style={{
                                                  width: 144,
                                                  height: 130,
                                                  borderRadius: 20,
                                              }}
                                          />
                                          <View
                                              style={{
                                                  flexDirection: "row",
                                                  justifyContent:
                                                      "space-between",
                                                  marginTop: 10,
                                              }}
                                          >
                                              <View>
                                                  <Text
                                                      style={{
                                                          fontWeight: "500",
                                                          fontSize: 14,
                                                      }}
                                                  >
                                                      {item.nama_product}
                                                  </Text>
                                                  <Text
                                                      style={{
                                                          marginTop: 5,
                                                          fontSize: 10,
                                                      }}
                                                  >
                                                      {item.deskripsi.substring(
                                                          0,
                                                          30,
                                                      )}
                                                      ...
                                                  </Text>
                                              </View>
                                          </View>

                                          <View
                                              style={{
                                                  flexDirection: "row",
                                                  alignItems: "center",
                                                  justifyContent:
                                                      "space-between",
                                              }}
                                          >
                                              <Text>
                                                  Rp.
                                                  {item.harga_product.toLocaleString()}
                                              </Text>
                                              <Image source={Add} />
                                          </View>
                                      </TouchableOpacity>
                                  ))}

                        {/* End Product */}
                    </ScrollView>
                </View>
                {/* End Product */}

                {/* Special offer */}
                <View
                    style={{
                        marginTop: 20,
                        width: "88%",
                        marginHorizontal: "auto",
                        borderRadius: 10,
                        backgroundColor: "#FAF7F3",
                    }}
                >
                    {/* Product */}
                    <Text style={{ fontWeight: "500", padding: 10 }}>
                        Special Offer
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {products
                            .filter((item, index) => item.promo !== "no")
                            .map((a, index) => (
                                <TouchableOpacity
                                    onPress={
                                        transaksiId === 2 ||
                                        transaksiStatusUser?.length > 0
                                            ? () =>
                                                  navigation.navigate(
                                                      "DetailProduct",
                                                      {
                                                          data: a,
                                                          idTrans:
                                                              transaksiStatusUser[0]
                                                                  ?.id,
                                                          idUser: id,
                                                      },
                                                  )
                                            : () =>
                                                  alert("Buat Transaksi Dulu!")
                                    }
                                    key={index}
                                    activeOpacity={0.7}
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: 20,
                                        paddingHorizontal: 5,
                                        paddingVertical: 5,
                                        elevation: 5,
                                        shadowColor: "black",
                                        marginRight: 8,
                                        margin: 8,
                                        width: 155,
                                    }}
                                >
                                    <Image
                                        src={a.img_product}
                                        style={{
                                            width: 144,
                                            height: 130,
                                            borderRadius: 20,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            marginTop: 10,
                                        }}
                                    >
                                        <View>
                                            <Text
                                                style={{
                                                    fontWeight: "500",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {a.nama_product}
                                            </Text>
                                            <Text
                                                style={{
                                                    marginTop: 5,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {a.deskripsi.substring(0, 35)}
                                                ...
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>
                                            Rp{a.harga_product.toLocaleString()}
                                        </Text>
                                        <Image source={Add} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                    </View>

                    {/* End Product */}
                </View>
                {/* End Special Offer */}
            </ScrollView>

            <MenuDrawer
                open={open}
                position={"left"}
                drawerContent={sideBarContent()}
                drawerPercentage={70}
                animationTime={250}
                overlay={true}
                opacity={0.4}
            ></MenuDrawer>
        </SafeAreaView>
    );
};

export default Home;
