export default function DataItemPage(props) {
	const { data } = props;
	const id = props.params.id;

	const item = data.find((item) => item.id === id);

	return (
		<>
			<div>
				{item ? <DataItem item={item} /> : <div>Item Id {id} not found</div>}
			</div>
		</>
	);
}
