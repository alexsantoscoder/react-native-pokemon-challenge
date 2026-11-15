import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { COLORS } from "@/config/theme";

export const SCREEN_OPTIONS: NativeStackNavigationOptions = {
    headerStyle: { backgroundColor: COLORS.background },
    headerTintColor: COLORS.text,
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal",
    contentStyle: { backgroundColor: COLORS.background },
    headerTitle: '',
};

export const DISABLE_RETURN_OPTION = {
    headerBackVisible: false,
    gestureEnabled: false,
};
