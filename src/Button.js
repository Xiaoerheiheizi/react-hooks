import React, { Fragment, useState } from "react";

export default function Button({ username }) {
	const [buttonText, setButtonText] = useState('Click me, please');

	function handleClick()
	{
		let text;
		if (buttonText === 'Click me, please') {
			text = 'Thanks, been clicked!'
		} else {
			text = 'Click me, please'
		}
		setButtonText(text);
	}

	return (
		<Fragment>
			<button onClick={handleClick}>
				{buttonText}
			</button>
			<p>
				{username}
			</p>
		</Fragment>
	)
}