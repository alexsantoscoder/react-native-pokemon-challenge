// Navigation primitives and route definitions
import { ROUTES } from "@/navigation/routes";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Feature navigators and flow entry screens
import PokemonNavigator from "@/navigation/PokemonNavigator";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false}}>

            <Tab.Screen
                name={ROUTES.TABS.POKEMON_FLOW}
                component={PokemonNavigator}/>

        </Tab.Navigator>
    );
}
 
export default MainNavigator;