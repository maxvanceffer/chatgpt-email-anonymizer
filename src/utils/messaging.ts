export type BgRequest =
  | {
      type: "SCAN_AND_ANON";
      payload: { text: string; context?: Record<string, any> };
    }
  | {
      type: "GET_STATE";
    }
  | {
      type: "DISMISS_EMAILS";
      payload: { emails: string[]; hours: number };
    };

export type BgResponse =
  | {
      type: "SCAN_AND_ANON_RESULT";
      payload: {
        emails: string[];
        anonymized: string;
      };
    }
  | {
      type: "STATE";
      payload: any;
    }
  | {
      type: "ACK";
    };

export function sendToBackground<T extends BgResponse>(
  msg: BgRequest
): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(msg, (resp) => {
        const err = chrome.runtime.lastError;
        if (err) return reject(err);
        resolve(resp as T);
      });
    } catch (e) {
      reject(e);
    }
  });
}
