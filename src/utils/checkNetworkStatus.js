import NetInfo from "@react-native-community/netinfo";

export const checkNetworkStatus = async () => {
  const state = await NetInfo.fetch();

  const isOnline =
    state.isConnected === true &&
    state.isInternetReachable !== false;

  console.log(
    isOnline
      ? "Connected to internet"
      : "No internet connection"
  );

  return isOnline;
};