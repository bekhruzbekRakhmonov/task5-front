import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const HeaderComponent = () => {

	return (
		<AppBar position="static" color="inherit">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Random User Generator App
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default HeaderComponent;
