export default Conditional = (showWhen, children) => {
	if (showWhen)
		return <>{children}</>;
}