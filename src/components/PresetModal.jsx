import { presetConfigurations } from "../utils/presetConfigurations.js";

const PresetModal = ({
  showPresetModal,
  setShowPresetModal,
  loadPresetConfiguration,
}) => {
  if (!showPresetModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowPresetModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Configurations pré-faites</h3>
          <button
            className="modal-close"
            onClick={() => setShowPresetModal(false)}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="preset-grid">
            {presetConfigurations.map((preset, index) => (
              <div key={index} className="preset-card">
                <div className="preset-header">
                  <h4>{preset.name}</h4>
                  <p>{preset.description}</p>
                </div>
                <div className="preset-details">
                  <div className="preset-specs">
                    <span>
                      🔌 {preset.options.connecteurA}/
                      {preset.options.connecteurB}
                    </span>
                    <span>📡 {preset.options.nombreFibres} fibres</span>
                    <span>🔬 {preset.options.modeFibre}</span>
                    <span>📏 {preset.options.longueur}m</span>
                  </div>
                  <button
                    onClick={() => {
                      loadPresetConfiguration(preset);
                      setShowPresetModal(false);
                    }}
                    className="preset-button"
                  >
                    Charger cette configuration
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresetModal;
