import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * 随机颜色
 * @returns {string|string}
 */
const getRandomColor = () => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color;
};

/**
 * 偏移值
 * @param {string} value 偏移量（px）
 * @returns {string}
 */
const translateY = (value) => {
	return `translateY(${value}px)`;
};

/**
 * 排行榜 -- 可视化图表
 * 1、根据不同Props,循环排列后的数据：sortedCurrentValues
 * 2、计算宽度，返回每项的label、bar、value
 * 3、根据计算好的高度，触发transform
 * @param props
 * @returns {*}
 * @constructor
 */
const DynamicBarChart = (props) => {
	// 当前操作的原始数据数组
	const [dataQueue, setDataQueue] = useState([]);
	// 第几 “帧”
	const [activeItemIdx, setActiveItemIdx] = useState(0);
	// 榜首的数据值
	const [highestValue, setHighestValue] = useState(0);
	// 经过处理后用于渲染的数据数组
	const [currentValues, setCurrentValues] = useState({});
	// 第一次动态渲染时间
	const [firstRun, setFirstRun] = useState(false);
	let iterationTimeoutHolder = null;

	// 取原始数据
	useEffect(() => {
		setDataQueue(props.data);
	}, []);

	// 触发动态
	useEffect(() => {
		start();
	}, [dataQueue]);

	// 设触发动态间隔
	useEffect(() => {
		iterationTimeoutHolder = window.setTimeout(nextStep, 1000);
		return () => {
			if (iterationTimeoutHolder) {
				window.clearTimeout(iterationTimeoutHolder);
			}
		};
	}, [activeItemIdx]);

	/**
	 * 动态跑起来~
	 */
	function start()
	{
		if (activeItemIdx > 1) {
			return;
		}
		nextStep(true);
	}

	/**
	 * 对下一帧数据进行处理
	 */
	function setNextValues()
	{
		// 没有帧数时（即已结束），停止渲染
		if (!dataQueue[activeItemIdx]) {
			iterationTimeoutHolder = null;
			return;
		}

		// 每一帧的数据数组
		const roundData = dataQueue[activeItemIdx].values;
		const nextValues = {};
		let highestValue = 0;
		// 处理数据，用作最后渲染（各种样式，颜色）
		roundData.map((c) => {
			nextValues[c.id] = {
				...c,
				color : c.color || (currentValues[c.id] || {}).color || getRandomColor()
			};

			if (Math.abs(c.value) > highestValue) {
				highestValue = Math.abs(c.value);
			}

			return c;
		});
		console.table(highestValue);
		// 属性的操作，触发 useEffect
		setCurrentValues(nextValues);
		setHighestValue(highestValue);
		setActiveItemIdx(activeItemIdx + 1);
	}

	/**
	 * 触发下一步，循环
	 * @param {boolean} firstRun 是否是首次
	 */
	function nextStep(firstRun = false)
	{
		setFirstRun(firstRun);
		setNextValues();
	}

	// 整理用于渲染Dom的数据
	const keys = Object.keys(currentValues); // 每组数据的索引
	const { barGapSize, barHeight, showTitle } = props; //
	const maxValue = highestValue / 0.85; // 图表最大宽度
	const sortedCurrentValues = keys.sort((a, b) => currentValues[b].value - currentValues[a].value); //  对每组数据进行排序，该项影响动态渲染。
	const currentItem = dataQueue[activeItemIdx - 1] || {}; // 每组的原始数据

	return (
		<div className="live-chart">
			{
				<React.Fragment>
					{
						showTitle &&
						<h1>{currentItem.name}</h1>
					}
					<section className="chart">
						<div className="chart-bars">
							{
								sortedCurrentValues.map((key, idx) => {
									const currentValueData = currentValues[key];
									const value = currentValueData.value;
									let width = Math.abs((value / maxValue * 100));
									let widthStr;
									if (isNaN(width) || !width) {
										widthStr = '1px';
									} else {
										widthStr = `${width}%`;
									}

									return (
										<div className="bar-wrapper"
										     style={{
											     transform          : translateY((barHeight + barGapSize) * idx),
											     transitionDuration : 200 / 1000
										     }}
										     key={`bar_${key}`}>
											<label>
												{
													!currentValueData.label
														? key
														: currentValueData.label
												}
											</label>
											<div className="bar"
											     style={{
												     height     : barHeight,
												     width      : widthStr,
												     background : typeof currentValueData.color === 'string' ? currentValueData.color : `linear-gradient(to right, ${currentValueData.color.join(',')})`
											     }} />
											<span className="value"
											      style={{
												      color : typeof currentValueData.color === 'string' ? currentValueData.color : currentValueData.color[0]
											      }}>
												{currentValueData.value}
											</span>
										</div>
									);
								})
							}
						</div>
					</section>
				</React.Fragment>
			}
		</div>
	);
};

DynamicBarChart.propTypes = {
	showTitle  : PropTypes.bool,
	data       : PropTypes.array,
	barHeight  : PropTypes.number,
	barGapSize : PropTypes.number,
};

DynamicBarChart.defaultProps = {
	showTitle  : true,
	data       : [],
	barHeight  : 50,
	barGapSize : 20,
};

export {
	DynamicBarChart
};