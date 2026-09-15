import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const INK = "#1B1F3B";
const ACCENT = "#F2A93B";
const MUTED = "#6B7280";
const BORDER = "#EDEDF2";

/** Top illustration panel takes 60% of the screen, bottom sheet gets the rest. */
const IMAGE_SECTION_HEIGHT = height * 0.6;
/** Reserved room at the bottom of the sheet for the dots + Next row. */
const BOTTOM_CONTROLS_SPACE = 120;

// --- Illustrations -----------------------------------------------------------
// Drop your three illustration files in and uncomment these, then swap the
// `illustration` value on each slide below from `null` to the imported asset.
//
const discoverArt = require("../../assets/onboarding/discover.png");
const applyArt = require("../../assets/onboarding/apply.png");
const buildArt = require("../../assets/onboarding/build.png");

type Slide = {
  key: string;
  headline: string;
  subtext: string;
  illustration: number | null;
};

const slides: Slide[] = [
  {
    key: "discover",
    headline: "Great ideas need great people",
    subtext:
      "Browse real projects from real builders, and find the one that's missing exactly what you bring.",
    illustration: discoverArt,
  },
  {
    key: "apply",
    headline: "Apply to a role, not a stranger",
    subtext:
      "Every idea comes with clear requirements and open roles, so you know what you're stepping into.",
    illustration: applyArt,
  },
  {
    key: "build",
    headline: "Build it together, from day one",
    subtext:
      "Get accepted, join the team space, and start turning the idea into something real.",
    illustration: buildArt,
  },
];

const scrollRangeEnd = width * (slides.length - 1);

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === slides.length - 1;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e: any) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex((prev) => (prev !== index ? index : prev));
      },
    },
  );

  const goToCreateAccount = () => router.push("/sing-up");

  const handleNext = () => {
    if (isLastSlide) {
      goToCreateAccount();
      return;
    }
    scrollRef.current?.scrollTo({
      x: width * (activeIndex + 1),
      animated: true,
    });
  };

  // Parallax drift for the decorative shapes behind the text section —
  // each shape moves at a different rate/direction as the user swipes.
  const driftA = scrollX.interpolate({
    inputRange: [0, scrollRangeEnd],
    outputRange: [0, -60],
  });
  const driftB = scrollX.interpolate({
    inputRange: [0, scrollRangeEnd],
    outputRange: [0, 45],
  });
  const driftC = scrollX.interpolate({
    inputRange: [0, scrollRangeEnd],
    outputRange: [0, -80],
  });
  const driftD = scrollX.interpolate({
    inputRange: [0, scrollRangeEnd],
    outputRange: [0, 65],
  });
  const driftE = scrollX.interpolate({
    inputRange: [0, scrollRangeEnd],
    outputRange: [0, -35],
  });

  return (
    <View style={styles.container}>
      {/* Static backdrop: deep blue top panel + white rounded sheet.
          Kept behind the pager so the sheet corners stay seamless while swiping. */}
      <View style={styles.backdrop} pointerEvents="none">
        <View style={styles.bluePanel} />
        <View style={styles.whiteSheet} />
      </View>

      {/* Decorative shapes for the text section — ink + amber at low opacity,
          drifting at different speeds as the user swipes between slides. */}
      <View style={styles.textBackgroundLayer} pointerEvents="none">
        <Animated.View
          style={[
            styles.shape,
            styles.shapeInkLarge,
            { transform: [{ translateX: driftA }] },
          ]}
        />
        <Animated.View
          style={[
            styles.shape,
            styles.shapeAccentMedium,
            { transform: [{ translateX: driftB }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ringOutline,
            styles.ringOutlineAccent,
            { transform: [{ translateX: driftC }] },
          ]}
        />
        <Animated.View
          style={[
            styles.shape,
            styles.shapeInkSmall,
            { transform: [{ translateX: driftD }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ringOutline,
            styles.ringOutlineInk,
            { transform: [{ translateX: driftE }] },
          ]}
        />
      </View>

      <TouchableOpacity
        style={[styles.skipButton, { top: insets.top + 12 }]}
        activeOpacity={0.7}
        onPress={goToCreateAccount}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {slides.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <View style={styles.imageSection}>
              {slide.illustration ? (
                <Image
                  source={slide.illustration}
                  style={styles.illustration}
                  resizeMode="contain"
                />
              ) : (
                // Placeholder — disappears once you pass a real asset above.
                <View style={styles.illustrationPlaceholder} />
              )}
            </View>

            <View style={styles.textSection}>
              <Text style={styles.headline}>{slide.headline}</Text>
              <Text style={styles.subtext}>{slide.subtext}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View
        style={[
          styles.bottomControls,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        <View style={styles.dotsRow}>
          {slides.map((slide, i) => (
            <View
              key={slide.key}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.9}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: INK,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bluePanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_SECTION_HEIGHT + 40,
    backgroundColor: INK,
  },
  whiteSheet: {
    position: "absolute",
    top: IMAGE_SECTION_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  textBackgroundLayer: {
    position: "absolute",
    top: IMAGE_SECTION_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  shape: {
    position: "absolute",
    borderRadius: 999,
  },
  shapeInkLarge: {
    width: 220,
    height: 220,
    backgroundColor: INK,
    opacity: 0.06,
    top: -60,
    left: -80,
  },
  shapeAccentMedium: {
    width: 160,
    height: 160,
    backgroundColor: ACCENT,
    opacity: 0.14,
    top: 40,
    right: -50,
  },
  shapeInkSmall: {
    width: 120,
    height: 120,
    backgroundColor: INK,
    opacity: 0.05,
    bottom: 160,
    left: -40,
  },
  ringOutline: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 16,
  },
  ringOutlineAccent: {
    width: 190,
    height: 190,
    borderColor: ACCENT,
    opacity: 0.1,
    bottom: -60,
    right: -60,
  },
  ringOutlineInk: {
    width: 110,
    height: 110,
    borderColor: INK,
    opacity: 0.06,
    top: 200,
    right: 10,
  },
  skipButton: {
    position: "absolute",
    right: 24,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    color: "#FFFFFF",
    opacity: 0.55,
    fontSize: 15,
    fontWeight: "500",
  },
  scroll: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  imageSection: {
    height: IMAGE_SECTION_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  illustration: {
    width: width * 0.85,
    height: IMAGE_SECTION_HEIGHT * 0.82,
  },
  illustrationPlaceholder: {
    width: width * 0.68,
    height: IMAGE_SECTION_HEIGHT * 0.62,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 28,
    paddingBottom: BOTTOM_CONTROLS_SPACE,
  },
  headline: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    color: INK,
    textAlign: "center",
    marginBottom: 12,
    width: 250,
    alignSelf: "center",
  },
  subtext: {
    fontSize: 16,
    color: MUTED,
    textAlign: "center",
    lineHeight: 24,
  },
  bottomControls: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotActive: {
    backgroundColor: ACCENT,
    width: 22,
  },
  dotInactive: {
    backgroundColor: BORDER,
    width: 8,
  },
  nextButton: {
    backgroundColor: INK,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 999,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
