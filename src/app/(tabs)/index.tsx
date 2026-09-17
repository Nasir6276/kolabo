import { useAuth } from "@/components/AuthContext";
import CategoryChips from "@/components/CategoryChips";
import FeaturedCard from "@/components/FeaturedCard";
import HomeHeader from "@/components/HomeHeader";
import IdeaCard from "@/components/IdeaCard";
import { CATEGORIES, DUMMY_IDEAS } from "@/data/dummyIdeas";
import { Idea } from "@/types/idea";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INK = "#1B1F3B";
const MUTED = "#6B7280";

export default function Home() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featuredIdeas = useMemo(
    () => DUMMY_IDEAS.filter((idea) => idea.isFeatured),
    [],
  );

  const filteredIdeas = useMemo(() => {
    return DUMMY_IDEAS.filter((idea) => {
      const matchesCategory =
        selectedCategory === "All" ||
        idea.categories.includes(selectedCategory as any);
      const matchesQuery =
        searchQuery.trim().length === 0 ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleIdeaPress = (idea: Idea) => {
    // navigate to idea detail screen once it exists
    console.log("Pressed idea:", idea.id);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <FlatList
        data={filteredIdeas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IdeaCard idea={item} onPress={handleIdeaPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        ListHeaderComponent={
          <>
            <HomeHeader />

            <View style={styles.searchRow}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={MUTED} />
                <TextInput
                  placeholder="Search ideas or keywords"
                  placeholderTextColor={MUTED}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>
              <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                <Ionicons name="options-outline" size={20} color={INK} />
              </TouchableOpacity>
            </View>

            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending ideas</Text>
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

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All ideas</Text>
            </View>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFBFF" },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  greeting: { fontSize: 24, fontWeight: "700", color: INK },
  subGreeting: { fontSize: 14, color: MUTED, marginTop: 2 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: INK },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: { paddingHorizontal: 20, marginTop: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: INK },
  featuredList: { paddingHorizontal: 20, marginBottom: 20 },
});
