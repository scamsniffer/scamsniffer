import RPC from '../../core/message/client';

type PageMessageData = {
  target: string;
  data: {
    method: string;
    param: string;
  };
};
export default function listenPhasingWarningPageMessage() {
  const targetOrigin = 'https://scamsniffer.github.io';
  const targetWindow = window;
  const name = 'scamsniffer-contentscript';
  window.addEventListener('message', (event: MessageEvent<PageMessageData>) => {
    const message = event.data;

    if (
      event.origin !== targetOrigin ||
      event.source !== targetWindow ||
      message.target !== name
    ) {
      return;
    }

    const {data} = message;
    if (data.method === 'safelistPhishingDomain' && data.param) {
      RPC.byPassOrigin(data.param);
    }
  });
}
