import * as EzZendeskTalkSdk from "ez-zendesk-talk-sdk";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";

const SUBDOMAIN_URL = "https://d3v-ezerway.zendesk.com";
const APPLICATION_ID = "b07da09210d388fabdc556fec73e8834e890263468e360a0";
const OAUTH_CLIENT_ID = "mobile_sdk_client_f4dbec14128019d93118";

const Separator = () => <View style={styles.separator} />;

export default function App() {
  const [expoZendeskTalk, setExpoZendeskTalk] = useState(false);
  const [digitalLine, setDigitalLine] = useState("Test");
  const [lineAvailable, setLineAvailable] = useState(false);

  const onPressLineStatus = useCallback(async () => {
    const lineAvailable = await EzZendeskTalkSdk.lineStatus(digitalLine);
    setLineAvailable(lineAvailable);
    console.log("onPressLineStatus", digitalLine, lineAvailable);
  }, [digitalLine]);

  useEffect(() => {
    (async () => {
      const expoZendeskTalk = await EzZendeskTalkSdk.init(
        SUBDOMAIN_URL,
        APPLICATION_ID,
        OAUTH_CLIENT_ID
      );
      setExpoZendeskTalk(expoZendeskTalk);
    })();

    EzZendeskTalkSdk.addChangeLineStatusListener(
      ({ digitalLine, lineAvailable }) => {
        console.log("addChangeLineStatusListener", digitalLine, lineAvailable);
        setLineAvailable(lineAvailable);
      }
    );
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setDigitalLine}
        value={digitalLine}
        editable={!expoZendeskTalk}
        placeholder="Digital Line"
      />
      <Text>{lineAvailable ? "Available" : "Unavailable"}</Text>
      <Separator />
      <Button
        disabled={!expoZendeskTalk}
        onPress={onPressLineStatus}
        title="Check"
      />
      <Separator />
      <Button
        disabled={!expoZendeskTalk}
        onPress={() => EzZendeskTalkSdk.startCallSetupFlow(digitalLine)}
        title="Call"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
