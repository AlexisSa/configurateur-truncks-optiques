import trunckImage from "../assets/img/Trunck.png";

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <img src={trunckImage} alt="Trunck optique" className="trunck-logo" />
        </div>
        <div className="header-text">
          <h1>Configurateur de truncks optiques</h1>
          <p>Configurez votre trunck optique selon vos besoins spécifiques</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
