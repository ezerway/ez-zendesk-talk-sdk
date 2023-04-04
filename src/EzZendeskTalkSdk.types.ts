export type ChangeEventPayload = {
  value: string;
};

export type ChangeLineStatusEventPayload = {
  digitalLine: string;
  lineAvailable: boolean;
};

export type EzZendeskTalkSdkViewProps = {
  name: string;
};
