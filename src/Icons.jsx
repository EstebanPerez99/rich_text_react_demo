/* eslint-disable react/prop-types */
import {
	FaBold,
	FaItalic,
	FaUnderline,
	FaListUl,
	FaListOl,
	FaCode,
	FaQuoteLeft,
	FaAlignJustify,
	FaAlignLeft,
	FaAlignCenter,
	FaAlignRight,
	FaGithub,
} from "react-icons/fa";
import { RiNumber1, RiNumber2 } from "react-icons/ri";

export default function Icons({ name, style }) {
	const icons = {
		format_bold: <FaBold style={style} />,
		format_italic: <FaItalic style={style} />,
		format_underlined: <FaUnderline style={style} />,
		format_list_bulleted: <FaListUl style={style} />,
		format_list_numbered: <FaListOl style={style} />,
		code: <FaCode style={style} />,
		looks_one: <RiNumber1 style={style} />,
		looks_two: <RiNumber2 style={style} />,
		format_quote: <FaQuoteLeft style={style} />,
		format_align_left: <FaAlignLeft style={style} />,
		format_align_center: <FaAlignCenter style={style} />,
		format_align_right: <FaAlignRight style={style} />,
		format_align_justify: <FaAlignJustify style={style} />,
		github: <FaGithub style={style} />,
	};

	return icons[name];
}
