/* eslint @dimensiondev/unicode/specific-set: ["error", { "only": "code" }] */
import { base } from '../base'
import { type Plugin, usePluginWrapper, usePostInfoDetails } from '@masknet/plugin-infra/content-script'
import { extractTextFromTypedMessage } from '@masknet/typed-message'
import { detectScam, ScamResult } from '../detector'
import ScamAlert from './ScamAlert'

function Renderer(props: React.PropsWithChildren<{ project: ScamResult }>) {
    usePluginWrapper(true)
    return <ScamAlert result={props.project} />
}

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {
        console.debug('ScamSniffer plugin has been loaded.')
        signal.addEventListener('abort', () => console.debug('Example plugin has been terminated'))
    },
    PostInspector: function Component() {
        const links = usePostInfoDetails.mentionedLinks()
        const author = usePostInfoDetails.author()
        const id = usePostInfoDetails.identifier()
        const nickname = usePostInfoDetails.nickname()
        const message = extractTextFromTypedMessage(usePostInfoDetails.rawMessage())
        const postDetail = {
            id: id ? id.postID : undefined,
            nickname,
            userId: author?.userId,
            links,
            content: message.some ? message.val : null,
        }
        const scamProject = detectScam(postDetail)
        return scamProject ? <Renderer project={scamProject} /> : null
    },
}

export default sns
