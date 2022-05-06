(() => {
	const styles = 'INJECTED_STYLES';

	const styleNode = document.createElement('style');
	styleNode.title = 'Snowflake Neon Bunny Theme';
	const styleText = document.createTextNode(styles);
	styleNode.appendChild(styleText);

	document.getElementsByTagName('head')[0].appendChild(styleNode);
})();
