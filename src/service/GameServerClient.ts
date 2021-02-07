class GameServerClient {

  public gameRoomId: string;

  private readonly rtcRoomControlChannel: RTCDataChannel;
  public rtcReliableChannel: RTCDataChannel;
  public rtcUnreliableChannel: RTCDataChannel;

  private readonly roomPlayerInfoUpdateListeners: Function[] = [];

  constructor(gameRoomId: string, rtcRoomControlChannel: any, rtcReliableChannel: any, rtcUnreliableChannel: any) {
    this.gameRoomId = gameRoomId;

    this.rtcRoomControlChannel = rtcRoomControlChannel;
    this.rtcReliableChannel = rtcReliableChannel;
    this.rtcUnreliableChannel = rtcUnreliableChannel;

    this.rtcRoomControlChannel.onmessage = this.handleRoomControlMessage.bind(this);

    //TODO - should this be handled by the matchmaker client?
    this.rtcReliableChannel.onclose = () => {
      console.log('Reliable channel closed');
      //if (onDisconnect) onDisconnect();
    };
  }

  public onRoomPlayerInfoUpdate(cb: Function): void {
    this.roomPlayerInfoUpdateListeners.push(cb);
  }

  private handleRoomControlMessage(event: any): void {

    console.log("Received Room Control message: %o", event);

    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'room-player-info':

        const roomPlayerInfo = message.payload;

        this.roomPlayerInfoUpdateListeners.forEach((listener) => {
          listener(roomPlayerInfo);
        });

        break;

      default:
        console.error("Unrecognized room control message: %o", message);
        break;

    }
  }
}

export default GameServerClient;
