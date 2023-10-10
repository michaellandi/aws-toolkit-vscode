/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessagePublisher } from '../../../awsq/messages/messagePublisher'
import { weaverbirdChat } from '../actions/uiMessageListener'
import { ChatItemType } from '../../models'
import { ChatItemFollowUp, Suggestion } from '@aws/mynah-ui-chat'

class UiMessage {
    readonly time: number = Date.now()
    readonly sender: string = weaverbirdChat
    readonly type: string = ''

    public constructor(protected tabID: string) {}
}

export class ErrorMessage extends UiMessage {
    readonly title!: string
    readonly message!: string
    override type = 'errorMessage'

    constructor(title: string, message: string, tabID: string) {
        super(tabID)
        this.title = title
        this.message = message
    }
}

export class FilePathMessage extends UiMessage {
    readonly filePaths!: string[]
    readonly message!: string
    override type = 'filePathMessage'

    constructor(filePaths: string[], tabID: string) {
        super(tabID)
        this.filePaths = filePaths
    }
}

export interface ChatMessageProps {
    readonly message: string | undefined
    readonly messageType: ChatItemType
    readonly followUps: ChatItemFollowUp[] | undefined
    readonly relatedSuggestions: Suggestion[] | undefined
}

export class ChatMessage extends UiMessage {
    readonly message: string | undefined
    readonly messageType: string
    readonly followUps: ChatItemFollowUp[] | undefined
    readonly relatedSuggestions: Suggestion[] | undefined
    readonly requestID!: string
    override type = 'chatMessage'

    constructor(props: ChatMessageProps, tabID: string) {
        super(tabID)
        this.message = props.message
        this.messageType = props.messageType
        this.followUps = props.followUps
        this.relatedSuggestions = props.relatedSuggestions
    }
}

export class AppToWebViewMessageDispatcher {
    constructor(private readonly appsToWebViewMessagePublisher: MessagePublisher<any>) {}

    public sendErrorMessage(message: ErrorMessage) {
        this.appsToWebViewMessagePublisher.publish(message)
    }

    public sendChatMessage(message: ChatMessage) {
        this.appsToWebViewMessagePublisher.publish(message)
    }

    public sendFilePaths(message: FilePathMessage) {
        this.appsToWebViewMessagePublisher.publish(message)
    }
}
