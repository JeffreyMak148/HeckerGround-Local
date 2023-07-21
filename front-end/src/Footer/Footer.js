import React from 'react';
import "./Footer.css";
import { Link } from 'react-router-dom';
import { AiOutlineCopyrightCircle } from "react-icons/ai";

const Footer = () => {

    return (
        <div className="footer">
            <div className="flex-display justify-content">
                <div className="footer-terms">
                    <Link to={`/terms-and-conditions`} className="footer-terms-link">
                        Terms and Conditions
                    </Link>
                </div>
                <div className="footer-privacy">
                    <Link to={`/privacy-policy`} className="footer-privacy-link">
                        Privacy Policy
                    </Link>
                </div>
            </div>
            <div className="flex-display footer-name justify-content">
                <div className="copyright-icon"><AiOutlineCopyrightCircle/></div>2023 Heckerground.com
            </div>
        </div>
    );
};

export default Footer;