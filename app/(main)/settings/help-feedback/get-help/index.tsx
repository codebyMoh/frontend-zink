import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface HelpIssueProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

const HelpIssue: React.FC<HelpIssueProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.issueOption} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.issueContent}>
      <Text style={styles.issueTitle}>{title}</Text>
    </View>
    <View style={styles.iconContainer}>
      {icon}
    </View>
  </TouchableOpacity>
);

export default function GetHelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get help</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Text style={styles.questionText}>What issues are you having?</Text>
        
        <View style={styles.issuesContainer}>
          <HelpIssue
            title="Payment issue"
            icon={
              <View style={styles.paymentIcon}>
                <Image 
                  source={require('../../../../../assets/images/token/usdc.png')} 
                  style={styles.usdcImage}
                  resizeMode="contain"
                />
                <AntDesign name="close" size={12} color="#4285F4" style={styles.closeIcon} />
              </View>
            }
            onPress={() => {
              // Handle payment issue navigation
            }}
          />
          
          <HelpIssue
            title="Cancel a payment"
            icon={
              <View style={styles.cancelIcon}>
                <Image 
                  source={require('../../../../../assets/images/token/usdc.png')} 
                  style={styles.usdcImage}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="cancel" size={12} color="#4285F4" style={styles.overlayIcon} />
              </View>
            }
            onPress={() => {
              // Handle cancel payment navigation
            }}
          />
          
          <HelpIssue
            title="Report fraud or scam"
            icon={
              <View style={styles.fraudIcon}>
                <MaterialCommunityIcons name="shield-alert" size={20} color="#4285F4" />
              </View>
            }
            onPress={() => {
              // Handle fraud report navigation
            }}
          />
          
          <HelpIssue
            title="Missing reward"
            icon={
              <View style={styles.rewardIcon}>
                <MaterialCommunityIcons name="help-circle" size={20} color="#4285F4" />
              </View>
            }
            onPress={() => {
              // Handle missing reward navigation
            }}
          />
          
          <HelpIssue
            title="Did not receive cashback"
            icon={
              <View style={styles.cashbackIcon}>
                <Image 
                  source={require('../../../../../assets/images/token/usdc.png')} 
                  style={styles.usdcImage}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="check" size={12} color="#4285F4" style={styles.checkIcon} />
              </View>
            }
            onPress={() => {
              // Handle cashback issue navigation
            }}
          />
          
          <HelpIssue
            title="Referral issue"
            icon={
              <View style={styles.referralIcon}>
                <MaterialCommunityIcons name="help-circle" size={20} color="#4285F4" />
              </View>
            }
            onPress={() => {
              // Handle referral issue navigation
            }}
          />
          
          <HelpIssue
            title="Other issues"
            icon={
              <View style={styles.otherIcon}>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color="#4285F4" />
              </View>
            }
            onPress={() => {
              // Handle other issues navigation
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F0F4F7",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  backButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  issuesContainer: {
    gap: 12,
  },
  issueOption: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  iconContainer: {
    marginLeft: 15,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  cancelIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  overlayIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
  },
  fraudIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cashbackIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  checkIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  referralIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  otherIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  usdcImage: {
    width: 16,
    height: 16,
  },
});