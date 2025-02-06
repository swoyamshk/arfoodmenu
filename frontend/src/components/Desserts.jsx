// src/pages/Desserts.jsx
import MenuSection from '../components/MenuSection';
import { menuData } from '../App';

export default function Desserts() {
  return (
    <MenuSection title="Desserts" items={menuData[2].items} />
  );
}
