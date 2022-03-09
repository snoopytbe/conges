import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

export const StyledMenuItem = (theme) => ({
  root: {
    fontSize: '0.6em',
  },
});

export default withStyles(StyledMenuItem, { name: 'MyMenuItem' })(MenuItem);
