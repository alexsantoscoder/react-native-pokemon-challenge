/**
 * Hosts the Pokémon flow in the root tab navigator. The root tab bar and
 * header are hidden so the nested stack manages the visible navigation.
 */

// React Navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Application routes and types
import { ROUTES } from "@/navigation/routes";
import type { MainTabParamList } from "@/navigation/types";

// Feature navigator
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
