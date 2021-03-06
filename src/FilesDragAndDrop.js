import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * 实现一个交互完整的拖拽上传组件
 * @param props
 * @returns {*}
 * @constructor
 */
const FilesDragAndDrop = (props) => {
	const [dragging, setDragging] = useState(false);
	const [message, setMessage] = useState({ show : false, text : null, type : null });
	const drop = useRef();
	const drag = useRef();
	console.log(props);

	useEffect(() => {
		drop.current.addEventListener('dragover', handleDragOver); // 会在拖拽源元素的鼠标指针在目标元素内移动时持续触发
		drop.current.addEventListener('drop', handleDrop); // 拖动源元素的鼠标指针位于目标元素内，并松开鼠标时触发
		drop.current.addEventListener('dragenter', handleDragEnter); // 会在拖拽鼠标指针进入目标元素时触发
		drop.current.addEventListener('dragleave', handleDragLeave); // 会在拖拽源元素的鼠标指针离开目标元素时触发
		return () => {
			drop.current.removeEventListener('dragover', handleDragOver);
			drop.current.removeEventListener('drop', handleDrop);
			drop.current.removeEventListener('dragenter', handleDragEnter);
			drop.current.removeEventListener('dragleave', handleDragLeave);
		}
	});

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(false);
		const { count, formats } = props;
		console.log(count, formats);
		console.log(props);
		const files = [...e.dataTransfer.files];

		if (count && count < files.length) {
			showMessage(`抱歉，每次最多只能上传${count} 文件。`, 'error', 2000);
			return
		}

		// some()是对数组中每一项运行给定函数，如果该函数对任一项返回true，则返回true。
		// .endsWith是判断是否按指定字符串结尾
		if (formats && files.some((file) => !formats.some((format) => file.name.toLowerCase().endsWith(format.toLowerCase())))) {
			showMessage(`只允许上传${formats.join(', ')}格式的文件。`, 'error', 2000);
			return
		}

		if (files && files.length) {
			showMessage('成功上传！', 'success', 1000);
			props.onUpload(files);
		}
	};

	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.target === drag.current && setDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.target === drag.current && setDragging(false);
	};

	const showMessage = (text, type, timeout) => {
		setMessage({ show : true, text, type });
		setTimeout(() => setMessage({ show : false, text : null, type : null }), timeout);
	};

	return (
		<div ref={drop}
		     className="FilesDragAndDrop">
			{message.show && (
				<div className={`FilesDragAndDrop__placeholder FilesDragAndDrop__placeholder--${message.type}`}>
					{message.text}
					<span role="img"
					      aria-label="emoji"
					      className="area__icon">
						{message.type === 'error' ? <>&#128546;</> : <>&#128536;</>}
					</span>
				</div>
			)}

			{dragging && (
				<div ref={drag}
				     className="FilesDragAndDrop__placeholder">
					请放手

					<span role="img"
					      aria-label="emoji"
					      className="area__icon">
						&#128541;
					</span>
				</div>
			)}
			{props.children}
		</div>
	)
};

FilesDragAndDrop.propType = {
	onUpload : PropTypes.func.isRequired,
	children : PropTypes.node.isRequired,
	count    : PropTypes.number,
	formats  : PropTypes.arrayOf(PropTypes.string)
};

export { FilesDragAndDrop }