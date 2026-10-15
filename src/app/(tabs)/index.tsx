import CategoryChips from "@/components/CategoryChips";
import EmptyState from "@/components/EmptyState";
import FeaturedCard from "@/components/FeaturedCard";
import HomeHeader from "@/components/HomeHeader";
import IdeaCard from "@/components/IdeaCard";
import { useIdeas } from "@/components/IdeasContext";
import { CATEGORIES } from "@/data/dummyIdeas";
import { colors, radius, spacing } from "@/theme/colors";
import { Idea } from "@/types/idea";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { ideas, isLoading } = useIdeas();

  const featuredIdeas = useMemo(
    () => ideas.filter((idea) => idea.isFeatured),
    [ideas],
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ paddingVertical: spacing.xxl }}>
          <ActivityIndicator color={colors.ink} />
        </View>
      );
    }

    // Searching with no matches
    if (searchQuery.trim().length > 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="No matches found"
          message={`Nothing matched "${searchQuery.trim()}". Try a different keyword.`}
          actionLabel="Clear search"
          onAction={() => setSearchQuery("")}
        />
      );
    }

    // A category is selected but has no ideas
    if (selectedCategory !== "All") {
      return (
        <EmptyState
          icon="bulb-outline"
          title={`No ${selectedCategory} ideas yet`}
          message="Nobody has posted in this niche yet. Be the first to start something."
          actionLabel="Post an idea"
          onAction={() => router.push("/create-post")}
          secondaryLabel="View all ideas"
          onSecondaryAction={() => setSelectedCategory("All")}
        />
      );
    }

    // No ideas anywhere
    return (
      <EmptyState
        icon="rocket-outline"
        title="No ideas yet"
        message="The feed is empty right now. Post the first idea and get a team together."
        actionLabel="Post an idea"
        onAction={() => router.push("/create-post")}
      />
    );
  };

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesCategory =
        selectedCategory === "All" ||
        idea.categories.includes(selectedCategory as any);
      const matchesQuery =
        searchQuery.trim().length === 0 ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [ideas, selectedCategory, searchQuery]);

  const handleIdeaPress = (idea: Idea) => {
    router.push({ pathname: "/idea/[id]", params: { id: idea.id } });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <FlatList
        data={filteredIdeas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IdeaCard idea={item} onPress={handleIdeaPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={
          <>
            <HomeHeader />

            <View style={styles.searchRow}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={17} color={colors.textMuted} />
                <TextInput
                  placeholder="Search ideas or keywords"
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>
            </View>

            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            {featuredIdeas.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Trending</Text>
                  <Text style={styles.sectionLink}>See all</Text>
                </View>
                <FlatList
                  data={featuredIdeas}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <FeaturedCard idea={item} onPress={handleIdeaPress} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredList}
                />
              </>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All ideas</Text>
              <Text style={styles.resultCount}>
                {filteredIdeas.length} results
              </Text>
            </View>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  sectionLink: { fontSize: 12, fontWeight: "600", color: colors.accent },
  resultCount: { fontSize: 12, color: colors.textMuted, fontWeight: "500" },
  featuredList: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
});
