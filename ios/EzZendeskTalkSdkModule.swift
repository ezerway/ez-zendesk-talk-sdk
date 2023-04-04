import ExpoModulesCore
import ZendeskCoreSDK
import TalkSDK

public class EzZendeskTalkSdkModule: Module {
  var talk: Talk?

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('EzZendeskTalkSdk')` in JavaScript.
    Name("EzZendeskTalkSdk")

    // Defines event names that the module can send to JavaScript.
    Events("onChange")
    Events("onChangeLineStatus")


    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("init") { (subdomainUrl: String, applicationId: String, oauthClientId: String) -> Bool in
      Zendesk.initialize(appId: applicationId,
                          clientId: oauthClientId,
                          zendeskUrl: subdomainUrl)
        
      Zendesk.instance?.setIdentity(Identity.createAnonymous(name: "End User", email: "end.user@domain.com"))
      talk = Talk(zendesk: Zendesk.instance!)
      return true
    }.runOnQueue(.main)

    AsyncFunction("lineStatus") { (digitalLine: String) in
      talk?.lineStatus(digitalLine: digitalLine) { [weak self] result in
            switch result {
            case .success(let lineStatus):
                self?.sendEvent("onChangeLineStatus", [
                  "digitalLine": digitalLine,
                  "lineAvailable": lineStatus.agentAvailable
                ])
            case .failure(let agentError):
                self?.sendEvent("onChangeLineStatus", [
                  "digitalLine": digitalLine,
                  "lineAvailable": false,
                  "error": agentError.rawValue
                ])
            }
        }
    }.runOnQueue(.main)

    AsyncFunction("startCallSetupFlow") { (digitalLine: String) in
      talk?.startCall(to: digitalLine)
    }.runOnQueue(.main)

    AsyncFunction("setIdentity") { (name: String, email: String) in
      Zendesk.instance?.setIdentity(Identity.createAnonymous(name: name, email: email))
    }.runOnQueue(.main)
  }
}
