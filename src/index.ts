import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to EzZendeskTalkSdk.web.ts
// and on native platforms to EzZendeskTalkSdk.ts
import {
  ChangeEventPayload,
  ChangeLineStatusEventPayload,
  EzZendeskTalkSdkViewProps,
} from "./EzZendeskTalkSdk.types";
import EzZendeskTalkSdkModule from "./EzZendeskTalkSdkModule";

export async function init(
  subdomainUrl: string,
  applicationId: string,
  oauthClientId: string
) {
  return await EzZendeskTalkSdkModule.init(
    subdomainUrl,
    applicationId,
    oauthClientId
  );
}

export async function lineStatus(digitalLine: string) {
  return await EzZendeskTalkSdkModule.lineStatus(digitalLine);
}

export async function startCallSetupFlow(digitalLine: string) {
  return await EzZendeskTalkSdkModule.startCallSetupFlow(digitalLine);
}

export async function setIdentity(name: string, email: string) {
  return await EzZendeskTalkSdkModule.setIdentity(name, email);
}

const emitter = new EventEmitter(
  EzZendeskTalkSdkModule ?? NativeModulesProxy.EzZendeskTalkSdk
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export function addChangeLineStatusListener(
  listener: (event: ChangeLineStatusEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeLineStatusEventPayload>(
    "onChangeLineStatus",
    listener
  );
}

export {
  EzZendeskTalkSdkViewProps,
  ChangeLineStatusEventPayload,
  ChangeEventPayload,
};
