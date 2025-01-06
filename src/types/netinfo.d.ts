declare module '@react-native-community/netinfo' {
    interface NetInfoState {
        isConnected: boolean | null;
        type: string;
        isInternetReachable: boolean | null;
    }

    type NetInfoSubscription = (state: NetInfoState) => void;
    
    const NetInfo: {
        addEventListener: (callback: NetInfoSubscription) => () => void;
        fetch: () => Promise<NetInfoState>;
    };

    export default NetInfo;
}