import React, { useEffect, useRef, useState } from "react";


const usePrevious = state => {
	const ref = useRef();

	useEffect(() => {
		ref.current = state;
	});

	return ref.current
};

/**
 * useRef demo
 * @returns {*}
 * @constructor
 */
export default function UseRef() {
	const [count, setCount] = useState(0);
	const prevCount = usePrevious(count);


	return (
		<>
			<p>
				Now:{count}, before: {prevCount}
			</p>

			<button onClick={() => setCount(count + 1)}>
				+
			</button>
			<button onClick={() => setCount(count - 1)}>
				+
			</button>
		</>
	)
}
