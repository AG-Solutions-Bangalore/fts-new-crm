
import { styled } from "@mui/material";

import { Link } from "react-router-dom";

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

const Logo = ({isCollapsed}) => {
  return (

   
  <>
      {!isCollapsed ? (
        <LinkStyled to="/">
          <img src="/images/logos/fts1.png" alt="logo" className="h-16" priority />
        </LinkStyled>
      ) : (
        <LargeLinkStyled to="/">
          <img src="/images/logos/fts_wm.png" alt="logo" className="h-16" priority />
        </LargeLinkStyled>
      )}
    </>
  );
};

export default Logo;
