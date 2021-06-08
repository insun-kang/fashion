const SharedWardrobe = ({ match, history }) => {
  const sharedItems = JSON.parse(match.params.items);
  return (
    <div className="shared-container">
      {sharedItems.map((item) => (
        <img src="item" />
      ))}
    </div>
  );
};

export default SharedWardrobe;
