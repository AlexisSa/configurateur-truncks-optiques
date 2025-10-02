import { useState } from "react";
import { generateReference, calculatePrice } from "../utils/calculations.js";

const SaveModal = ({
  showSaveModal,
  setShowSaveModal,
  selectedOptions,
  savedConfigs,
  saveConfiguration,
  loadConfiguration,
  deleteConfiguration,
  renameConfiguration,
  clearAllConfigurations,
}) => {
  const [saveName, setSaveName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [activeTab, setActiveTab] = useState("save"); // "save" ou "load"

  const handleSave = () => {
    if (saveConfiguration(saveName)) {
      setSaveName("");
      setActiveTab("load"); // Basculer vers l'onglet de chargement après sauvegarde
    }
  };

  const handleRename = (config) => {
    setEditingId(config.id);
    setEditName(config.name);
  };

  const handleRenameSave = () => {
    if (renameConfiguration(editingId, editName)) {
      setEditingId(null);
      setEditName("");
    }
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleLoad = (config) => {
    loadConfiguration(config);
    setShowSaveModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentConfigSummary = () => {
    if (!selectedOptions.connecteurA || !selectedOptions.connecteurB) {
      return "Configuration incomplète";
    }
    return `${selectedOptions.connecteurA}/${selectedOptions.connecteurB} - ${
      selectedOptions.nombreFibres || "?"
    } fibres - ${selectedOptions.modeFibre || "?"} - ${
      selectedOptions.epanouissement || "?"
    }`;
  };

  if (!showSaveModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
      <div
        className="modal-content save-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>💾 Gestionnaire de configurations</h3>
          <button
            className="modal-close"
            onClick={() => setShowSaveModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Onglets */}
          <div className="save-tabs">
            <button
              className={`save-tab ${activeTab === "save" ? "active" : ""}`}
              onClick={() => setActiveTab("save")}
            >
              <span className="tab-icon">💾</span>
              <span className="tab-label">Sauvegarder</span>
            </button>
            <button
              className={`save-tab ${activeTab === "load" ? "active" : ""}`}
              onClick={() => setActiveTab("load")}
            >
              <span className="tab-icon">📁</span>
              <span className="tab-label">Charger ({savedConfigs.length})</span>
            </button>
          </div>

          {/* Contenu de l'onglet Sauvegarder */}
          {activeTab === "save" && (
            <div className="save-tab-content">
              <div className="current-config-preview">
                <h4>Configuration actuelle</h4>
                <div className="config-preview-card">
                  <div className="config-preview-summary">
                    {getCurrentConfigSummary()}
                  </div>
                  <div className="config-preview-details">
                    <div className="config-preview-item">
                      <span className="detail-label">Référence:</span>
                      <span className="detail-value">
                        {generateReference(selectedOptions) || "N/A"}
                      </span>
                    </div>
                    <div className="config-preview-item">
                      <span className="detail-label">Prix:</span>
                      <span className="detail-value">
                        {calculatePrice(selectedOptions)
                          ? `${calculatePrice(selectedOptions)} €`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="save-form-section">
                <h4>Donner un nom à cette configuration</h4>
                <div className="save-form">
                  <input
                    type="text"
                    className="save-name-input"
                    placeholder="Ex: Configuration standard 12 fibres"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSave()}
                    autoFocus
                  />
                  <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                  >
                    <span className="button-icon">💾</span>
                    <span className="button-text">Sauvegarder</span>
                  </button>
                </div>
                <div className="save-tips">
                  <p>
                    💡 <strong>Conseil:</strong> Utilisez un nom descriptif pour
                    retrouver facilement votre configuration
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contenu de l'onglet Charger */}
          {activeTab === "load" && (
            <div className="load-tab-content">
              <div className="load-header">
                <h4>Configurations sauvegardées</h4>
                {savedConfigs.length > 0 && (
                  <button
                    className="clear-all-button"
                    onClick={clearAllConfigurations}
                    title="Supprimer toutes les configurations"
                  >
                    <span className="button-icon">🗑️</span>
                    <span className="button-text">Tout effacer</span>
                  </button>
                )}
              </div>

              {savedConfigs.length === 0 ? (
                <div className="empty-saves">
                  <div className="empty-icon">📁</div>
                  <h5>Aucune configuration sauvegardée</h5>
                  <p>Sauvegardez votre première configuration pour commencer</p>
                  <button
                    className="switch-tab-button"
                    onClick={() => setActiveTab("save")}
                  >
                    💾 Créer ma première sauvegarde
                  </button>
                </div>
              ) : (
                <div className="saved-configs-grid">
                  {savedConfigs.map((config) => (
                    <div key={config.id} className="saved-config-card">
                      <div className="config-card-header">
                        {editingId === config.id ? (
                          <div className="rename-form">
                            <input
                              type="text"
                              className="rename-input"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleRenameSave()
                              }
                              autoFocus
                            />
                            <div className="rename-actions">
                              <button
                                className="rename-save-button"
                                onClick={handleRenameSave}
                                disabled={!editName.trim()}
                                title="Sauvegarder"
                              >
                                ✓
                              </button>
                              <button
                                className="rename-cancel-button"
                                onClick={handleRenameCancel}
                                title="Annuler"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <h5 className="saved-config-name">{config.name}</h5>
                        )}
                        <div className="config-card-actions">
                          <button
                            className="action-button rename-button"
                            onClick={() => handleRename(config)}
                            title="Renommer"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-button delete-button"
                            onClick={() => deleteConfiguration(config.id)}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="config-card-content">
                        <div className="config-card-summary">
                          {config.options.connecteurA}/
                          {config.options.connecteurB} -{" "}
                          {config.options.nombreFibres} fibres -{" "}
                          {config.options.modeFibre}
                        </div>
                        <div className="config-card-details">
                          <div className="config-detail-item">
                            <span className="detail-icon">🏷️</span>
                            <span className="detail-text">
                              {config.reference || "N/A"}
                            </span>
                          </div>
                          <div className="config-detail-item">
                            <span className="detail-icon">💰</span>
                            <span className="detail-text">
                              {config.price ? `${config.price} €` : "N/A"}
                            </span>
                          </div>
                          <div className="config-detail-item">
                            <span className="detail-icon">📅</span>
                            <span className="detail-text">
                              {formatDate(config.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="config-card-footer">
                        <button
                          className="load-config-button"
                          onClick={() => handleLoad(config)}
                        >
                          <span className="button-icon">📂</span>
                          <span className="button-text">
                            Charger cette configuration
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
