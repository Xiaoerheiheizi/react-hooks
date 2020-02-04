import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * 计数器
 * @returns {*}
 * @constructor
 */
export default function Counter() {
	// useState：传入我们所需的初始状态，返回一个常量状态以及改变状态的函数
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);
	// useRef：如果你需要有一个地方来存储变化的数据
	const ref = useRef(count);

	// useCallback：如果你需要一个不会随着组件更新而重新创建的 callback
	const fetch = useCallback(() => {
		setLoading(true);
		setTimeout(() => {
			setCount(1);
			setLoading(false);
		}, 2000);
	}, []);

	// 同componentDidMount
	// 第二个参数[]，表示只会执行一次
	// useEffect：第一个参数接受一个 callback，每次组件更新都会执行这个 callback，并且 callback 可以返回一个函数，该函数会在每次组件销毁前执行。如果 useEffect 内部有依赖外部的属性，并且希望依赖属性不改变就不重复执行 useEffect 的话，可以传入一个依赖数组作为第二个参数
	useEffect(() => {
		fetch()
	}, []);

	return (
		<div>
			{!loading ? (
				<div>
					Count: {count}
					<br />
					PreCount: {ref.current}
					<button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
					<button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
				</div>
			) : (
				<div>loading</div>
			)}
		</div>
	)
}