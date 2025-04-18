import PropTypes from 'prop-types';
import { ListSubheader, styled } from '@mui/material';
import { IconDots } from '@tabler/icons-react';

const NavGroup = ({ item,isCollapsed }) => {
  const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky {...props} />)(
    ({ theme }) => ({
      ...theme.typography.overline,
      fontWeight: '700',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(0),
      color: theme.palette.text.primary,
      lineHeight: '26px',
      padding: '3px 12px',
    }),
  );
  return (
    <ListSubheaderStyle> 
    {!isCollapsed ? (
           <>{item?.subheader}</>
          ) : (
            <>
            <IconDots className='w-5 h-5 animate-pulse'/>
            </>
          )}
    
     </ListSubheaderStyle>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
