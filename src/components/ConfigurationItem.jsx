const ConfigurationItem = ({ number, label, children, state = "empty" }) => {
  return (
    <div className={`config-item ${state}`}>
      <div className="config-header">
        <span className="config-number">{number}</span>
        <span>{label}</span>
      </div>
      <div className="config-value">{children}</div>
    </div>
  );
};

export default ConfigurationItem;
