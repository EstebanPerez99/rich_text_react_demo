/* eslint-disable react/prop-types */
import { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
	Editor,
	Transforms,
	createEditor,
	Element as SlateElement,
} from "slate";
import { withHistory } from "slate-history";
import RenderLeaf from "./RenderLeaf";
import RenderElement from "./RenderElement";
import Icons from "./Icons";

const HOTKEYS = {
	"mod+b": "bold",
	"mod+i": "italic",
	"mod+u": "underline",
	"mod+e": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const RichText = () => {
	const renderElement = useCallback(
		(props) => <RenderElement {...props} />,
		[]
	);
	const renderLeaf = useCallback((props) => <RenderLeaf {...props} />, []);
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	return (
		<Slate
			editor={editor}
			initialValue={richtextInitialValue}
			onChange={(value) => {
				const isAstChange = editor.operations.some(
					(op) => "set_selection" !== op.type
				);
				if (isAstChange) {
					// Guardar en localStorage
					const content = JSON.stringify(value);
					localStorage.setItem("content", content);
					window.dispatchEvent(new Event("storage"));

					// console.log(content); // Para verificar que se está guardando correctamente
				}
			}}
		>
			<div className='editor-toolbar'>
				<MarkButton format='bold' icon='format_bold' />
				<MarkButton format='italic' icon='format_italic' />
				<MarkButton format='underline' icon='format_underlined' />
				<MarkButton format='code' icon='code' />
				<BlockButton format='heading-one' icon='looks_one' />
				<BlockButton format='heading-two' icon='looks_two' />
				<BlockButton format='block-quote' icon='format_quote' />
				<BlockButton format='numbered-list' icon='format_list_numbered' />
				<BlockButton format='bulleted-list' icon='format_list_bulleted' />
				<BlockButton format='left' icon='format_align_left' />
				<BlockButton format='center' icon='format_align_center' />
				<BlockButton format='right' icon='format_align_right' />
				<BlockButton format='justify' icon='format_align_justify' />
			</div>
			<Editable
				className='editor-styling'
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				placeholder='Enter some rich text…'
				spellCheck
				autoFocus
				onKeyDown={(event) => {
					for (const hotkey in HOTKEYS) {
						if (isHotkey(hotkey, event)) {
							event.preventDefault();
							const mark = HOTKEYS[hotkey];
							toggleMark(editor, mark);
						}
					}
				}}
			/>
		</Slate>
	);
};

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(
		editor,
		format,
		TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
	);
	const isList = LIST_TYPES.includes(format);

	Transforms.unwrapNodes(editor, {
		match: (n) =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			LIST_TYPES.includes(n.type) &&
			!TEXT_ALIGN_TYPES.includes(format),
		split: true,
	});
	let newProperties;
	if (TEXT_ALIGN_TYPES.includes(format)) {
		newProperties = {
			align: isActive ? undefined : format,
		};
	} else {
		newProperties = {
			type: isActive ? "paragraph" : isList ? "list-item" : format,
		};
	}
	Transforms.setNodes(editor, newProperties);

	if (!isActive && isList) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};

const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const isBlockActive = (editor, format, blockType = "type") => {
	const { selection } = editor;
	if (!selection) return false;

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n) =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				n[blockType] === format,
		})
	);

	return !!match;
};

const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

const BlockButton = ({ format, icon }) => {
	const editor = useSlate();
	return (
		<button
			className='editor-button'
			style={
				isBlockActive(
					editor,
					format,
					TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
				)
					? { border: "solid black 1px" }
					: { border: "solid gray 1px" }
			}
			onMouseDown={(event) => {
				event.preventDefault();
				toggleBlock(editor, format);
			}}
		>
			<Icons name={icon} />
		</button>
	);
};

const MarkButton = ({ format, icon }) => {
	const editor = useSlate();
	return (
		<button
			className='editor-button'
			style={
				isMarkActive(editor, format)
					? { border: "solid black 1px" }
					: { border: "solid gray 1px" }
			}
			onMouseDown={(event) => {
				event.preventDefault();
				toggleMark(editor, format);
			}}
		>
			<Icons name={icon} />
		</button>
	);
};

export const richtextInitialValue = JSON.parse(
	localStorage.getItem("content")
) || [
	{
		type: "paragraph",
		children: [
			{ text: "This is editable " },
			{ text: "rich", bold: true },
			{ text: " text, " },
			{ text: "much", italic: true },
			{ text: " better than a " },
			{ text: "<textarea>", code: true },
			{ text: "!" },
		],
	},
	{
		type: "paragraph",
		children: [
			{
				text: "Since it's rich text, you can do things like turn a selection of text ",
			},
			{ text: "bold", bold: true },
			{
				text: ", or add a semantically rendered block quote in the middle of the page, like this:",
			},
		],
	},
	{ type: "block-quote", children: [{ text: "A wise quote." }] },
	{
		type: "bulleted-list",
		children: [
			{ type: "list-item", children: [{ text: "item 1" }] },
			{ type: "list-item", children: [{ text: "item 2" }] },
		],
	},
	{
		type: "paragraph",
		align: "center",
		children: [{ text: "--------------" }],
	},
	{ type: "heading-two", children: [{ text: "TODO list:" }] },
	{
		type: "numbered-list",
		children: [
			{ type: "list-item", children: [{ text: "eat" }] },
			{ type: "list-item", children: [{ text: "code" }] },
			{ type: "list-item", children: [{ text: "sleep" }] },
			{ type: "list-item", children: [{ text: "repeat" }] },
		],
	},
];
export default RichText;
