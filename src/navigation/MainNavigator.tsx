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
            tabBar={()=>null}
            screenOptions={{
                headerShown: false
            }}>

            <Tab.Screen
                name={ROUTES.TABS.POKEMON_FLOW}
                component={PokemonNavigator}/>

        </Tab.Navigator>
    );
}
 

export default MainNavigator;
