import Router from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import {authenticateToken} from "../../middleware/authMiddleware.js";

dotenv.config();
const clickupAuthRouter = Router();

const { CLICKUP_CLIENT_ID, CLICKUP_SECRET, CLICKUP_REDIRECT_URI } = process.env;

clickupAuthRouter.get('/login', authenticateToken, (req, res) => {
    const redirectUrl = `https://app.clickup.com/api?client_id=${CLICKUP_CLIENT_ID}&redirect_uri=${encodeURIComponent(CLICKUP_REDIRECT_URI)}`;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
});

clickupAuthRouter.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
        const response = await axios.post('https://api.clickup.com/api/v2/oauth/token', {
            client_id: CLICKUP_CLIENT_ID,
            client_secret: CLICKUP_SECRET,
            code,
            redirect_uri: CLICKUP_REDIRECT_URI,
        });

        const { access_token } = response.data;
        // todo save the token in the db
        console.log('Access Token:', access_token);

        res.send('✅ OAuth complete! Token received. You can now close this window.');
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Token exchange failed');
    }
});

export default clickupAuthRouter;
