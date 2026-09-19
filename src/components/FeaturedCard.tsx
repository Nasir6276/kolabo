import { colors, radius, spacing } from "@/theme/colors";
import { Idea } from "@/types/idea";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  idea: Idea;
  onPress?: (idea: Idea) => void;
};

const FALLBACK_IMAGE = "https://loremflickr.com/400/300/technology";

export default function FeaturedCard({ idea, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPress?.(idea)}
    >
      <ImageBackground
        source={{ uri: idea.imageUrl ?? FALLBACK_IMAGE }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <View style={styles.tint} pointerEvents="none" />

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>
            {idea.title}
          </Text>
          <View style={styles.footerRow}>
            <Image
              source={{ uri: idea.postedBy.avatarUrl }}
              style={styles.avatar}
            />
            <Text style={styles.postedBy}>{idea.postedBy.name}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    height: 150,
    borderRadius: radius.lg,
    marginRight: spacing.md,
    overflow: "hidden",
  },
  image: { flex: 1, justifyContent: "flex-end" },
  imageRadius: { borderRadius: radius.lg },
  tint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(27, 31, 59, 0.6)",
  },
  content: { padding: spacing.lg, zIndex: 1 },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.surface,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  postedBy: { fontSize: 11, color: colors.surface, fontWeight: "500" },
});
