// Navigation primitives and route definitions
import Ionicons from "@expo/vector-icons/Ionicons";
import { ROUTES } from "@/navigation/routes";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { COLORS } from "@/config/theme";
import type { MainTabParamList } from "@/navigation/types";

// Feature navigators and flow entry screens
import PokemonNavigator from "@/navigation/PokemonNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: styles.tabBar,
            }}>

            <Tab.Screen
                name={ROUTES.TABS.POKEMON_FLOW}
                component={PokemonNavigator}
                options={{
                    title: "Pokedex",
                    tabBarIcon: ({ color, focused, size }) => (
                        <Ionicons
                            name={focused ? "book" : "book-outline"}
                            color={color}
                            size={size}
                            accessible={false}
                        />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}
 
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.backgroundSecondary,
        borderTopColor: COLORS.border,
        elevation: 0,
    },
});

export default MainNavigator;
