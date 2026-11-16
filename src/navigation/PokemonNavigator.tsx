/**
 * Opens the Pokédex list first and provides a route to individual Pokémon
 * details. The list supplies its own header, while details use the stack header.
 */

// React Navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Application routes and types
import { ROUTES } from "@/navigation/routes";
import type { PokemonStackParamList } from "@/navigation/types";

// Shared stack styling
import { SCREEN_OPTIONS } from "@/navigation/screenOptions";

// Pokémon screens
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
