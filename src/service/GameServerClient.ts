class GameServerClient {

  public gameRoomId: string;

  // TODO - types
  public rtcReliableChannel: any;
  public rtcUnreliableChannel: any;


  constructor(gameRoomId: string, rtcReliableChannel: any, rtcUnreliableChannel: any) {
    this.gameRoomId = gameRoomId;

    this.rtcReliableChannel = rtcReliableChannel;
    this.rtcUnreliableChannel = rtcUnreliableChannel;

    //TODO - should this be handled by the matchmaker client?
    this.rtcReliableChannel.onclose = () => {
      console.log('Reliable channel closed');
      //if (onDisconnect) onDisconnect();
    };
  }
}

export default GameServerClient;
