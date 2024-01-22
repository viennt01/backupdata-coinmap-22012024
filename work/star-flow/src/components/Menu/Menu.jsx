import { useCallback, useEffect, useState } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import Img from 'next/image';
//import { ThemeConsumer } from '../context/ThemeContext';
import logo from '@/assets/images/logo/logo.png';
import IconSetting from '@/assets/images/icons/setting.svg';
import SvgPanels from '@/assets/images/svg/panels.svg';
import SvgAssistant from '@/assets/images/svg/assistant.svg';
import SvgSun from '@/assets/images/svg/sun.svg';
import style from './style.module.scss';
import { showInfoIncomming } from '@/utils/alert';
import { EXTERNAL_URLS, LOCAL_CACHE_KEYS } from '@/config';
import Layout from './Layout';

const getLocalHeaderState = () => {
  if (typeof localStorage === 'undefined') {
    return true;
  }
  return localStorage.getItem(LOCAL_CACHE_KEYS.UI_HEADER) === 'true';
};
const setLocalHeaderState = (state) => {
  return localStorage.setItem(LOCAL_CACHE_KEYS.UI_HEADER, state);
};

const Header = () => {
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    if (!getLocalHeaderState()) {
      setIsShow(false);
    }
  }, []);

  const handleToggle = useCallback(() => {
    const newValue = !isShow;
    setIsShow(newValue);
    setLocalHeaderState(newValue);
  }, [setIsShow, isShow]);

  return (
    <>
      <div
        className={`${style.toggleHeader} ${!isShow ? style.show : ''}`}
        onClick={handleToggle}
      />
      <div
        className={`${style.headerPlaceholder} ${isShow ? '' : style.hide}`}
      />
      <header className={`${style.header} ${!isShow ? style.hide : ''}`}>
        <Navbar expand="md">
          <Link href="/" passHref>
            <a className={`navbar-brand ${style.logo}`}>
              <Img src={logo} alt="logo" height={60} width={60} />
            </a>
          </Link>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
          <Navbar.Collapse className={style.navCollapse}>
            <Nav className="navbar-nav me-auto">
              <Nav.Item as="li" className={style.itemWrapper}>
                <Nav.Link href="#" className={`${style.menuItem} disabled`}>
                  <div>
                    <SvgPanels height={20} />
                  </div>
                  <span>PANELS</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className={style.itemWrapper}>
                <Nav.Link
                  href="#"
                  onClick={showInfoIncomming}
                  className={`${style.menuItem} disabled`}
                >
                  <div>
                    <SvgAssistant height={20} />
                  </div>
                  <span>ASSISTANT</span>
                </Nav.Link>
              </Nav.Item>
              <Layout />
              <Nav.Item as="li" className={style.itemWrapper}>
                <Nav.Link
                  href={EXTERNAL_URLS.FEEDBACK_FORM}
                  target="_blank"
                  title="Feedback"
                  className={style.menuItem}
                >
                  <button className="btn btn-sm btn-primary btn-cm-primary">
                    Feedback
                  </button>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Nav className="navbar-nav ms-auto">
              <Nav.Item
                as="li"
                className={`${style.itemWrapper} ${style.noBorderLeft}`}
              >
                <Nav.Link
                  href="#"
                  className={`${style.menuItem} disabled`}
                  onClick={showInfoIncomming}
                >
                  <div>
                    <SvgSun height={20} />
                  </div>
                  <span>LIGHT</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className={style.itemWrapper}>
                <Nav.Link
                  href="#"
                  className={`${style.menuItem} dropdown-toggle disabled`}
                  onClick={showInfoIncomming}
                >
                  <span>WALLET</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li" className={style.itemWrapper}>
                <Nav.Link
                  href="#"
                  className={`${style.menuItem} disabled`}
                  onClick={showInfoIncomming}
                >
                  <div>
                    <span className={style.connectStatus}></span>
                    <span className={style.networkName}>Binance Futures</span>
                  </div>
                  <div className={style.statusInfo}>
                    P: 67ms <span className={style.devider} /> RTT: 312ms
                  </div>
                </Nav.Link>
              </Nav.Item>
              {/* <NavDropdown title="WALLET" onClick={showInfoIncomming} /> */}
              {/* <Link href="/" className="dropdown-item">
                  Fiat and Spot
                </Link>
                <Link href="/" className="dropdown-item">
                  Margin
                </Link>
                <Link href="/" className="dropdown-item">
                  Futures
                </Link> */}
              {/* </NavDropdown> */}
              <Nav.Item as="li" className={style.itemWrapper}>
                <Dropdown className={style.menuItem}>
                  <Dropdown.Toggle
                    variant="default"
                    className="d-flex align-items-center disabled"
                    onClick={showInfoIncomming}
                  >
                    <Img
                      src={logo}
                      width={26}
                      height={26}
                      layout="fixed"
                      unoptimized
                      alt="logo"
                      className={style.verticleBottom}
                    />
                    <span className={style.userName}>CoinMap</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <div className="dropdown-header d-flex flex-column align-items-center">
                      <div className="figure mb-3">
                        <Img src={logo} alt="logo" />
                      </div>
                      <div className="info text-center">
                        <p className="name font-weight-bold mb-0">CoinMap</p>
                        <p className="email text-muted mb-3">
                          hello@coinmap.tech
                        </p>
                      </div>
                    </div>
                    <div className="dropdown-body">
                      <ul className="profile-nav">
                        <li className="nav-item">
                          <Link href="/" className="nav-link">
                            <span>Profile</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link href="/" className="nav-link">
                            <span>Dashboard</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link href="/" className="nav-link">
                            <span>Settings</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link href="/login" className="nav-link red">
                            <span>Log Out</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>
              <Nav.Item as="li" className={style.itemWrapper}>
                <Nav.Link
                  href="#"
                  className={`${style.menuItem} disabled`}
                  onClick={showInfoIncomming}
                >
                  <IconSetting height={24} fill="currentColor" />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
