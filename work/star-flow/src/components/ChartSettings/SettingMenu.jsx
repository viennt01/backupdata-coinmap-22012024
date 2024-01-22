import styles from './styles.module.scss';

const MenuRender = ({ activeKey, onClick, menu }) =>
  Object.keys(menu).map((key) => {
    const item = menu[key];
    return (
      <div
        key={key}
        onClick={() => onClick(key)}
        className={`${styles.menuItem} ${
          activeKey === key ? styles.active : ''
        }`}
      >
        {item.name}
      </div>
    );
  });

const SettingMenu = ({ onClick, menu, activeKey }) => {
  return <MenuRender menu={menu} activeKey={activeKey} onClick={onClick} />;
};

export default SettingMenu;
