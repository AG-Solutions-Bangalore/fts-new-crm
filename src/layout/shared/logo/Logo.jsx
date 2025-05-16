import { Link } from "react-router-dom";
import logosmall from "../../../assets/logos/fts_logo1.jpeg";
import logstrucn from "../../../assets/logos/fts_logo_small.jpeg";

const Logo = ({ isCollapsed }) => {
  return (
    <div className="flex items-center justify-center">
      <Link 
        to="/home" 
        className={`block overflow-hidden ${isCollapsed ? "w-16" : "w-48"}`}
      >
        <img 
          src={isCollapsed ? logstrucn : logosmall} 
          alt="logo" 
          className="h-16 object-contain" 
        />
      </Link>
    </div>
  );
};

export default Logo;