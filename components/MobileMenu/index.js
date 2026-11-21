import React, { Fragment, useState } from 'react';
import ListItem from "@mui/material/ListItem";
import Link from "next/link";
import { SHOW_BLOG } from "../../utils/siteConfig";

const menus = [
    {
        id: 1,
        title: 'Inicio',
        link: '/?section=inicio',
    },

    {
        id: 2,
        title: 'ADN Wintek',
        link: '/?section=adnSec',
    },
    {
        id: 3,
        title: 'Avancemos juntos',
        link: '/?section=avancemosSec',
    },
    {
        id: 4,
        title: 'Blog',
        link: '/blog',
    },

    {
        id: 5,
        title: 'Solicita Información',
        link: '/?section=contactSec',
    }
].filter((menu) => SHOW_BLOG || menu.title !== 'Blog')


const MobileMenu = () => {
    const [openId, setOpenId] = useState(0);
    const [menuActive, setMenuState] = useState(false);
    
    return (
        <div>
            <div style={{background:"#b76ff0"}} className={`mobileMenu ${menuActive ? "show" : ""}`}>
                <div className="menu-close">
                    <div className="clox" onClick={() => setMenuState(!menuActive)}><i className="ti-close"></i></div>
                </div>

                <ul className="responsivemenu">
                    {menus.map((item, mn) => {
                        return (
                            <ListItem className={item.id === openId ? 'active' : null}  key={mn}>
                                <Link className='active' onClick={() => setMenuState(false)} href={item.link}>{item.title}</Link>
                            </ListItem>
                        )
                    })}
                </ul>

            </div>

            <div  className="showmenu" onClick={() => setMenuState(!menuActive)}>
                <button type="button" className="navbar-toggler open-btn" style={{background:"#97ffb7"}}>
                    <span className="icon-bar first-angle"></span>
                    <span className="icon-bar middle-angle"></span>
                    <span className="icon-bar last-angle"></span>
                </button>
            </div>
        </div>
    )
}

export default MobileMenu;