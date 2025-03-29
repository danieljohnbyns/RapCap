import React from 'react';
import ReactDOM from 'react-dom/client';


// import './fonts/font-face.css';
import './styles/index.css';

import Viewport from './pages/Viewport.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Viewport />
	</React.StrictMode>
);