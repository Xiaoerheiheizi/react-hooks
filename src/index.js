import ReactDOM from 'react-dom';
import React, { Fragment, useContext, useEffect, useReducer, useState } from "react";
import HooksDemo from './HooksDemo';
import Button from './Button';
import { FilesDragAndDrop } from "./FilesDragAndDrop";
import './assets/style/style.less';

// 在组件之间共享状态，在组件外部建立一个 Context
const AppContext = React.createContext({});

const Messages = () => {
	// useContext()钩子函数用来引入 Context 对象，从中获取username属性
	const { username } = useContext(AppContext);

	return (<p>1 message for {username}</p>)
};

const myReducer = (state, action) => {
	console.log(state);
	if (action.type === 'countUp') {
		return {
			...state,
			count : state.count + 1
		};
	}
	return state
};

// 自定义的 Hook
const usePerson = (personId)=>{
	const [loading, setLoading] = useState(true);
	const [person, setPerson] = useState({});

	// useEffect()接受两个参数。第一个参数是一个函数，异步操作的代码放在里面。第二个参数是一个数组，用于给出 Effect 的依赖项，只要这个数组发生变化，useEffect()就会执行。第二个参数可以省略，这时每次组件渲染时，就会执行useEffect()
	useEffect(() => {
		setLoading(true);
		fetch(`https://swapi.co/api/people/${personId}/`)
			.then(response => response.json())
			.then(data => {
				setPerson(data);
				setLoading(false);
			})
	}, [personId]);
	return [loading,person]
};

const Person = ({ personId }) => {
	const [loading,person] = usePerson(personId);
	if (loading === true) {
		return <p>loading...</p>
	}

	return (
		<div>
			<p>You're viewing: {person.name}</p>
			<p>Height: {person.height}</p>
			<p>Mass: {person.mass}</p>
		</div>
	)
};

function App()
{
	// 接受 Reducer 函数和状态的初始值作为参数，返回一个数组。数组的第一个成员是状态的当前值，第二个成员是发送 action 的dispatch函数。
	// 状态管理功能，类似 Redux，没法提供中间件（middleware）和时间旅行（time travel）
	const [state, dispatch] = useReducer(myReducer, { count : 0 });

	const [show, setShow] = useState("1");

	return (
		<Fragment>
			{/*  交互完整的文件上传组件  */}
			<FilesDragAndDrop onUpload={(files) => {
				console.log(files);
			}}>
				<div className="FilesDragAndDrop__area">
					下载个文件试试？
					<span
						role="img"
						aria-label="emoji"
						className="area__icon">
                        &#128526;
					</span>
				</div>
			</FilesDragAndDrop>

			{/*  AppContext.Provider提供了一个 Context 对象，这个对象可以被子组件共享。  */}
			<AppContext.Provider value={{ username : 'suerawesome' }}>
				<div>
					<Person personId={show} />

					<div>
						Show:
						<button onClick={() => setShow('1')}>
							Luke
						</button>
						<button onClick={() => setShow('2')}>
							C-3PO
						</button>
					</div>
				</div>

				<br />
				<br />

				<div>
					<button onClick={() => {
						dispatch({ type : 'countUp' })
					}}>
						+ 1
					</button>
					<p>
						Count: {state.count}
					</p>
				</div>

				<br />
				<br />
				<Messages />
				<br />
				<br />
				<HooksDemo />
				<br />
				<br />
				{/* 给子组件传参 */}
				<Button username="hahaha" />
			</AppContext.Provider>
		</Fragment>
	)
}

ReactDOM.render(<App />, document.getElementById('root'));