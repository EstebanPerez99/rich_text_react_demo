import { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Node, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import RenderElement from "./RenderElement";
import RenderLeaf from "./RenderLeaf";
import { richtextInitialValue } from "./RichText";

const useLocalStorageListener = (key, callback) => {
	useEffect(() => {
		const handleStorageChange = () => {
			callback(localStorage.getItem("content"));
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [key, callback]);
};

const RichTextVisualizer = () => {
	const [content, setContent] = useState(
		JSON.parse(localStorage.getItem("content")) || richtextInitialValue
	);

	useLocalStorageListener("content", (newContent) => {
		setContent(JSON.parse(newContent));
	});

	const renderElement = useCallback(
		(props) => <RenderElement {...props} />,
		[]
	);
	const renderLeaf = useCallback((props) => <RenderLeaf {...props} />, []);
	const editor = useMemo(() => withReact(createEditor()), []);

	useEffect(() => {
		// Make sure there is at least one node
		if (editor.children.length === 0 || Node.string(editor) === "") {
			Transforms.insertNodes(editor, {
				type: "paragraph",
				children: [{ text: "" }],
			});
		}
		// Delete all entries leaving 1 empty node
		Transforms.delete(editor, {
			at: {
				anchor: Editor.start(editor, []),
				focus: Editor.end(editor, []),
			},
		});

		// Removes empty node
		Transforms.removeNodes(editor, {
			at: [0],
		});

		// Insert array of children nodes
		Transforms.insertNodes(editor, content);
	}, [content]);

	return (
		<Slate editor={editor} initialValue={content}>
			<Editable
				className='editor-styling-preview'
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				readOnly
				placeholder='-'
			/>
		</Slate>
	);
};

export default RichTextVisualizer;
