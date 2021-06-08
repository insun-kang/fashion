const SharedWardrobe = ({ match, history }) => {
  const sharedItems = JSON.parse(decodeURIComponent(match.params.items));
  console.log(sharedItems);
  return (
    <div className="shared-container">
      {sharedItems.map((item) => (
        // <img src="item" />
        <div>{item}</div>
      ))}
    </div>
  );
};

export default SharedWardrobe;
