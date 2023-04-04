package expo.modules.ezzendesktalksdk

import zendesk.talk.android.LineStatusResult

class LineStatusChecker {

    suspend fun lineStatus(digitalLine: String): Boolean {
        return when (val lineStatus = EzZendeskTalkSdkModule.talk?.lineStatus(digitalLine)) {
            is LineStatusResult.Success -> lineStatus.agentAvailable
            is LineStatusResult.Failure -> false
            null -> false
        }
    }
}
