import type {
  Node as MdastNode,
  Parent as MdastParent,
  Literal as MdastLiteral,
  BlockContent,
  PhrasingContent
} from 'mdast'
import type {Program} from 'estree-jsx'

import type {Tag} from './lib/index.js'

// Expose JavaScript API.
export {mdxJsxFromMarkdown, mdxJsxToMarkdown} from './lib/index.js'

// Expose options.
export type {ToMarkdownOptions} from './lib/index.js'

// Expose node types.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MdxJsxAttributeValueExpression extends MdastLiteral {
  type: 'mdxJsxAttributeValueExpression'
  data?: {estree?: Program} & MdastLiteral['data']
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MdxJsxExpressionAttribute extends MdastLiteral {
  type: 'mdxJsxExpressionAttribute'
  data?: {estree?: Program} & MdastLiteral['data']
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MdxJsxAttribute extends MdastNode {
  type: 'mdxJsxAttribute'
  name: string
  value?: MdxJsxAttributeValueExpression | string | null | undefined
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface MdxJsxElementFields {
  name: string | null
  attributes: Array<MdxJsxAttribute | MdxJsxExpressionAttribute>
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MdxJsxFlowElement extends MdxJsxElementFields, MdastParent {
  type: 'mdxJsxFlowElement'
  children: BlockContent[]
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MdxJsxTextElement extends MdxJsxElementFields, MdastParent {
  type: 'mdxJsxTextElement'
  children: PhrasingContent[]
}

// Add nodes to mdast content.
declare module 'mdast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface StaticPhrasingContentMap {
    mdxJsxTextElement: MdxJsxTextElement
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface BlockContentMap {
    mdxJsxFlowElement: MdxJsxFlowElement
  }
}

// Add nodes to hast content.
declare module 'hast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RootContentMap {
    mdxJsxTextElement: MdxJsxTextElement
    mdxJsxFlowElement: MdxJsxFlowElement
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ElementContentMap {
    mdxJsxTextElement: MdxJsxTextElement
    mdxJsxFlowElement: MdxJsxFlowElement
  }
}

// Add custom data tracked to turn markdown into a tree.
declare module 'mdast-util-from-markdown' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CompileData {
    /**
     * Current MDX JSX tag.
     */
    mdxJsxTag?: Tag | undefined

    /**
     * Current stack of open MDX JSX tags.
     */
    mdxJsxTagStack?: Tag[] | undefined
  }
}

// Add custom data tracked to turn a syntax tree into markdown.
declare module 'mdast-util-to-markdown' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ConstructNameMap {
    /**
     * Whole JSX element, in flow.
     *
     * ```markdown
     * > | <a />
     *     ^^^^^
     * ```
     */
    mdxJsxFlowElement: 'mdxJsxFlowElement'

    /**
     * Whole JSX element, in text.
     *
     * ```markdown
     * > | a <b />.
     *       ^^^^^
     * ```
     */
    mdxJsxTextElement: 'mdxJsxTextElement'
  }
}
