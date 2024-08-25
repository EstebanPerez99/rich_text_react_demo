/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import { createEditor, Editor, Transforms, Element } from "slate";
import { Editable, Slate, withReact } from "slate-react";

const initialValue = [
	{
		type: "paragraph",
		children: [{ text: "A line of text in a paragraph." }],
	},
];

// Define our own custom set of helpers.
const CustomEditor = {
	isBoldMarkActive(editor) {
		const marks = Editor.marks(editor);
		return marks ? marks.bold === true : false;
	},

	isCodeBlockActive(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => n.type === "code",
		});

		return !!match;
	},

	toggleBoldMark(editor) {
		const isActive = CustomEditor.isBoldMarkActive(editor);
		if (isActive) {
			Editor.removeMark(editor, "bold");
		} else {
			Editor.addMark(editor, "bold", true);
		}
	},

	toggleCodeBlock(editor) {
		// Determine whether any of the currently selected blocks are code blocks.
		const isActive = CustomEditor.isCodeBlockActive(editor);

		// Toggle the block type depending on whether there's already a match.
		Transforms.setNodes(
			editor,
			{ type: isActive ? "paragraph" : "code" },
			{
				match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
			}
		);
	},
};

// Define a React component renderer for our code blocks.
const CodeElement = (props) => {
	return (
		<pre {...props.attributes}>
			<code>{props.children}</code>
		</pre>
	);
};
const DefaultElement = (props) => {
	return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props) => {
	return (
		<span
			{...props.attributes}
			style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
		>
			{props.children}
		</span>
	);
};

function App() {
	const [editor] = useState(() => withReact(createEditor()));

	// Define a rendering function based on the element passed to `props`. We use
	// `useCallback` here to memoize the function for subsequent renders.
	const renderElement = useCallback((props) => {
		switch (props.element.type) {
			case "code":
				return <CodeElement {...props} />;
			default:
				return <DefaultElement {...props} />;
		}
	}, []);

	const renderLeaf = useCallback((props) => {
		return <Leaf {...props} />;
	}, []);

	return (
		<>
			<p>Rich Text Demo</p>
			<Slate editor={editor} initialValue={initialValue}>
				<div>
					<button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleBoldMark(editor);
						}}
					>
						Bold
					</button>
					<button
						onMouseDown={(event) => {
							event.preventDefault();
							CustomEditor.toggleCodeBlock(editor);
						}}
					>
						Code Block
					</button>
				</div>
				<Editable
					style={{ minHeight: "200px", barder: "solid gray 1px" }}
					editor={editor}
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					onKeyDown={(event) => {
						if (!event.ctrlKey && !event.metaKey) {
							return;
						}

						switch (event.key) {
							case "e": {
								event.preventDefault();
								CustomEditor.toggleCodeBlock(editor);
								break;
							}

							case "b": {
								event.preventDefault();
								CustomEditor.toggleBoldMark(editor);
								break;
							}
						}
					}}
				/>
			</Slate>
		</>
	);
}

export default App;
