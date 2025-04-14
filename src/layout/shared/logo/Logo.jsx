import { styled } from "@mui/material";

import { Link } from "react-router-dom";
import logosmall from "../../../assets/logos/fts_logo1.jpeg"
import logstrucn from "../../../assets/logos/fts_logo_small.jpeg";
const LinkStyled = styled(Link)(() => ({
  height: "63px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));
const LargeLinkStyled = styled(Link)(() => ({
  height: "63px",
  width: "63px",
  overflow: "hidden",
  display: "block",
}));

const Logo = ({ isCollapsed }) => {
  return (
    <>
      {!isCollapsed ? (
        <LinkStyled to="/home">
          <img src={logosmall} alt="logo" className="h-16" />
        </LinkStyled>
      ) : (
        <LargeLinkStyled to="/home">
          <img src={logstrucn} alt="logo" className="h-16" />
        </LargeLinkStyled>
      )}
    </>
  );
};

export default Logo;
