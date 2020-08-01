import NetInfo from '@react-native-community/netinfo';

class Network {
  private connected = false;

  public init(): void {
    NetInfo.addEventListener((state) => {
      this.connected = state.isConnected && state.isInternetReachable !== false;
    });
  }

  public get isConnected(): boolean {
    return this.connected;
  }
}

export default new Network();
