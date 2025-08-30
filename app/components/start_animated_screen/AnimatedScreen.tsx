import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
export default function AnimationScreen({ children }: any) {
  const [isLoading, setIsLoading] = useState(true);

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const translateX = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scale, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(false);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-15deg", "0deg"],
  });

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require("../../../assets/images/logos/Zink-Logo.png")}
          style={[
            styles.logo,
            {
              opacity: opacity,
              transform: [{ scale: scale }, { rotate: rotateInterpolate }],
            },
          ]}
          resizeMode="contain"
        />

        <View style={styles.bottomTextWrapper}>
          <Text style={styles.bottomText}>ZINK</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 400,
    height: 400,
  },
  bottomTextWrapper: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 35,
    fontWeight: "700",
    fontFamily: "sans-serif",
    color: "#5f6368",
    letterSpacing: 1.5,
  },
});
