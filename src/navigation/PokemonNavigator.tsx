// Navigation primitives and route definitions
import { ROUTES } from "@/navigation/routes";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { PokemonStackParamList } from "@/navigation/types";

// Shared stack header and gesture configuration presets
import { SCREEN_OPTIONS } from "@/navigation/screenOptions";

// Screen Imports
import ListScreen from "@/features/pokemon/screens/ListScreen";
import DetailScreen from "@/features/pokemon/screens/DetailScreen";

const Stack = createNativeStackNavigator<PokemonStackParamList>();

const PokemonNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={SCREEN_OPTIONS}
            initialRouteName={ROUTES.POKEMON.LIST}>

            <Stack.Screen
                component={ListScreen}
                options={{ headerShown: false }}
                name={ROUTES.POKEMON.LIST}/>

            <Stack.Screen
                component={DetailScreen}
                name={ROUTES.POKEMON.DETAIL}/>

        </Stack.Navigator>
    );
}
 
export default PokemonNavigator;
