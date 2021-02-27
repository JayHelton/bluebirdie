import EventEmitter from 'events';
export class StreamEventEmitter extends EventEmitter {
  constructor(private stream: any) {
    super();
    this.stream
      .on('data', (data: string) => {
        try {
          const json = JSON.parse(data);
          this.emit('data', json);
        } catch (e) { }
      })
      .on('error', (error: { code: string }) => {
        this.emit('error', error);
      });
  }
}
