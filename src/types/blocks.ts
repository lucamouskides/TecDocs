import { type LineItem } from "@/components/PricingTable";
import { type MenuContext } from "@/components/ContextMenu";

export type BaseBlock = { id: string; styles?: { [key: string]: any } };
export type RichTextBlock = BaseBlock & { type: 'richText'; content: any };
export type PricingTableBlock = BaseBlock & { type: 'pricingTable'; content: LineItem[] };
export type ImageBlockType = BaseBlock & { type: 'image'; content: { url: string | null } };
export type VideoBlockType = BaseBlock & { type: 'video'; content: { url: string | null } };
export type ButtonBlockType = BaseBlock & { type: 'button'; content: { text: string; url: string } };
export type DividerBlockType = BaseBlock & { type: 'divider'; content: {} };
export type QuoteBlockType = BaseBlock & { type: 'quote'; content: { text: string; author: string } };
export type SpacerBlockType = BaseBlock & { type: 'spacer'; content: { height: number } };
export type HtmlBlockType = BaseBlock & { type: 'html'; content: { html: string } };
export type ColumnsBlockType = BaseBlock & { type: 'columns'; content: { layout: number[], columns: Column[] } };
export type ImageWithTextBlockType = BaseBlock & { type: 'imageWithText'; content: { imageUrl: string | null, text: any } };
export type TestimonialBlockType = BaseBlock & { type: 'testimonial'; content: { text: string; author: string; company: string } };
export type SignatureBlockType = BaseBlock & { type: 'signature'; content: {} };
export type TableBlockType = BaseBlock & { type: 'table'; content: { headers: string[]; rows: string[][] } };

export type Block =
  | RichTextBlock | PricingTableBlock | ImageBlockType | VideoBlockType | ButtonBlockType
  | DividerBlockType | QuoteBlockType | SpacerBlockType | HtmlBlockType | ColumnsBlockType
  | ImageWithTextBlockType | TestimonialBlockType | SignatureBlockType | TableBlockType;
  
export type Column = { id: string; blocks: Block[] };
export type SectionType = { id: string; blocks: Block[] };
export { type MenuContext };