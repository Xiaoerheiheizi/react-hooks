import React, { createRef, useRef, useState } from "react";

/**
 * createRef 和 useRef 的不同之处
 * @returns {*}
 * @constructor
 */
export default function CreateRefAndUseRef() {
	const [renderIndex, setRenderIndex] = useState(1);
	const refFromUseRef = useRef(); // 返回的初始引用将持续全部生命周期
	const refFromCreateRef = createRef(); // 每次返回新的引用

	if (!refFromUseRef.current) {
		refFromUseRef.current = renderIndex
	}

	if (!refFromCreateRef.current) {
		refFromCreateRef.current = renderIndex
	}

	return (
		<>
			<p>
				Current render index: {renderIndex}
			</p>
			<p>
				<b>refFromUseRef</b> value: {refFromUseRef.current}
			</p>
			<p>
				<b>refFromCreateRef</b> value: {refFromCreateRef.current}
			</p>

			<button onClick={() => setRenderIndex(prev => prev + 1)}>
				Cause re-render
			</button>
		</>
	)
}
