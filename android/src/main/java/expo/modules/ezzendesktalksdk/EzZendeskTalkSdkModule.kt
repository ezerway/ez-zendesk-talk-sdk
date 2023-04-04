package expo.modules.ezzendesktalksdk

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import zendesk.core.Zendesk
import zendesk.core.AnonymousIdentity
import zendesk.talk.android.Talk
import android.content.Context
import kotlinx.coroutines.CoroutineScope
import expo.modules.kotlin.functions.Coroutine

class EzZendeskTalkSdkModule : Module() {
  private val lineStatusChecker = LineStatusChecker()

  companion object {
    var talk: Talk? = null
      private set

  }

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('EzZendeskTalkSdk')` in JavaScript.
    Name("EzZendeskTalkSdk")

    // Defines event names that the module can send to JavaScript.
    Events("onChange")
    Events("onChangeLineStatus")

    AsyncFunction("init") { subdomainUrl: String, applicationId: String, oauthClientId: String ->
      
      if (listOf(subdomainUrl, applicationId, oauthClientId).any { credential -> credential.isEmpty() }) {
        return@AsyncFunction false
      }

      /**
        * Initialize the SDK with your Zendesk subdomain, mobile SDK app ID, and client ID.
        *
        * Get these details from your Zendesk dashboard: Admin -> Channels -> MobileSDK.
        */
      Zendesk.INSTANCE.init(
              appContext.activityProvider?.currentActivity as Context,
              subdomainUrl,
              applicationId,
              oauthClientId
      )

      /**
         * Set an identity (authentication).
         *
         * Talk SDK supports only Anonymous identity
         */
      Zendesk.INSTANCE.setIdentity(
        AnonymousIdentity.Builder()
          .withNameIdentifier("End User")
          .withEmailIdentifier("end.user@domain.com")
          .build()
      )

      talk = Talk.create(Zendesk.INSTANCE)

      return@AsyncFunction true
    }

    AsyncFunction("lineStatus") Coroutine { digitalLine: String ->
      var lineAvailable: Boolean = lineStatusChecker.lineStatus(digitalLine)
      
      sendEvent("onChangeLineStatus", mapOf(
        "digitalLine" to digitalLine, "lineAvailable" to lineAvailable
      ))

      return@Coroutine lineAvailable
    }

    AsyncFunction("startCallSetupFlow") { digitalLine: String ->
      talk?.startCallSetupFlow(
        context = appContext.activityProvider?.currentActivity as Context,
        digitalLine = digitalLine,
        successIntent = null
      )
    }

    AsyncFunction("setIdentity") { name: String, email: String ->
      /**
        * Set an identity (authentication).
        *
        * Talk SDK supports only Anonymous identity
        */
      Zendesk.INSTANCE.setIdentity(
        AnonymousIdentity.Builder()
          .withNameIdentifier(name)
          .withEmailIdentifier(email)
          .build()
      )
    }
  }
}
