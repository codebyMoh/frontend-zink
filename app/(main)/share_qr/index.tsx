// import { AntDesign } from "@expo/vector-icons";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import Octicons from "@expo/vector-icons/Octicons";
// import * as MediaLibrary from "expo-media-library";
// import { router } from "expo-router";
// import * as Sharing from "expo-sharing";
// import { useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import QRCodeSvg from "react-native-qrcode-svg";
// import Toast from "react-native-toast-message";
// import ViewShot from "react-native-view-shot";

// export default function ShareQRCodeScreen() {
//   const walletAddress = "0xE947D41FC4459818f8697AdAdf0e5C4606BB5f73";
//   const userName = "meetdesai10";
//   const [isDownloading, setIsDownloading] = useState(false);
//   const viewShotRef = useRef<string | any>(null);

//   const handleDownloadQR = async () => {
//     try {
//       setIsDownloading(true);
//       const uri = await viewShotRef.current.capture();

//       await MediaLibrary.requestPermissionsAsync();
//       await MediaLibrary.saveToLibraryAsync(uri);

//       Toast.show({
//         type: "success",
//         text1: "QR Downloaded",
//         text2: "Saved to gallery",
//       });
//     } catch (error) {
//       console.log("Error saving QR:", error);
//     } finally {
//       setIsDownloading(false); // back to icon
//     }
//   };

//   const handleShareQR = async () => {
//     try {
//       const uri = await viewShotRef.current.capture();
//       await Sharing.shareAsync(uri);
//     } catch (error) {
//       console.log("Error sharing QR:", error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <TouchableOpacity style={styles.backButton}>
//         <AntDesign
//           name="arrowleft"
//           size={28}
//           color="black"
//           onPress={() => router.back()}
//         />
//         {isDownloading ? (
//           <ActivityIndicator size={24} color="black" />
//         ) : (
//           <Octicons
//             onPress={handleDownloadQR}
//             name="download"
//             size={24}
//             color="black"
//           />
//         )}
//       </TouchableOpacity>

//       <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
//         <View style={styles.card}>
//           <Text style={styles.userName}>{userName}</Text>
//           <View style={styles.qrContainer}>
//             <QRCodeSvg
//               value={walletAddress}
//               size={220}
//               color="black"
//               backgroundColor="white"
//               logo={require("../../../assets/images/logos/Zink-Qr-Logo.png")}
//               logoSize={60}
//               logoMargin={3}
//               logoBackgroundColor="white"
//               logoBorderRadius={30}
//             />
//           </View>

//           <Text style={styles.walletText}>Id: 97AdAdf0e5C4606BB5f7</Text>
//         </View>
//       </ViewShot>

//       {/* Bottom Buttons */}
//       <View style={styles.bottomButtons}>
//         <TouchableOpacity
//           style={styles.scannerButton}
//           onPress={() => router.push("/scan_qr")}
//         >
//           <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
//           <Text style={styles.scannerButtonText}>Open scanner</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.shareButton} onPress={handleShareQR}>
//           <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
//           <Text style={styles.shareButtonText}>Share QR code</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     justifyContent: "space-between",
//   },
//   backButton: {
//     padding: 10,
//     marginTop: 20,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   card: {
//     backgroundColor: "#f9f9f9",
//     borderRadius: 16,
//     alignItems: "center",
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 20,
//   },
//   qrContainer: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   walletText: {
//     fontSize: 12,
//     color: "#555",
//     textAlign: "center",
//   },
//   bottomButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   shareButton: {
//     width: "45%",
//     display: "flex",
//     flexDirection: "row",
//     gap: 3,
//     justifyContent: "center",
//     backgroundColor: "#5abb5eff",
//     borderRadius: 30,
//     padding: 12,
//     marginBottom: 8,
//     marginHorizontal: 5,
//     paddingVertical: 15,
//     alignItems: "center",
//   },
//   shareButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#fff",
//   },
//   scannerButton: {
//     width: "45%",
//     display: "flex",
//     flexDirection: "row",
//     gap: 5,
//     justifyContent: "center",
//     borderColor: "#f0f0f0",
//     borderWidth: 3,
//     borderRadius: 30,
//     padding: 12,
//     marginBottom: 8,
//     marginHorizontal: 5,
//     paddingVertical: 15,
//     alignItems: "center",
//   },
//   scannerButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#000",
//   },
// });
