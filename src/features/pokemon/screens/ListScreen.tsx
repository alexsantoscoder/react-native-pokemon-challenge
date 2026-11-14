import { View, Text, Pressable } from "react-native";
import { ROUTES } from "@/navigation/routes";

import type { PokemonListScreenProps } from '@/navigation/types';

const ListScreen = ({ navigation }: PokemonListScreenProps) => {


    function gotoDetail (){

        // Use a sample ID until this screen renders Pokémon from the API.
        navigation.navigate(ROUTES.POKEMON.DETAIL, { pokemonId: 1 });
    }

    return (
    <View>
        <Pressable onPress={gotoDetail}>
            <Text>Ir a detalles</Text>
        </Pressable>
    </View>
);
}
 
export default ListScreen;
